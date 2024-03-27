import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "expo-router";
import { useForm } from "react-hook-form";
import { ActivityIndicator, View } from "react-native";
import * as z from "zod";

import { SafeAreaView } from "@/components/safe-area-view";
import { Button } from "@/components/ui/button";
import { Form, FormField, FormInput } from "@/components/ui/form";
import { Text } from "@/components/ui/text";
import { H1, Muted } from "@/components/ui/typography";
import { useSupabase } from "@/context/supabase-provider";

const formSchema = z.object({
	email: z.string().email("Please enter a valid email address."),
	password: z
		.string()
		.min(8, "Please enter at least 8 characters.")
		.max(64, "Please enter fewer than 64 characters."),
});

export default function SignIn() {
	const { signInWithPassword } = useSupabase();
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
			await signInWithPassword(data.email, data.password);

			form.reset();
		} catch (error: Error | any) {
			console.log(error.message);
		}
	}

	return (
		<SafeAreaView className="flex-1 bg-background p-4">
			<View className="flex-1">
				<H1 className="self-start">Sign In</H1>
				<Muted className="self-start mb-5">
					to continue to Expo Supabase Starter
				</Muted>
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
						<Text>Sign In</Text>
					)}
				</Button>
				<Muted
					className="text-center"
					onPress={() => {
						router.replace("/sign-up");
					}}
				>
					Don't have an account?{" "}
					<Muted className="text-foreground">Sign up</Muted>
				</Muted>
			</View>
		</SafeAreaView>
	);
}
