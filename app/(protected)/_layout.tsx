import { Tabs } from "expo-router";
import { useColorScheme } from "nativewind";
import React from "react";

import { theme } from "@/lib/constants";

export default function ProtectedLayout() {
	const { colorScheme } = useColorScheme();

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
			<Tabs.Screen name="home" />
			<Tabs.Screen name="settings" />
		</Tabs>
	);
}
