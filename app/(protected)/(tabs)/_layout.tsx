import React from "react";
import { Tabs } from "expo-router";
import { View } from "react-native";
import { Text } from "@/components/ui/text";

export default function TabsLayout() {
	return (
		<Tabs
			screenOptions={{
				headerShown: false,
				tabBarStyle: {
					backgroundColor: "white",
					borderTopWidth: 1,
					borderTopColor: "#e5e5e5",
					paddingTop: 5,
					paddingBottom: 5,
					height: 60,
				},
				tabBarActiveTintColor: "#000000",
				tabBarInactiveTintColor: "#9ca3af",
				tabBarShowLabel: true,
				tabBarLabelStyle: {
					fontSize: 11,
					marginTop: 2,
				},
			}}
		>
			<Tabs.Screen
				name="index"
				options={{
					title: "学习",
					tabBarIcon: ({ focused }) => (
						<View className="items-center">
							<Text className={`text-2xl ${focused ? "" : "opacity-50"}`}>
								📚
							</Text>
						</View>
					),
				}}
			/>
			<Tabs.Screen
				name="chat"
				options={{
					title: "问答",
					tabBarIcon: ({ focused }) => (
						<View className="items-center">
							<Text className={`text-2xl ${focused ? "" : "opacity-50"}`}>
								💬
							</Text>
						</View>
					),
				}}
			/>
			<Tabs.Screen
				name="profile"
				options={{
					title: "我的",
					tabBarIcon: ({ focused }) => (
						<View className="items-center">
							<Text className={`text-2xl ${focused ? "" : "opacity-50"}`}>
								👤
							</Text>
						</View>
					),
				}}
			/>
			<Tabs.Screen
				name="settings"
				options={{
					href: null, // Hide settings tab since we renamed it to profile
				}}
			/>
		</Tabs>
	);
}
