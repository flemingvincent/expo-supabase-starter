import { Redirect, Stack } from "expo-router";
import { useEffect } from "react";
import { router } from "expo-router";
import { useAuth } from "@/context/supabase-provider";

export const unstable_settings = {
	initialRouteName: "(tabs)",
};

export default function ProtectedLayout() {
	const { initialized, session, profile, profileLoading } = useAuth();

	useEffect(() => {
		if (initialized && session && !profileLoading && profile) {
			// Check if onboarding is needed

			console.log("Profile:", profile);

			
			if (!profile.onboarding_completed) {
				// Small delay to ensure the stack is ready
				setTimeout(() => {
					router.push("/onboarding");
				}, 100);
			}
		}
	}, [initialized, session, profile, profileLoading]);

	if (!initialized) {
		return null;
	}

	if (!session) {
		return <Redirect href="/welcome" />;
	}

	return (
		<Stack
			screenOptions={{
				headerShown: false,
			}}
		>
			<Stack.Screen name="(tabs)" />
			<Stack.Screen
				name="onboarding"
				options={{
					presentation: "fullScreenModal",
					headerShown: false,
					gestureEnabled: false,
				}}
			/>
		</Stack>
	);
}
