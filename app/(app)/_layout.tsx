import { Redirect, SplashScreen, Tabs } from "expo-router";
import { useColorScheme } from "nativewind";
import React from "react";

import { useSupabase } from "@/context/supabase-provider";
import { theme } from "@/lib/constants";

SplashScreen.preventAutoHideAsync();

export default function AppLayout() {
	const { colorScheme } = useColorScheme();
	const { session, initialized } = useSupabase();

	if (!initialized) {
		return;
	} else {
		SplashScreen.hideAsync();
	}

	if (!session) {
		return <Redirect href="/welcome" />;
	}

	return (
		<Tabs
			screenOptions={{
				headerShown: false,
				tabBarStyle: {
					backgroundColor:
						colorScheme === "dark"
							? theme.dark.background
							: theme.light.background,
				},
				tabBarShowLabel: false,
			}}
		>
			<Tabs.Screen name="index" />
			<Tabs.Screen name="two" />
		</Tabs>
	);
}
