import nodemailer from 'nodemailer'
import { db } from '../database'

export interface EmailOptions {
  to: string | string[]
  subject: string
  html?: string
  text?: string
  from?: string
  replyTo?: string
  attachments?: Array<{
    filename: string
    content: Buffer | string
    contentType?: string
  }>
}

export interface EmailResult {
  success: boolean
  messageId?: string
  error?: string
}

class EmailService {
  private transporter: nodemailer.Transporter | null = null
  private initialized = false
  private initPromise: Promise<void> | null = null

  constructor() {
    // Don't initialize during build time or static generation
    if (typeof window === 'undefined' && 
        process.env.NODE_ENV !== 'development' && 
        !process.env.VERCEL_ENV) {
      // Only initialize in runtime, not during build
      this.initPromise = this.initialize().catch(console.error)
    }
  }

  private async initialize() {
    if (this.initialized) return
    
    try {
      // Skip initialization if required environment variables are missing
      if (!process.env.SMTP_HOST && process.env.NODE_ENV === 'production') {
        console.log('Email service skipped - no SMTP configuration')
        return
      }

      // Configure transporter based on environment
      if (process.env.NODE_ENV === 'production' && process.env.SMTP_HOST) {
        // Production: Use SMTP service (e.g., SendGrid, AWS SES, etc.)
        this.transporter = nodemailer.createTransport({
          host: process.env.SMTP_HOST,
          port: parseInt(process.env.SMTP_PORT || '587'),
          secure: process.env.SMTP_SECURE === 'true',
          auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS || process.env.SMTP_PASSWORD,
          },
          tls: {
            rejectUnauthorized: false
          }
        })
      } else if (process.env.NODE_ENV === 'development') {
        // Development: Use Ethereal Email for testing
        try {
          const testAccount = await nodemailer.createTestAccount()
          
          this.transporter = nodemailer.createTransport({
            host: 'smtp.ethereal.email',
            port: 587,
            secure: false,
            auth: {
              user: testAccount.user,
              pass: testAccount.pass,
            },
          })
          
          console.log('Email service initialized with test account:', testAccount.user)
        } catch (error) {
          console.log('Could not create test account, email service disabled')
          return
        }
      }

      // Verify transporter configuration if available
      if (this.transporter) {
        await this.transporter.verify()
        this.initialized = true
        console.log('Email service initialized successfully')
      }
    } catch (error) {
      console.error('Failed to initialize email service:', error)
      this.initialized = false
    }
  }

  private async ensureInitialized() {
    if (!this.initialized && !this.initPromise) {
      this.initPromise = this.initialize()
    }
    if (this.initPromise) {
      await this.initPromise
    }
  }

  async sendEmail(options: EmailOptions): Promise<EmailResult> {
    await this.ensureInitialized()
    
    if (!this.initialized || !this.transporter) {
      console.log('Email service not available, skipping email send')
      return {
        success: false,
        error: 'Email service not initialized'
      }
    }

    try {
      const mailOptions = {
        from: options.from || process.env.SMTP_FROM || 'noreply@pandamart.co.ke',
        to: Array.isArray(options.to) ? options.to.join(', ') : options.to,
        subject: options.subject,
        html: options.html,
        text: options.text,
        replyTo: options.replyTo,
        attachments: options.attachments,
      }

      const info = await this.transporter.sendMail(mailOptions)
      
      // Log successful email in development
      if (process.env.NODE_ENV !== 'production') {
        console.log('Email sent successfully:', {
          messageId: info.messageId,
          to: options.to,
          subject: options.subject,
          previewUrl: nodemailer.getTestMessageUrl(info)
        })
      }

      return {
        success: true,
        messageId: info.messageId
      }
    } catch (error) {
      console.error('Failed to send email:', {
        error: error.message,
        to: options.to,
        subject: options.subject
      })

      return {
        success: false,
        error: error.message
      }
    }
  }

  async sendBulkEmails(emails: EmailOptions[]): Promise<EmailResult[]> {
    const results: EmailResult[] = []
    
    // Send emails in batches to avoid overwhelming the SMTP server
    const batchSize = 10
    for (let i = 0; i < emails.length; i += batchSize) {
      const batch = emails.slice(i, i + batchSize)
      const batchPromises = batch.map(email => this.sendEmail(email))
      const batchResults = await Promise.allSettled(batchPromises)
      
      batchResults.forEach((result, index) => {
        if (result.status === 'fulfilled') {
          results.push(result.value)
        } else {
          results.push({
            success: false,
            error: result.reason?.message || 'Unknown error'
          })
        }
      })
      
      // Add delay between batches
      if (i + batchSize < emails.length) {
        await new Promise(resolve => setTimeout(resolve, 1000))
      }
    }
    
    return results
  }

  async sendTemplateEmail(
    templateName: string,
    to: string | string[],
    variables: Record<string, any> = {}
  ): Promise<EmailResult> {
    try {
      // Get template from database
      const templateQuery = 'SELECT * FROM email_templates WHERE name = $1 AND is_active = TRUE'
      const templateResult = await db.query(templateQuery, [templateName])
      
      if (!templateResult.rows.length) {
        return {
          success: false,
          error: `Email template '${templateName}' not found`
        }
      }
      
      const template = templateResult.rows[0]
      
      // Replace variables in template
      let subject = template.subject
      let body = template.body
      
      Object.entries(variables).forEach(([key, value]) => {
        const regex = new RegExp(`{{${key}}}`, 'g')
        subject = subject.replace(regex, String(value))
        body = body.replace(regex, String(value))
      })
      
      return await this.sendEmail({
        to,
        subject,
        html: body
      })
    } catch (error) {
      console.error('Failed to send template email:', error)
      return {
        success: false,
        error: error.message
      }
    }
  }

  async getEmailStats(hours: number = 24): Promise<{
    totalSent: number
    totalFailed: number
    successRate: number
    recentEmails: Array<{
      email: string
      subject: string
      status: string
      sent_at: Date
    }>
  }> {
    try {
      const timeframe = `${hours} hours`
      
      // Get email statistics
      const statsQuery = `
        SELECT 
          COUNT(*) as total,
          COUNT(CASE WHEN status = 'sent' THEN 1 END) as sent,
          COUNT(CASE WHEN status = 'failed' THEN 1 END) as failed
        FROM email_log 
        WHERE sent_at > NOW() - INTERVAL '${timeframe}'
      `
      
      const statsResult = await db.query(statsQuery)
      const stats = statsResult.rows[0]
      
      // Get recent emails
      const recentQuery = `
        SELECT email, subject, status, sent_at
        FROM email_log 
        WHERE sent_at > NOW() - INTERVAL '${timeframe}'
        ORDER BY sent_at DESC
        LIMIT 10
      `
      
      const recentResult = await db.query(recentQuery)
      
      const totalSent = parseInt(stats.sent) || 0
      const totalFailed = parseInt(stats.failed) || 0
      const total = parseInt(stats.total) || 0
      
      return {
        totalSent,
        totalFailed,
        successRate: total > 0 ? (totalSent / total) * 100 : 0,
        recentEmails: recentResult.rows
      }
    } catch (error) {
      console.error('Error getting email stats:', error)
      return {
        totalSent: 0,
        totalFailed: 0,
        successRate: 0,
        recentEmails: []
      }
    }
  }

  async healthCheck(): Promise<{ healthy: boolean; message: string }> {
    if (!this.initialized || !this.transporter) {
      return {
        healthy: false,
        message: 'Email service not initialized'
      }
    }

    try {
      await this.transporter.verify()
      return {
        healthy: true,
        message: 'Email service is healthy'
      }
    } catch (error) {
      return {
        healthy: false,
        message: `Email service error: ${error.message}`
      }
    }
  }
}

// Export singleton instance
export const emailService = new EmailService()

// Export class for testing
export { EmailService }