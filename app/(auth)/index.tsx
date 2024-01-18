import { useRouter } from "expo-router";
import React from "react";
import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Button } from "@/components/ui";
import tw from "@/lib/tailwind";

export default function WelcomeScreen() {
	const router = useRouter();

	return (
		<SafeAreaView
			style={tw`flex flex-1 bg-background dark:bg-dark-background p-4`}
		>
			<View style={tw`flex flex-1 items-center justify-center gap-y-4`}>
				<Text style={tw`h1 text-center`}>Welcome to Expo Supabase Starter</Text>
				<Text style={tw`muted text-center`}>
					A simple template for developing Expo applications with Supabase as
					the backend.
				</Text>
			</View>
			<View style={tw`flex flex-row gap-x-4`}>
				<Button
					style={tw`flex-1`}
					label="Sign up"
					onPress={() => {
						router.push("/sign-up");
					}}
				/>
				<Button
					style={tw`flex-1`}
					variant="secondary"
					label="Sign in"
					onPress={() => {
						router.push("/sign-in");
					}}
				/>
			</View>
		</SafeAreaView>
	);
}
