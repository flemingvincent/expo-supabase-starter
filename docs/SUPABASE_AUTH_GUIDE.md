# Supabase Authentication Guide

## Overview
This guide explains how to configure and use Supabase's built-in authentication methods for your mobile app.

## Supported Authentication Methods

### 1. Email/Password Authentication (Already Configured)
```typescript
// Sign up
await supabase.auth.signUp({
  email: 'user@example.com',
  password: 'password123',
});

// Sign in
await supabase.auth.signInWithPassword({
  email: 'user@example.com',
  password: 'password123',
});
```

### 2. Phone/SMS Authentication
To use Supabase's native phone authentication:

#### Setup in Supabase Dashboard:
1. Go to Authentication > Providers
2. Enable Phone provider
3. Configure SMS provider (Twilio, MessageBird, or Vonage)
4. Add your SMS provider credentials

#### Implementation:
```typescript
// Send OTP
const { data, error } = await supabase.auth.signInWithOtp({
  phone: '+8613800138000', // Must include country code
});

// Verify OTP
const { data, error } = await supabase.auth.verifyOtp({
  phone: '+8613800138000',
  token: '123456',
  type: 'sms',
});
```

### 3. Social Authentication

#### Setup Social Providers:
1. Go to Authentication > Providers in Supabase Dashboard
2. Enable desired providers (Google, GitHub, Apple, etc.)
3. Add OAuth credentials from each provider

#### Implementation:
```typescript
// Google Sign In
const { data, error } = await supabase.auth.signInWithOAuth({
  provider: 'google',
  options: {
    redirectTo: 'your-app-scheme://auth-callback',
  },
});

// Apple Sign In
const { data, error } = await supabase.auth.signInWithOAuth({
  provider: 'apple',
  options: {
    redirectTo: 'your-app-scheme://auth-callback',
  },
});

// GitHub Sign In
const { data, error } = await supabase.auth.signInWithOAuth({
  provider: 'github',
});
```

### 4. Magic Link (Passwordless Email)
```typescript
// Send magic link
const { data, error } = await supabase.auth.signInWithOtp({
  email: 'user@example.com',
  options: {
    emailRedirectTo: 'your-app-scheme://auth-callback',
  },
});
```

## Current Implementation Status

### ✅ Available Now
- **Email/Password**: Fully implemented using Supabase
- **Custom Phone Auth**: Using Alibaba Cloud SMS (for China market)

### 🔧 Can Be Enabled
- **Supabase Phone Auth**: Code is ready, requires SMS provider setup
- **Social Providers**: Requires OAuth credentials
- **Magic Link**: Ready to use

## Switching Between Authentication Methods

### Use Supabase Native Phone Auth
Uncomment the Supabase code in `context/supabase-provider.tsx`:

```typescript
// In signInWithPhone function:
const { data, error } = await supabase.auth.signInWithOtp({
  phone: phone.startsWith('+') ? phone : `+86${phone}`,
});

// In verifyOTP function:
const { data, error } = await supabase.auth.verifyOtp({
  phone: phone.startsWith('+') ? phone : `+86${phone}`,
  token: otp,
  type: 'sms',
});
```

### Keep Custom Backend (Recommended for China)
The current implementation uses a custom backend with Alibaba Cloud SMS, which is better for:
- China market (Alibaba Cloud has better delivery rates)
- Custom business logic
- Multiple SMS providers
- Cost optimization

## Configuration Steps

### 1. Email/Password (Already Done)
No additional configuration needed - working out of the box.

### 2. Phone Authentication Setup

#### Option A: Use Supabase (International)
1. Sign up for Twilio/MessageBird/Vonage
2. Get API credentials
3. In Supabase Dashboard:
   - Go to Authentication > Providers > Phone
   - Enable Phone provider
   - Add SMS provider credentials
4. Update code to use Supabase methods

#### Option B: Use Custom Backend (China/Custom)
1. Keep current implementation (already working)
2. Backend uses Alibaba Cloud SMS
3. Better for China market

### 3. Social Providers Setup

#### Google
1. Create project in Google Cloud Console
2. Enable Google+ API
3. Create OAuth 2.0 credentials
4. Add to Supabase Dashboard

#### Apple
1. Enroll in Apple Developer Program
2. Create App ID with Sign in with Apple capability
3. Create Service ID
4. Add to Supabase Dashboard

#### GitHub
1. Register OAuth App in GitHub Settings
2. Get Client ID and Secret
3. Add to Supabase Dashboard

## Security Considerations

1. **Row Level Security (RLS)**
   - Enable RLS on all tables
   - Create policies for user data access

2. **Email Verification**
   - Enable in Authentication > Settings
   - Customize email templates

3. **Phone Verification**
   - Always verify phone numbers
   - Implement rate limiting

4. **Session Management**
   - Use refresh tokens
   - Implement auto-logout for sensitive apps

## Environment Variables

```bash
# .env
EXPO_PUBLIC_SUPABASE_URL=your-project-url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# For custom backend (current setup)
EXPO_PUBLIC_API_URL=http://localhost:3001

# For social auth (if needed)
EXPO_PUBLIC_GOOGLE_CLIENT_ID=your-google-client-id
EXPO_PUBLIC_APPLE_CLIENT_ID=your-apple-client-id
```

## Testing Different Auth Methods

### Test Accounts (Custom Backend)
- Email: `test@example.com` / Password: `Test123456`
- Username: `student1` / Password: `Student123`
- Phone: `13800138000` / Password: `Demo123456`

### Test with Supabase
1. Create test users in Authentication > Users
2. Use Supabase Dashboard to send test OTPs
3. Monitor auth logs in Dashboard

## Troubleshooting

### Phone Auth Not Working
- Check SMS provider credentials
- Verify phone number format (+country code)
- Check SMS provider balance/quota

### Social Auth Redirect Issues
- Ensure redirect URLs are configured
- Check deep linking setup for mobile
- Verify OAuth credentials

### Session Persistence
- Check AsyncStorage implementation
- Verify refresh token handling
- Monitor session expiry

## Migration Path

To migrate from custom backend to Supabase:
1. Export user data from custom backend
2. Import users to Supabase using Admin API
3. Update auth methods in code
4. Test thoroughly before switching production

## Recommended Setup for Your App

Given your requirements for China market:
1. **Keep custom backend for phone auth** (Alibaba Cloud SMS)
2. **Use Supabase for email/password**
3. **Add social providers as needed**
4. **Consider magic links for better UX**

This hybrid approach gives you the best of both worlds:
- Reliable SMS delivery in China
- Supabase's robust email auth
- Easy social provider integration
- Flexibility for future expansion