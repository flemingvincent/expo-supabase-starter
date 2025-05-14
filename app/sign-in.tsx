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

const formSchema = z.object({
	email: z.string().email("Please enter a valid email address."),
	password: z
		.string()
		.min(8, "Please enter at least 8 characters.")
		.max(64, "Please enter fewer than 64 characters."),
});

export default function SignIn() {
	const { signIn } = useAuth();
	const router = useRouter();

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			email: "",
			password: "",
		},
	});

	async function onSubmit(data: z.infer<typeof formSchema>) {
		try {
			await signIn(data.email, data.password);
			form.reset();
		} catch (error: Error | any) {
			console.error(error.message);
		}
	}

	return (
		<SafeAreaView className="flex-1 bg-accent p-4" edges={["bottom"]}>
			<View className="flex-1 items-center justify-center web:m-4">
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
						SIGN IN
					</SvgText>
				</Svg>

				{/* Form container styled similar to welcome page */}
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
						</View>
					</Form>

					{/* Sign in button styled like welcome page buttons */}
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
								<Text className="text-primary-foreground">Sign In</Text>
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

				{/* "Don't have an account" section */}
				<View className="flex-row mt-6">
					<Text className="text-primary">Don't have an account? </Text>
					<Link
						href="/sign-up"
						asChild
					>
						<Text className="text-primary font-bold">Sign Up</Text>
					</Link>
				</View>
			</View>
		</SafeAreaView>
	);
}
