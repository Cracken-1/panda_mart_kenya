# OAuth Setup Guide

## Quick Development Setup (Simulation Mode)

For immediate testing without setting up OAuth providers, you can use simulation mode:

### Enable Simulation Mode
Add this to your `.env.local` file:
```env
NODE_ENV=development
OAUTH_SIMULATION=true
```

This will allow you to test the OAuth flow with simulated Google and Apple sign-in.

## Production OAuth Setup

### Google OAuth Setup

1. **Go to Google Cloud Console**
   - Visit: https://console.cloud.google.com/
   - Create a new project or select an existing one

2. **Enable Google+ API**
   - Go to "APIs & Services" > "Library"
   - Search for "Google+ API" and enable it
   - Also enable "Google OAuth2 API"

3. **Create OAuth 2.0 Credentials**
   - Go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "OAuth 2.0 Client IDs"
   - Choose "Web application"
   - Add authorized redirect URIs:
     - `http://localhost:3000/api/auth/oauth/google/callback` (development)
     - `https://yourdomain.com/api/auth/oauth/google/callback` (production)

4. **Add to Environment Variables**
   ```env
   GOOGLE_CLIENT_ID=your_google_client_id_here
   GOOGLE_CLIENT_SECRET=your_google_client_secret_here
   GOOGLE_REDIRECT_URI=http://localhost:3000/api/auth/oauth/google/callback
   ```

### Apple OAuth Setup

1. **Apple Developer Account Required**
   - You need a paid Apple Developer account ($99/year)
   - Visit: https://developer.apple.com/

2. **Create App ID**
   - Go to "Certificates, Identifiers & Profiles"
   - Create a new App ID with "Sign In with Apple" capability

3. **Create Service ID**
   - Create a new Services ID
   - Enable "Sign In with Apple"
   - Configure domains and redirect URLs:
     - Domain: `localhost:3000` (development) or `yourdomain.com` (production)
     - Redirect URL: `http://localhost:3000/api/auth/oauth/apple/callback`

4. **Create Private Key**
   - Go to "Keys" section
   - Create a new key with "Sign In with Apple" enabled
   - Download the .p8 file

5. **Add to Environment Variables**
   ```env
   APPLE_CLIENT_ID=your_apple_service_id
   APPLE_TEAM_ID=your_apple_team_id
   APPLE_KEY_ID=your_apple_key_id
   APPLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour private key content here\n-----END PRIVATE KEY-----"
   APPLE_REDIRECT_URI=http://localhost:3000/api/auth/oauth/apple/callback
   ```

## Environment Variables Template

Create a `.env.local` file in your project root:

```env
# Development Mode
NODE_ENV=development

# OAuth Simulation (for development without real OAuth setup)
OAUTH_SIMULATION=true

# Google OAuth (when ready for real OAuth)
# GOOGLE_CLIENT_ID=your_google_client_id
# GOOGLE_CLIENT_SECRET=your_google_client_secret
# GOOGLE_REDIRECT_URI=http://localhost:3000/api/auth/oauth/google/callback

# Apple OAuth (when ready for real OAuth)
# APPLE_CLIENT_ID=your_apple_service_id
# APPLE_TEAM_ID=your_apple_team_id
# APPLE_KEY_ID=your_apple_key_id
# APPLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour private key content\n-----END PRIVATE KEY-----"
# APPLE_REDIRECT_URI=http://localhost:3000/api/auth/oauth/apple/callback

# JWT Secrets
JWT_SECRET=your-jwt-secret-key-here
JWT_REFRESH_SECRET=your-jwt-refresh-secret-key-here

# App URL
NEXTAUTH_URL=http://localhost:3000
```

## Testing OAuth

### With Simulation Mode
1. Set `OAUTH_SIMULATION=true` in your `.env.local`
2. Try signing in with Google or Apple
3. A popup will appear with "Simulate Success" and "Cancel" buttons
4. Click "Simulate Success" to test the flow

### With Real OAuth
1. Configure the OAuth providers as described above
2. Set `OAUTH_SIMULATION=false` or remove it
3. Test with real Google/Apple accounts

## Troubleshooting

### Common Issues

1. **"OAuth is not configured" error**
   - Enable simulation mode: `OAUTH_SIMULATION=true`
   - Or set up real OAuth credentials

2. **Redirect URI mismatch**
   - Make sure your redirect URIs in OAuth provider settings match your environment
   - Development: `http://localhost:3000/api/auth/oauth/[provider]/callback`
   - Production: `https://yourdomain.com/api/auth/oauth/[provider]/callback`

3. **Invalid client error**
   - Double-check your client ID and secret
   - Make sure the OAuth provider is properly configured

4. **Popup blocked**
   - Allow popups for your domain
   - Some browsers block OAuth popups by default

### Development vs Production

- **Development**: Use simulation mode or localhost redirect URIs
- **Production**: Use real OAuth credentials with HTTPS redirect URIs
- **Staging**: Use separate OAuth apps for staging environment

## Security Notes

- Never commit OAuth secrets to version control
- Use different OAuth apps for development, staging, and production
- Regularly rotate your OAuth secrets
- Use HTTPS in production
- Validate all OAuth responses on the server side