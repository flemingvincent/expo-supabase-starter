# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Educational mobile app with multiple authentication methods and AI chat features:

- **Expo SDK 53** + **Expo Router v5** for file-based navigation
- **Dual Authentication**: Supabase + Custom Backend (Alibaba Cloud SMS for China)
- **NativeWind v4** (Tailwind CSS for React Native)
- **React Hook Form** + **Zod** for form validation
- **TypeScript** with strict mode enabled
- **Coze API** for AI chat functionality
- **react-native-reusables** for shadcn/ui component patterns

## Essential Commands

```bash
# Development
yarn start                    # Start Expo dev server
yarn ios                      # Run on iOS simulator
yarn android                  # Run on Android emulator
yarn web                      # Run in browser

# Code Quality
yarn lint                     # ESLint with auto-fix (required before commits)
yarn generate-colors          # Generate colors from global.css

# Clean Start (when encountering issues)
npx expo start --clear --reset-cache

# Backend Server (for custom auth)
cd backend && npm install     # Install backend dependencies
cd backend && PORT=3001 npm start  # Start backend on port 3001
```

## Project Architecture

### File-Based Routing Structure
```
app/
├── _layout.tsx                 # Root with AuthProvider & protected route logic
├── (protected)/                # Authenticated routes (guard: !!session)
│   ├── _layout.tsx            # Tab navigation setup
│   ├── (tabs)/
│   │   ├── index.tsx          # Home tab
│   │   └── settings.tsx       # Settings tab
│   └── modal.tsx              # Modal screens
└── (public)/                   # Unauthenticated routes (guard: !session)
    ├── _layout.tsx            # Stack navigation
    ├── welcome.tsx            # Landing screen
    ├── sign-in.tsx            # Login form
    └── sign-up.tsx            # Registration form
```

### Core Systems

**Authentication (`context/supabase-provider.tsx`)**
- Global auth state via Context API
- Dual authentication system:
  - **Supabase Native**: Email/password, social providers, magic links
  - **Custom Backend**: Phone/SMS via Alibaba Cloud (for China market)
- Methods: 
  - `signUp()`, `signIn()` - Supabase email/password
  - `signInWithAccount()` - Custom backend account login
  - `signInWithPhone()`, `verifyOTP()` - Phone authentication
  - `signOut()` - Universal sign out
- Auto-refresh on app foreground via `AppState` listener
- Session persistence with AsyncStorage

**Available Authentication Methods**
1. **Email/Password** (Supabase) - ✅ Active
2. **Account/Password** (Custom Backend) - ✅ Active
   - Test accounts available: test@example.com, student1, 13800138000
3. **Phone/SMS** (Custom Backend with Alibaba Cloud) - ✅ Active
4. **Phone/SMS** (Supabase with Twilio/MessageBird) - 🔧 Ready but requires setup
5. **Social Providers** (Google, Apple, GitHub, etc.) - 🔧 Ready but requires OAuth setup
6. **Magic Links** (Passwordless email) - 🔧 Ready to use

**Supabase Client (`config/supabase.ts`)**
- Configured with AsyncStorage for session persistence
- Auto-refresh token management
- Environment variables: `EXPO_PUBLIC_SUPABASE_URL`, `EXPO_PUBLIC_SUPABASE_ANON_KEY`

**Form Validation Pattern**
```typescript
// Standard pattern used across all forms
const formSchema = z.object({
  email: z.string().email("Please enter a valid email address."),
  password: z.string().min(8).max(64)
});

const form = useForm<z.infer<typeof formSchema>>({
  resolver: zodResolver(formSchema),
  defaultValues: { email: "", password: "" }
});
```

**Component Library (`components/ui/`)**
- Based on react-native-reusables (shadcn/ui for React Native)
- Core components: Button, Form, Input, Label, Text, Typography
- All components use NativeWind classes
- Utility: `cn()` function in `lib/utils.ts` for class merging

### Styling System

**NativeWind Configuration**
- Tailwind config at `tailwind.config.js`
- Global styles in `global.css` with CSS variables
- Auto-generated TypeScript colors via `yarn generate-colors`
- Color scheme support with `useColorScheme()` hook
- Metro configured for CSS processing

**CSS Variables Structure**
- Light theme: `:root { --primary: h s% l%; }`
- Dark theme: `.dark:root { --primary: h s% l%; }`
- Generated to `constants/colors.ts` for runtime access

### Configuration Files

**TypeScript (`tsconfig.json`)**
- Strict mode enabled
- Path alias: `@/*` maps to project root
- Includes all `.ts`, `.tsx` files

**ESLint (`eslint.config.js`)**
- Extends `eslint-config-expo` with Prettier
- Auto-fix on `yarn lint`
- Ignores `dist/` directory

**Metro (`metro.config.js`)**
- NativeWind CSS processing configured
- Supabase compatibility resolver settings

## Key Implementation Patterns

### Protected Routes
Uses Expo Router's `Stack.Protected` with session-based guards:
```typescript
<Stack.Protected guard={!!session}>
  <Stack.Screen name="(protected)" />
</Stack.Protected>
```

### Error Handling in Auth Methods
Auth methods in `AuthProvider` log errors but don't throw:
- Errors logged to console
- UI components handle loading states via `form.formState.isSubmitting`

### Platform-Specific Styling
Use NativeWind modifiers: `ios:`, `android:`, `web:`
```tsx
<View className="p-4 web:m-4" />
```

## Development Workflow

1. **Environment Setup**
   - Copy `.env.example` to `.env`
   - Add required environment variables:
     ```bash
     # Supabase (Required)
     EXPO_PUBLIC_SUPABASE_URL=your-supabase-url
     EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
     
     # Backend API (Required for custom auth)
     EXPO_PUBLIC_API_URL=http://localhost:3001
     
     # Coze API (Required for AI chat)
     EXPO_PUBLIC_COZE_API_KEY=your-coze-api-key
     EXPO_PUBLIC_COZE_BOT_ID=your-bot-id
     ```
   - For backend: Copy `backend/.env.example` to `backend/.env` and add Alibaba Cloud credentials
   - Run `yarn install`

2. **Adding New Screens**
   - Place in appropriate directory (`(protected)/` or `(public)/`)
   - File name becomes route path
   - Export default React component

3. **Creating Forms**
   - Define Zod schema for validation
   - Use `useForm` with `zodResolver`
   - Implement with `FormField` and `FormInput` components

4. **Before Committing**
   - Run `yarn lint` to fix formatting
   - Ensure no TypeScript errors
   - Test on target platforms

## Testing Notes

No test framework is currently configured. The project structure suggests potential for:
- Component testing with React Native Testing Library
- E2E testing with Detox or Maestro
- No existing test files or test scripts in package.json