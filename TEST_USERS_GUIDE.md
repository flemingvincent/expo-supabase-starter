# Test Users Setup Guide

## Quick Setup - Using Supabase Dashboard

### Method 1: Create Users via Dashboard UI (Easiest)

1. Go to your [Supabase Dashboard](https://supabase.com/dashboard)
2. Navigate to **Authentication** > **Users**
3. Click **Add user** > **Create new user**
4. Create these test accounts:

| Email | Password | Display Name |
|-------|----------|--------------|
| demo@example.com | Demo123456 | 演示用户 |
| student@example.com | Student123 | 测试学生 |
| teacher@example.com | Teacher123 | 测试老师 |

5. Check "Auto Confirm User" when creating each user

### Method 2: Using SQL Editor (Advanced)

1. Go to **SQL Editor** in your Supabase Dashboard
2. Run the SQL script in `supabase/create-test-users.sql`
3. Or use this simple approach:

```sql
-- Create a test user with verified email
INSERT INTO auth.users (
    email,
    encrypted_password,
    email_confirmed_at,
    raw_user_meta_data
) VALUES (
    'test@example.com',
    crypt('Test123456', gen_salt('bf')),
    now(),
    '{"name": "Test User"}'::jsonb
);
```

### Method 3: Using Supabase Client (Development)

Create a temporary script `create-users.js`:

```javascript
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  'YOUR_SUPABASE_URL',
  'YOUR_SERVICE_ROLE_KEY' // Use service role key, not anon key
);

async function createTestUsers() {
  const users = [
    { email: 'demo@example.com', password: 'Demo123456' },
    { email: 'student@example.com', password: 'Student123' },
    { email: 'teacher@example.com', password: 'Teacher123' }
  ];

  for (const user of users) {
    const { data, error } = await supabase.auth.admin.createUser({
      email: user.email,
      password: user.password,
      email_confirm: true
    });
    
    if (error) {
      console.error(`Failed to create ${user.email}:`, error);
    } else {
      console.log(`Created user: ${user.email}`);
    }
  }
}

createTestUsers();
```

## Testing the App

1. Start the development server:
```bash
yarn start
# or
npx expo start --clear
```

2. Open the app on your device/simulator
3. Navigate to Sign In page
4. Use any of the test accounts above to login

## Important Notes

- **Email Confirmation**: Test users should have `email_confirmed_at` set to bypass email verification
- **Password Requirements**: Minimum 6 characters for Supabase
- **Phone Auth**: Requires SMS provider setup in Supabase Dashboard (Twilio/MessageBird)
- **Social Auth**: Requires OAuth provider configuration

## Troubleshooting

### Cannot login with test users
- Check if email is confirmed in Supabase Dashboard
- Verify password meets requirements (min 6 chars)
- Check Supabase logs for auth errors

### Auth state not updating
- Clear app cache: `npx expo start --clear`
- Check network connection
- Verify Supabase URL and anon key in `.env`

### Session not persisting
- AsyncStorage might be full - clear app data
- Check if session refresh is working
- Verify auth listener is set up correctly