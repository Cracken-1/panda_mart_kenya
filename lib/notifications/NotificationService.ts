/**
 * Comprehensive Notification Service
 * Handles email, SMS, push notifications, and in-app notifications
 */

import { RecaptchaServer } from '../security/recaptcha'

// Notification types
export type NotificationType = 
  | 'order' 
  | 'payment' 
  | 'loyalty' 
  | 'security' 
  | 'promotion' 
  | 'system' 
  | 'community'

export type NotificationChannel = 'email' | 'sms' | 'push' | 'in_app'

export interface NotificationData {
  userId: string
  type: NotificationType
  title: string
  message: string
  data?: Record<string, any>
  channels: NotificationChannel[]
  priority: 'low' | 'medium' | 'high' | 'urgent'
  actionUrl?: string
  expiresAt?: Date
}

export interface EmailTemplate {
  subject: string
  html: string
  text: string
}

export interface SMSTemplate {
  message: string
}

// Email Service using SendGrid
class EmailService {
  private apiKey: string

  constructor() {
    this.apiKey = process.env.SENDGRID_API_KEY || ''
    if (!this.apiKey) {
      console.warn('SendGrid API key not configured')
    }
  }

  async sendEmail(
    to: string, 
    template: EmailTemplate, 
    data: Record<string, any> = {}
  ): Promise<boolean> {
    if (!this.apiKey) {
      console.log('[EMAIL] SendGrid not configured, skipping email')
      return false
    }

    try {
      const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          personalizations: [{
            to: [{ email: to }],
            dynamic_template_data: data
          }],
          from: {
            email: process.env.FROM_EMAIL || 'noreply@pandamart.co.ke',
            name: 'Panda Mart Kenya'
          },
          subject: this.replacePlaceholders(template.subject, data),
          content: [
            {
              type: 'text/plain',
              value: this.replacePlaceholders(template.text, data)
            },
            {
              type: 'text/html',
              value: this.replacePlaceholders(template.html, data)
            }
          ]
        })
      })

      if (response.ok) {
        console.log(`[EMAIL] Sent successfully to ${to}`)
        return true
      } else {
        const error = await response.text()
        console.error(`[EMAIL] Failed to send to ${to}:`, error)
        return false
      }
    } catch (error) {
      console.error('[EMAIL] Send error:', error)
      return false
    }
  }

  private replacePlaceholders(template: string, data: Record<string, any>): string {
    return template.replace(/\{\{(\w+)\}\}/g, (match, key) => {
      return data[key] || match
    })
  }
}

// SMS Service using Africa's Talking
class SMSService {
  private username: string
  private apiKey: string
  private senderId: string

  constructor() {
    this.username = process.env.AFRICASTALKING_USERNAME || ''
    this.apiKey = process.env.AFRICASTALKING_API_KEY || ''
    this.senderId = process.env.SMS_SENDER_ID || 'PANDAMART'
    
    if (!this.username || !this.apiKey) {
      console.warn('Africa\'s Talking credentials not configured')
    }
  }

  async sendSMS(to: string, message: string): Promise<boolean> {
    if (!this.username || !this.apiKey) {
      console.log('[SMS] Africa\'s Talking not configured, skipping SMS')
      return false
    }

    try {
      const response = await fetch('https://api.africastalking.com/version1/messaging', {
        method: 'POST',
        headers: {
          'apiKey': this.apiKey,
          'Content-Type': 'application/x-www-form-urlencoded',
          'Accept': 'application/json'
        },
        body: new URLSearchParams({
          username: this.username,
          to: to,
          message: message,
          from: this.senderId
        })
      })

      const result = await response.json()
      
      if (result.SMSMessageData?.Recipients?.[0]?.status === 'Success') {
        console.log(`[SMS] Sent successfully to ${to}`)
        return true
      } else {
        console.error(`[SMS] Failed to send to ${to}:`, result)
        return false
      }
    } catch (error) {
      console.error('[SMS] Send error:', error)
      return false
    }
  }

  // Format phone number for Kenya
  formatPhoneNumber(phone: string): string {
    // Remove all non-digits
    const digits = phone.replace(/\D/g, '')
    
    // Handle different Kenya phone formats
    if (digits.startsWith('254')) {
      return '+' + digits
    } else if (digits.startsWith('0')) {
      return '+254' + digits.substring(1)
    } else if (digits.length === 9) {
      return '+254' + digits
    }
    
    return phone // Return original if can't parse
  }
}

// Push Notification Service using Firebase
class PushNotificationService {
  private projectId: string
  private privateKey: string
  private clientEmail: string

  constructor() {
    this.projectId = process.env.FIREBASE_PROJECT_ID || ''
    this.privateKey = process.env.FIREBASE_PRIVATE_KEY || ''
    this.clientEmail = process.env.FIREBASE_CLIENT_EMAIL || ''
    
    if (!this.projectId || !this.privateKey || !this.clientEmail) {
      console.warn('Firebase credentials not configured')
    }
  }

