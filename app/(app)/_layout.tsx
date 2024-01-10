import { Tabs } from "expo-router";
import React from "react";

export default function AppLayout() {
	return (
		<Tabs
			screenOptions={{
				headerShown: false,
				tabBarShowLabel: false,
				tabBarActiveTintColor: "#000",
			}}
		>
			<Tabs.Screen name="index" />
			<Tabs.Screen name="two" />
		</Tabs>
	);
}
