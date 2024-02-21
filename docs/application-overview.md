# 💻 Application Overview

The application is pretty simple. Users can sign up, sign in, and sign out.

## Get Started

To set up this starter template, please follow these steps:

1. Configure Supabase:

- If you haven't already, create an new account on [Supabase](https://supabase.com/).
- Create a new project and obtain your Supabase URL and API key.
- Update the `EXPO_PUBLIC_API_URL` and `EXPO_PUBLIC_API_KEY` variables in the `.env` file with your Supabase URL and API key respectively.

Note: By default Supabase Auth requires email verification before a session is created for the users. To support email verification you need to implement deep link handling! Alternatively, you can disable email confirmation in your project's email auth provider settings.

2. Clone the repository to your local machine:

```bash
git clone https://github.com/FlemingVincent/expo-supabase-starter.git
```

3. Navigate to the project directory:

```bash
cd expo-supabase-starter
```

4. Install the required dependencies:

```bash
yarn install
```

5. Start the Expo development server:

```bash
yarn start
```