  async sendPushNotification(
    token: string, 
    title: string, 
    body: string, 
    data?: Record<string, any>
  ): Promise<boolean> {
    if (!this.projectId || !this.privateKey || !this.clientEmail) {
      console.log('[PUSH] Firebase not configured, skipping push notification')
      return false
    }

    try {
      // Get access token
      const accessToken = await this.getAccessToken()
      
      const response = await fetch(
        `https://fcm.googleapis.com/v1/projects/${this.projectId}/messages:send`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            message: {
              token: token,
              notification: {
                title: title,
                body: body
              },
              data: data || {},
              android: {
                notification: {
                  icon: 'ic_notification',
                  color: '#FF6B35'
                }
              },
              apns: {
                payload: {
                  aps: {
                    badge: 1,
                    sound: 'default'
                  }
                }
              }
            }
          })
        }
      )

      if (response.ok) {
        console.log(`[PUSH] Sent successfully to token: ${token.substring(0, 20)}...`)
        return true
      } else {
        const error = await response.text()
        console.error(`[PUSH] Failed to send:`, error)
        return false
      }
    } catch (error) {
      console.error('[PUSH] Send error:', error)
      return false
    }
  }

  private async getAccessToken(): Promise<string> {
    // In a real implementation, use Google Auth Library
    // For now, return a placeholder
    return 'placeholder-access-token'
  }
}

// In-App Notification Service
class InAppNotificationService {
  async createNotification(notification: NotificationData): Promise<boolean> {
    try {
      // In a real implementation, save to database
      console.log('[IN_APP] Creating notification:', {
        userId: notification.userId,
        type: notification.type,
        title: notification.title,
        message: notification.message,
        priority: notification.priority,
        actionUrl: notification.actionUrl,
        expiresAt: notification.expiresAt,
        createdAt: new Date()
      })
      
      // TODO: Save to database
      // await db.notifications.create({ data: notificationData })
      
      return true
    } catch (error) {
      console.error('[IN_APP] Create error:', error)
      return false
    }
  }

  async markAsRead(userId: string, notificationId: string): Promise<boolean> {
    try {
      // TODO: Update database
      console.log(`[IN_APP] Marking notification ${notificationId} as read for user ${userId}`)
      return true
    } catch (error) {
      console.error('[IN_APP] Mark as read error:', error)
      return false
    }
  }

  async getUserNotifications(
    userId: string, 
    limit: number = 20, 
    offset: number = 0
  ): Promise<any[]> {
    try {
      // TODO: Fetch from database
      console.log(`[IN_APP] Fetching notifications for user ${userId}`)
      return []
    } catch (error) {
      console.error('[IN_APP] Fetch error:', error)
      return []
    }
  }
}

// Main Notification Service
export class NotificationService {
  private emailService: EmailService
  private smsService: SMSService
  private pushService: PushNotificationService
  private inAppService: InAppNotificationService

  constructor() {
    this.emailService = new EmailService()
    this.smsService = new SMSService()
    this.pushService = new PushNotificationService()
    this.inAppService = new InAppNotificationService()
  }

  async sendNotification(notification: NotificationData, userContact: {
    email?: string
    phone?: string
    pushToken?: string
  }): Promise<{ success: boolean; results: Record<NotificationChannel, boolean> }> {
    const results: Record<NotificationChannel, boolean> = {
      email: false,
      sms: false,
      push: false,
      in_app: false
    }

    // Send to requested channels
    const promises = notification.channels.map(async (channel) => {
      switch (channel) {
        case 'email':
          if (userContact.email) {
            const template = this.getEmailTemplate(notification.type, notification)
            results.email = await this.emailService.sendEmail(
              userContact.email, 
              template, 
              { 
                ...notification.data,
                title: notification.title,
                message: notification.message,
                actionUrl: notification.actionUrl
              }
            )
          }
          break

        case 'sms':
          if (userContact.phone) {
            const formattedPhone = this.smsService.formatPhoneNumber(userContact.phone)
            const smsMessage = this.getSMSTemplate(notification.type, notification)
            results.sms = await this.smsService.sendSMS(formattedPhone, smsMessage.message)
          }
          break

        case 'push':
          if (userContact.pushToken) {
            results.push = await this.pushService.sendPushNotification(
              userContact.pushToken,
              notification.title,
              notification.message,
              notification.data
            )
          }
          break

        case 'in_app':
          results.in_app = await this.inAppService.createNotification(notification)
          break
      }
    })

    await Promise.all(promises)

    const success = Object.values(results).some(result => result)
    
    console.log(`[NOTIFICATION] Sent ${notification.type} notification to user ${notification.userId}:`, results)
    
    return { success, results }
  }

