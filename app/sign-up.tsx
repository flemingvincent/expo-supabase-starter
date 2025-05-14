import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { ActivityIndicator, View } from "react-native";
import * as z from "zod";
import Svg, { Text as SvgText } from "react-native-svg";
import { Ionicons } from "@expo/vector-icons";

import { SafeAreaView } from "@/components/safe-area-view";
import { Button } from "@/components/ui/button";
import { Form, FormField, FormInput } from "@/components/ui/form";
import { Text } from "@/components/ui/text";
import { useAuth } from "@/context/supabase-provider";
import { Link, useRouter } from "expo-router";

const formSchema = z
  .object({
    email: z.string().email("Please enter a valid email address."),
    password: z
      .string()
      .min(8, "Please enter at least 8 characters.")
      .max(64, "Please enter fewer than 64 characters.")
      .regex(
        /^(?=.*[a-z])/,
        "Your password must have at least one lowercase letter.",
      )
      .regex(
        /^(?=.*[A-Z])/,
        "Your password must have at least one uppercase letter.",
      )
      .regex(/^(?=.*[0-9])/, "Your password must have at least one number.")
      .regex(
        /^(?=.*[!@#$%^&*])/,
        "Your password must have at least one special character.",
      ),
    confirmPassword: z.string().min(8, "Please enter at least 8 characters."),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Your passwords do not match.",
    path: ["confirmPassword"],
  });

export default function SignUp() {
  const { signUp } = useAuth();
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  async function onSubmit(data: z.infer<typeof formSchema>) {
    try {
      await signUp(data.email, data.password);
      form.reset();
    } catch (error: Error | any) {
      console.error(error.message);
    }
  }

  return (
    <SafeAreaView className="flex-1 bg-accent p-4" edges={["bottom"]}>
      <View className="flex-1 items-center justify-center web:m-4">
        {/* Title using SVG text with same styling as sign-in page */}
        <Svg width="300" height="100" style={{ marginBottom: 20 }}>
          <SvgText
            x="150"
            y="60"
            textAnchor="middle"
            fill="#25551b"
            stroke="#E2F380"
            strokeWidth="0"
            letterSpacing="2"
            fontFamily="MMDisplay"
            fontSize="42"
            fontWeight="bold"
          >
            SIGN UP
          </SvgText>
        </Svg>

        {/* Form container styled same as sign-in page */}
        <View className="w-full bg-background/80 rounded-2xl p-6 shadow-md">
          <Form {...form}>
            <View className="gap-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormInput
                    label="Email"
                    placeholder="your@email.com"
                    autoCapitalize="none"
                    autoComplete="email"
                    autoCorrect={false}
                    keyboardType="email-address"
                    {...field}
                  />
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormInput
                    label="Password"
                    placeholder="••••••••"
                    autoCapitalize="none"
                    autoCorrect={false}
                    secureTextEntry
                    {...field}
                  />
                )}
              />
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormInput
                    label="Confirm Password"
                    placeholder="Confirm password"
                    autoCapitalize="none"
                    autoCorrect={false}
                    secureTextEntry
                    {...field}
                  />
                )}
              />
              
              {/* Password requirements hint */}
              <Text className="text-xs text-primary/70 mt-1">
                Password must contain at least 8 characters, including uppercase, 
                lowercase, number, and special character.
              </Text>
            </View>
          </Form>

          {/* Sign up button with arrow */}
          <Button
            size="default"
            variant="default"
            onPress={form.handleSubmit(onSubmit)}
            disabled={form.formState.isSubmitting}
            className="mt-6"
          >
            {form.formState.isSubmitting ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <View className="flex-row items-center">
                <Text className="text-primary-foreground">Sign Up</Text>
                <Ionicons
                  name="arrow-forward"
                  size={16}
                  color="white"
                  style={{ marginLeft: 8 }}
                />
              </View>
            )}
          </Button>
        </View>

        {/* "Already have an account" section */}
        <View className="flex-row mt-6">
          <Text className="text-primary">Already have an account? </Text>
          <Link
            href="/sign-in"
            asChild
          >
            <Text className="text-primary font-bold">Sign In</Text>
          </Link>
        </View>
      </View>
    </SafeAreaView>
  );
}