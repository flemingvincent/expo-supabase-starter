# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is an Expo/React Native starter template with Supabase authentication, built using:

- **Expo Router** (v5) for file-based navigation with protected routes
- **Supabase** for authentication and backend services
- **NativeWind** for Tailwind CSS styling in React Native
- **TypeScript** for type safety
- **React Hook Form + Zod** for form handling and validation

## Development Commands

```bash
# Start development server
yarn start
# or for clean start
npx expo start --clear --reset-cache

# Platform-specific development
yarn ios          # Run on iOS simulator
yarn android      # Run on Android emulator  
yarn web          # Run in web browser

# Code quality
yarn lint         # Run ESLint with auto-fix
yarn generate-colors  # Generate colors and fix linting
```

## Architecture Overview

### Authentication Flow
- **AuthProvider** (`context/supabase-provider.tsx`) manages global auth state
- **Protected routes** are implemented using Expo Router's Stack.Protected
- Session persistence handled via AsyncStorage
- Auth state automatically refreshes when app becomes active

### Routing Structure
```
app/
├── _layout.tsx              # Root layout with AuthProvider
├── (protected)/             # Routes requiring authentication
│   ├── _layout.tsx          # Protected routes layout (tabs)
│   ├── (tabs)/
│   │   ├── index.tsx        # Main dashboard
│   │   └── settings.tsx     # Settings screen
│   └── modal.tsx            # Modal screens
└── (public)/                # Public routes (no auth required)
    ├── welcome.tsx          # Landing page
    ├── sign-in.tsx          # Login form
    └── sign-up.tsx          # Registration form
```

### Component Architecture
- **UI components** (`components/ui/`) follow shadcn/ui patterns using react-native-reusables
- **Reusable components** (`components/`) for app-specific functionality
- **Form components** use React Hook Form with Zod validation schemas
- **Styling** uses NativeWind (Tailwind CSS for React Native)

### Configuration
- **Supabase config** (`config/supabase.ts`) with AsyncStorage persistence
- **Environment variables** required: `EXPO_PUBLIC_SUPABASE_URL`, `EXPO_PUBLIC_SUPABASE_ANON_KEY`
- **Metro config** for NativeWind CSS processing
- **ESLint** configured with Expo and Prettier rules

## Key Patterns

### Authentication Guard
Routes are protected using Expo Router's Stack.Protected with session-based guards:
```typescript
<Stack.Protected guard={!!session}>
  <Stack.Screen name="(protected)" />
</Stack.Protected>
```

### Form Handling
All forms use React Hook Form + Zod pattern:
```typescript
const form = useForm<z.infer<typeof formSchema>>({
  resolver: zodResolver(formSchema),
  defaultValues: { ... }
});
```

### Styling Convention
- Use NativeWind classes for styling
- Follow shadcn/ui component patterns
- Maintain consistent spacing and color schemes via `constants/colors.ts`

### State Management
- **Global auth state**: Context API via AuthProvider
- **Form state**: React Hook Form
- **Local state**: React useState/useEffect

## Development Notes

- The app uses file-based routing - create new screens by adding files to the `app/` directory
- Protected routes automatically redirect to sign-in when session expires
- All UI components are designed to work across iOS, Android, and web platforms
- Color scheme generation is automated via `scripts/generate-colors.js`

## Testing Supabase Integration

Ensure you have:
1. Created a Supabase project
2. Added your URL and anon key to `.env` file
3. Configured auth settings (email verification can be disabled for development)