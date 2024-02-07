import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "expo-router";
import { useForm } from "react-hook-form";
import { ActivityIndicator, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as z from "zod";

import { Button, Form, FormField, FormInput } from "@/components/ui";
import { useSupabase } from "@/hooks/useSupabase";

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
	const { signUp } = useSupabase();
	const router = useRouter();
	const insets = useSafeAreaInsets();

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
			console.log(error.message);
		}
	}

	return (
		<View
			className="flex-1 bg-background p-4"
			// HACK: This is a workaround for the SafeAreaView className prop not working
			style={{
				paddingTop: insets.top,
				paddingBottom: insets.bottom,
			}}
		>
			<View className="flex-1">
				<Text className="text-4xl text-foreground font-extrabold tracking-tight lg:text-5xl self-start">
					Sign Up
				</Text>
				<Text className="text-sm text-muted-foreground self-start mb-5">
					to continue to Expo Supabase Starter
				</Text>
				<Form {...form}>
					<View className="gap-4">
						<FormField
							control={form.control}
							name="email"
							render={({ field }) => (
								<FormInput
									label="Email"
									placeholder="Email"
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
									placeholder="Password"
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
					</View>
				</Form>
			</View>
			<View className="gap-y-4">
				<Button
					size="default"
					variant="default"
					onPress={form.handleSubmit(onSubmit)}
				>
					{form.formState.isSubmitting ? (
						<ActivityIndicator size="small" />
					) : (
						"Sign up"
					)}
				</Button>
				<Text
					className="text-sm text-muted-foreground text-center"
					onPress={() => {
						router.replace("/sign-in");
					}}
				>
					Already have an account?{" "}
					<Text className="leading-7 text-foreground">Sign in</Text>
				</Text>
			</View>
		</View>
	);
}
