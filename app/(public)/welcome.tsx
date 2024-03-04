import { useRouter } from "expo-router";
import React from "react";
import { View } from "react-native";

import { SafeAreaView } from "@/components/safe-area-view";
import { Button, H1, Muted, P } from "@/components/ui";

export default function WelcomeScreen() {
	const router = useRouter();

	return (
		<SafeAreaView className="flex flex-1 bg-background p-4">
			<View className="flex flex-1 items-center justify-center gap-y-4">
				<H1 className="text-center">Welcome to Expo Supabase Starter</H1>
				<Muted className="text-center">
					A comprehensive starter project for developing Expo applications with
					Supabase as the backend.
				</Muted>
			</View>
			<View className="flex flex-row gap-x-4">
				<Button
					className="flex-1"
					size="default"
					variant="default"
					onPress={() => {
						router.push("/sign-up");
					}}
				>
					<P>Sign up</P>
				</Button>
				<Button
					className="flex-1"
					size="default"
					variant="secondary"
					onPress={() => {
						router.push("/sign-in");
					}}
				>
					<P>Sign in</P>
				</Button>
			</View>
		</SafeAreaView>
	);
}
