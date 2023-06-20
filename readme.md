# Expo Supabase Starter

This repository serves as a comprehensive template for developing Expo applications with Supabase as the backend. It integrates various technologies such as Expo Router for navigation, Tailwind for styling, React-Hook-Form for form handling, Zod for schema validation, and TypeScript for type safety. By leveraging these powerful tools, this starter template provides a robust foundation for building modern, scalable, and efficient mobile applications.

### Table of Contents

- [Features](#features)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Contributing](#contributing)
- [License](#license)

### Features

- ### Authentication

  - [Supabase](https://supabase.io/docs/reference/javascript/auth-signup) is an open-source and secure authentication service that eliminates the need for you to worry about complex authentication mechanisms. It supports multiple login providers, including email/password, Google, Facebook, GitHub, GitLab, and Twitter. Additionally, it offers passwordless authentication using magic links and QR codes.

- #### Navigation

  - [Expo Router](https://expo.github.io/router/docs/) brings the best routing concepts from the web to native iOS and Android apps. By automatically turning every file in the app directory into a route in your mobile navigation, Expo Router simplifies the process of building, maintaining, and scaling your project.

- ### Styling

  - [Tailwind](https://tailwindcss.com/) is a highly efficient utility-first CSS framework that allows you to rapidly build custom designs directly within your HTML. It provides an extensive set of CSS helper classes that can be used to style any element in your application effortlessly.

  - [tailwind-react-native-classnames](https://github.com/jaredh159/tailwind-react-native-classnames) offers a simple and expressive API for integrating tailwindcss with react-native. With this library, you can utilize the same beloved Tailwind CSS utility classes you are familiar with from web development, seamlessly in your React Native applications.

  - [shadcn/ui](https://ui.shadcn.com/) is a curated collection of beautifully designed components that can be effortlessly incorporated into your apps. This starter template draws heavy inspiration from this component library in terms of styling and component design philosophy.

  ### Form Handling

  - [React-Hook-Form](https://react-hook-form.com/) is a lightweight library for building performant and flexible forms with minimal effort. It provides a simple API for managing form state and validation that is easy to understand and integrate into your application.

  ### Schema Validation

  - [Zod](https://zod.dev/) is a TypeScript-first schema declaration library that allows you to define the shape of your data and validate it with ease. It provides a simple and intuitive API for defining schemas and validating data against them.

### Getting Started

To ustilize this starter template, please follow these steps:

1. Clone the repository to your local machine:

```bash
git clone https://github.com/FlemingVincent/supabase-starter.git
```

2. Navigate to the project directory:

```bash
cd supabase-starter
```

3. Install the required dependencies:

```bash
yarn install
```

4. Configure Supabase:

- If you haven't already, create an new account on [Supabase](https://supabase.io/).
- Create a new project and obtain your Supabase URL and API key.
- Enable Email Provider and Confirm Email in the Authentication > Configuration > Providers section..
- Customize the confirm sign up email template in Authentication > Configuration > Email Templates to include a 6-digit OTP:
  - Subject heading: Confirm Your Sign Up
  - Message Body: `<p>Your 6 digit code is {{ .Token}}</p>`
- Update the `supabaseUrl` and `supabaseKey` variables in the `./context/supabase.ts` file with your Supabase URL and API key respectively.

5. Start the Expo development server:

```bash
yarn start
```

### Project Structure

- **./app**: This directory serves as the router in your mobile navigation. It contains all the screens and layouts for your application.
- **./components** This directory encompasses all the reusable components in your application, including primatives located in the `./components/ui` directory.
- **./context** This directory contains the Supabase provider and hooks used within the application.
- **./lib** This directory includes the `tailwind.js` file, which is responsible for creating a custom configured version of the tw function object.

Feel free to modify the project structure according to your specific requirements.

### Contributing

Contributions to this starter template are highly encouraged and welcome! If you have any suggestions, bug reports, or feature requests, please feel free to create an issue or submit a pull request. Let's work together to enhance the developer experience and make it easier for everyone to build exceptional Expo applications with Supabase.

### License

This repository is licensed under the MIT License. You are granted the freedom to use, modify, and distribute the code for personal or commercial purposes. For more details, please refer to the [LICENSE](https://github.com/FlemingVincent/supabase-starter/blob/main/LICENSE) file.
