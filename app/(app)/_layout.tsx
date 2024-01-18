import { Tabs } from "expo-router";
import React from "react";
import { useAppColorScheme } from "twrnc";

import tw from "@/lib/tailwind";

export default function AppLayout() {
	const [colorScheme] = useAppColorScheme(tw);

	return (
		<Tabs
			screenOptions={{
				headerShown: false,
				tabBarStyle: {
					backgroundColor:
						colorScheme === "dark"
							? tw.color("dark-background")
							: tw.color("background"),
				},
				tabBarShowLabel: false,
			}}
		>
			<Tabs.Screen name="index" />
			<Tabs.Screen name="two" />
		</Tabs>
	);
}