  // Predefined notification templates
  private getEmailTemplate(type: NotificationType, notification: NotificationData): EmailTemplate {
    const templates: Record<NotificationType, EmailTemplate> = {
      order: {
        subject: 'Order Update - {{title}}',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: linear-gradient(135deg, #FF6B35, #F7931E); padding: 20px; text-align: center;">
              <h1 style="color: white; margin: 0;">Panda Mart Kenya</h1>
            </div>
            <div style="padding: 20px;">
              <h2>{{title}}</h2>
              <p>{{message}}</p>
              {{#if actionUrl}}
              <a href="{{actionUrl}}" style="background: #FF6B35; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block; margin-top: 15px;">
                View Order Details
              </a>
              {{/if}}
            </div>
            <div style="background: #f8f9fa; padding: 15px; text-align: center; font-size: 12px; color: #666;">
              <p>Panda Mart Kenya | Your World of Amazing Deals</p>
              <p>If you have any questions, contact us at support@pandamart.co.ke</p>
            </div>
          </div>
        `,
        text: '{{title}}\n\n{{message}}\n\n{{#if actionUrl}}View details: {{actionUrl}}{{/if}}\n\nPanda Mart Kenya'
      },
      payment: {
        subject: 'Payment Confirmation - Panda Mart',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: linear-gradient(135deg, #28a745, #20c997); padding: 20px; text-align: center;">
              <h1 style="color: white; margin: 0;">Payment Confirmed</h1>
            </div>
            <div style="padding: 20px;">
              <h2>{{title}}</h2>
              <p>{{message}}</p>
              {{#if actionUrl}}
              <a href="{{actionUrl}}" style="background: #28a745; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block; margin-top: 15px;">
                View Receipt
              </a>
              {{/if}}
            </div>
          </div>
        `,
        text: '{{title}}\n\n{{message}}\n\n{{#if actionUrl}}View receipt: {{actionUrl}}{{/if}}'
      },
      loyalty: {
        subject: 'Panda Points Update',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: linear-gradient(135deg, #ffd700, #ffed4e); padding: 20px; text-align: center;">
              <h1 style="color: #333; margin: 0;">🐼 Panda Points</h1>
            </div>
            <div style="padding: 20px;">
              <h2>{{title}}</h2>
              <p>{{message}}</p>
              {{#if actionUrl}}
              <a href="{{actionUrl}}" style="background: #ffd700; color: #333; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block; margin-top: 15px;">
                View Loyalty Dashboard
              </a>
              {{/if}}
            </div>
          </div>
        `,
        text: '{{title}}\n\n{{message}}\n\n{{#if actionUrl}}View dashboard: {{actionUrl}}{{/if}}'
      },
      security: {
        subject: 'Security Alert - Panda Mart Account',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: linear-gradient(135deg, #dc3545, #e74c3c); padding: 20px; text-align: center;">
              <h1 style="color: white; margin: 0;">🔒 Security Alert</h1>
            </div>
            <div style="padding: 20px;">
              <h2>{{title}}</h2>
              <p>{{message}}</p>
              <p style="color: #dc3545; font-weight: bold;">If this wasn't you, please secure your account immediately.</p>
              {{#if actionUrl}}
              <a href="{{actionUrl}}" style="background: #dc3545; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block; margin-top: 15px;">
                Secure Account
              </a>
              {{/if}}
            </div>
          </div>
        `,
        text: '{{title}}\n\n{{message}}\n\nIf this wasn\'t you, please secure your account immediately.\n\n{{#if actionUrl}}Secure account: {{actionUrl}}{{/if}}'
      },
      promotion: {
        subject: '🎉 Special Offer - Panda Mart',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: linear-gradient(135deg, #e91e63, #f06292); padding: 20px; text-align: center;">
              <h1 style="color: white; margin: 0;">🎉 Special Offer</h1>
            </div>
            <div style="padding: 20px;">
              <h2>{{title}}</h2>
              <p>{{message}}</p>
              {{#if actionUrl}}
              <a href="{{actionUrl}}" style="background: #e91e63; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block; margin-top: 15px;">
                Shop Now
              </a>
              {{/if}}
            </div>
          </div>
        `,
        text: '{{title}}\n\n{{message}}\n\n{{#if actionUrl}}Shop now: {{actionUrl}}{{/if}}'
      },
      system: {
        subject: 'System Update - Panda Mart',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: linear-gradient(135deg, #6c757d, #adb5bd); padding: 20px; text-align: center;">
              <h1 style="color: white; margin: 0;">System Update</h1>
            </div>
            <div style="padding: 20px;">
              <h2>{{title}}</h2>
              <p>{{message}}</p>
            </div>
          </div>
        `,
        text: '{{title}}\n\n{{message}}'
      },
      community: {
        subject: 'Community Update - Panda Mart',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: linear-gradient(135deg, #17a2b8, #20c997); padding: 20px; text-align: center;">
              <h1 style="color: white; margin: 0;">🏆 Community</h1>
            </div>
            <div style="padding: 20px;">
              <h2>{{title}}</h2>
              <p>{{message}}</p>
              {{#if actionUrl}}
              <a href="{{actionUrl}}" style="background: #17a2b8; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block; margin-top: 15px;">
                View Community
              </a>
              {{/if}}
            </div>
          </div>
        `,
        text: '{{title}}\n\n{{message}}\n\n{{#if actionUrl}}View community: {{actionUrl}}{{/if}}'
      }
    }

    return templates[type] || templates.system
  }

  private getSMSTemplate(type: NotificationType, notification: NotificationData): SMSTemplate {
    const templates: Record<NotificationType, SMSTemplate> = {
      order: {
        message: `Panda Mart: ${notification.title}. ${notification.message}${notification.actionUrl ? ` Details: ${notification.actionUrl}` : ''}`
      },
      payment: {
        message: `Panda Mart: Payment confirmed. ${notification.message}`
      },
      loyalty: {
        message: `Panda Mart: ${notification.title}. ${notification.message}`
      },
      security: {
        message: `Panda Mart Security: ${notification.message} If this wasn't you, secure your account immediately.`
      },
      promotion: {
        message: `Panda Mart Offer: ${notification.message}${notification.actionUrl ? ` Shop: ${notification.actionUrl}` : ''}`
      },
      system: {
        message: `Panda Mart: ${notification.message}`
      },
      community: {
        message: `Panda Mart Community: ${notification.message}`
      }
    }

    return templates[type] || templates.system
  }

  // Convenience methods for common notifications
  async sendOrderNotification(
    userId: string, 
    orderNumber: string, 
    status: string, 
    userContact: { email?: string; phone?: string; pushToken?: string }
  ) {
    const statusMessages = {
      confirmed: 'Your order has been confirmed and is being prepared.',
      shipped: 'Your order has been shipped and is on its way to you.',
      delivered: 'Your order has been delivered successfully.',
      cancelled: 'Your order has been cancelled as requested.'
    }

    return this.sendNotification({
      userId,
      type: 'order',
      title: `Order ${status.charAt(0).toUpperCase() + status.slice(1)}`,
      message: `Order #${orderNumber}: ${statusMessages[status as keyof typeof statusMessages] || 'Status updated'}`,
      channels: ['email', 'sms', 'push', 'in_app'],
      priority: 'high',
      actionUrl: `${process.env.NEXT_PUBLIC_APP_URL}/account/orders/${orderNumber}`,
      data: { orderNumber, status }
    }, userContact)
  }

  async sendPaymentNotification(
    userId: string, 
    amount: number, 
    method: string, 
    userContact: { email?: string; phone?: string; pushToken?: string }
  ) {
    return this.sendNotification({
      userId,
      type: 'payment',
      title: 'Payment Confirmed',
      message: `Your payment of KES ${amount.toLocaleString()} via ${method} has been processed successfully.`,
      channels: ['email', 'sms', 'push', 'in_app'],
      priority: 'high',
      actionUrl: `${process.env.NEXT_PUBLIC_APP_URL}/account/orders`,
      data: { amount, method }
    }, userContact)
  }

  async sendLoyaltyNotification(
    userId: string, 
    points: number, 
    action: 'earned' | 'redeemed', 
    userContact: { email?: string; phone?: string; pushToken?: string }
  ) {
    const message = action === 'earned' 
      ? `You earned ${points} Panda Points from your recent purchase!`
      : `You redeemed ${points} Panda Points successfully.`

    return this.sendNotification({
      userId,
      type: 'loyalty',
      title: `Panda Points ${action.charAt(0).toUpperCase() + action.slice(1)}`,
      message,
      channels: ['email', 'push', 'in_app'],
      priority: 'medium',
      actionUrl: `${process.env.NEXT_PUBLIC_APP_URL}/account/loyalty`,
      data: { points, action }
    }, userContact)
  }

  async sendSecurityAlert(
    userId: string, 
    event: string, 
    location: string, 
    userContact: { email?: string; phone?: string; pushToken?: string }
  ) {
    return this.sendNotification({
      userId,
      type: 'security',
      title: 'Security Alert',
      message: `${event} detected from ${location}. If this wasn't you, please secure your account.`,
      channels: ['email', 'sms', 'push', 'in_app'],
      priority: 'urgent',
      actionUrl: `${process.env.NEXT_PUBLIC_APP_URL}/account/security`,
      data: { event, location }
    }, userContact)
  }
}

// Export singleton instance
export const notificationService = new NotificationService()