import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "expo-router";
import { useForm, Controller } from "react-hook-form";
import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as z from "zod";

import { Button, FormLabel, FormMessage, Input } from "@/components/ui";
import { useSupabase } from "@/hooks/useSupabase";
import tw from "@/lib/tailwind";

const FormSchema = z.object({
	email: z.string().email("Please enter a valid email address."),
	password: z
		.string()
		.min(8, "Please enter at least 8 characters.")
		.max(64, "Please enter fewer than 64 characters."),
});

export default function SignIn() {
	const { signInWithPassword } = useSupabase();
	const router = useRouter();

	const {
		control,
		handleSubmit,
		trigger,
		formState: { errors, isSubmitting },
	} = useForm<z.infer<typeof FormSchema>>({
		resolver: zodResolver(FormSchema),
	});

	async function onSubmit(data: z.infer<typeof FormSchema>) {
		try {
			await signInWithPassword(data.email, data.password);
		} catch (error: Error | any) {
			console.log(error.message);
		}
	}

	return (
		<SafeAreaView style={tw`flex-1 bg-background dark:bg-dark-background p-4`}>
			<View style={tw`flex-1`}>
				<Text style={tw`h1 self-start`}>Sign in</Text>
				<Text style={tw`muted self-start mb-5`}>
					to continue to Expo Supabase Starter
				</Text>
				<View style={tw`gap-y-4`}>
					<Controller
						control={control}
						name="email"
						render={({ field: { onChange, value } }) => (
							<View style={tw`gap-1.5`}>
								<FormLabel errors={errors.email}>Email</FormLabel>
								<Input
									placeholder="Email"
									value={value}
									onChangeText={onChange}
									onBlur={() => {
										trigger("email");
									}}
									error={errors.email}
									autoCapitalize="none"
									autoComplete="email"
									autoCorrect={false}
									keyboardType="email-address"
								/>
								{errors.email && (
									<FormMessage>{errors.email?.message}</FormMessage>
								)}
							</View>
						)}
					/>
					<Controller
						control={control}
						name="password"
						render={({ field: { onChange, value } }) => (
							<View style={tw`gap-1.5`}>
								<FormLabel errors={errors.password}>Password</FormLabel>
								<Input
									placeholder="Password"
									value={value}
									onChangeText={onChange}
									onBlur={() => {
										trigger("password");
									}}
									error={errors.password}
									autoCapitalize="none"
									autoCorrect={false}
									secureTextEntry
								/>
								{errors.password && (
									<FormMessage>{errors.password?.message}</FormMessage>
								)}
							</View>
						)}
					/>
				</View>
			</View>
			<View style={tw`gap-y-4`}>
				<Button
					label="Sign in"
					onPress={handleSubmit(onSubmit)}
					isLoading={isSubmitting}
				/>
				<Text
					style={tw`muted text-center`}
					onPress={() => {
						router.replace("/sign-up");
					}}
				>
					Don't have an account? <Text style={tw`p`}>Sign up</Text>
				</Text>
			</View>
		</SafeAreaView>
	);
}
