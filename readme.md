# Expo Supabase Starter

## Introduction

This repository serves as a comprehensive starter project for developing React Native and Expo applications with Supabase as the backend.

#### Disclaimer

This is not supposed to be a template, boilerplate or a framework. It is an opinionated guide that shows how to do some things in a certain way. You are not forced to do everything exactly as it is shown here, decide what works best for you and your team and stay consistent with your style.

## Get Started

1. Configure Supabase
   - If you haven't already, create an new account on [Supabase](https://supabase.com/).
   - Create a new project and obtain your Supabase URL and API key.

   Note: By default Supabase Auth requires email verification before a session is created for the users. To send users a one-time code, [modify the confirm signup template](https://supabase.com/dashboard/project/_/auth/templates) like so:

   ```html
   <h2>Confirm your signup</h2>

   <p>{{ .Token }}</p>
   ```

2. Clone the repository to your local machine

```bash
git clone https://github.com/FlemingVincent/expo-supabase-starter.git
```

3. Navigate to the project directory

```bash
cd expo-supabase-starter
```

4. Install dependencies

```bash
bun install
```

5. Update environment variables
   - Update the `EXPO_PUBLIC_SUPABASE_URL` and `EXPO_PUBLIC_SUPABASE_KEY` variables in the `.env` file with your Supabase URL and key respectively.

6. Start the Expo development server

```bash
npx expo start --clear --reset-cache
```

## Contributing

Contributions to this starter project are highly encouraged and welcome! If you have any suggestions, bug reports, or feature requests, please feel free to create an issue or submit a pull request. Let's work together to enhance the developer experience and make it easier for everyone to build exceptional Expo applications with Supabase.

## License

This repository is licensed under the MIT License. You are granted the freedom to use, modify, and distribute the code for personal or commercial purposes. For more details, please refer to the [LICENSE](https://github.com/FlemingVincent/supabase-starter/blob/main/LICENSE) file.
