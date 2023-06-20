import React from "react";
import { View, Text } from "react-native";

import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";
import { useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

import tw from "@/lib/tailwind";
import { useSupabase } from "@/context/useSupabase";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Alert } from "@/components/ui/Alert";

const FormSchema = z.object({
	token: z.string(),
});

export default function Verify() {
	const { verifyOtp } = useSupabase();
	const { email } = useLocalSearchParams();
	const alertRef = React.useRef<any>(null);

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
			await verifyOtp(email as string, data.token, "signup");
		} catch (error) {
			console.error(error);
		}
	}

	React.useEffect(() => {
		alertRef.current?.showAlert({
			variant: "default",
			title: "Verification Required",
			message: "Check your email for a 6-digit OTP.",
		});
	}, []);

	return (
		<SafeAreaView
			style={tw`flex-1 items-center bg-background dark:bg-dark-background p-4`}
		>
			<Alert ref={alertRef} />
			<Text
				style={tw`h1 text-foreground dark:text-dark-foreground self-start mb-5`}
			>
				Verification
			</Text>
			<View style={tw`w-full gap-y-4`}>
				<Controller
					control={control}
					name="token"
					render={({ field: { onChange, onBlur, value } }) => (
						<Input
							label="6 digit code"
							value={value}
							onChangeText={onChange}
							onBlur={() => {
								trigger("token");
								onBlur();
							}}
							errors={errors.token?.message}
							autoCapitalize="none"
							autoCorrect={false}
							keyboardType="number-pad"
							returnKeyType="done"
						/>
					)}
				/>
			</View>
			<View style={tw`w-full gap-y-4 absolute bottom-[50px]`}>
				<Button
					label="Verify"
					onPress={handleSubmit(onSubmit)}
					isLoading={isSubmitting}
				/>
			</View>
		</SafeAreaView>
	);
}
