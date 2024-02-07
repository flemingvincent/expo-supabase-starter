import { useRouter } from "expo-router";
import React from "react";
import { Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Button } from "@/components/ui";

export default function WelcomeScreen() {
	const router = useRouter();
	const insets = useSafeAreaInsets();

	return (
		<View
			className="flex flex-1 bg-background p-4"
			// HACK: This is a workaround for the SafeAreaView className prop not working
			style={{
				paddingTop: insets.top,
				paddingBottom: insets.bottom,
			}}
		>
			<View className="flex flex-1 items-center justify-center gap-y-4">
				<Text className="text-4xl text-foreground font-extrabold tracking-tight lg:text-5xl text-center">
					Welcome to Expo Supabase Starter
				</Text>
				<Text className="text-sm text-muted-foreground text-center">
					A simple template for developing Expo applications with Supabase as
					the backend.
				</Text>
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
					Sign up
				</Button>
				<Button
					className="flex-1"
					size="default"
					variant="secondary"
					onPress={() => {
						router.push("/sign-in");
					}}
				>
					Sign in
				</Button>
			</View>
		</View>
	);
}
