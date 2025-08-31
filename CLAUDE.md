# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Expo/React Native starter template with Supabase authentication and modern tooling:

- **Expo SDK 53** + **Expo Router v5** for file-based navigation
- **Supabase** authentication with AsyncStorage persistence
- **NativeWind v4** (Tailwind CSS for React Native)
- **React Hook Form** + **Zod** for form validation
- **TypeScript** with strict mode enabled
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
- Methods: `signUp()`, `signIn()`, `signOut()`
- Auto-refresh on app foreground via `AppState` listener
- Session persistence with AsyncStorage

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
   - Add Supabase URL and anon key
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