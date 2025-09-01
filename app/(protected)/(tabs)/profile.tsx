import React from "react";
import { View, ScrollView, TouchableOpacity } from "react-native";
import { router } from "expo-router";

import { SafeAreaView } from "@/components/safe-area-view";
import { Text } from "@/components/ui/text";
import { useAuth } from "@/context/supabase-provider";

export default function ProfilePage() {
	const { signOut, phoneNumber } = useAuth();

	// Generate a random user ID for display
	const userId = "537579521";

	const menuItems = [
		{
			icon: "🪙",
			title: "金币商城",
			value: "0 金币",
			bgColor: "bg-orange-100",
		},
		{
			icon: "✅",
			title: "任务中心",
			value: "立刻签到领金币",
			bgColor: "bg-green-100",
		},
	];

	const settingsItems = [
		{
			icon: "🔔",
			title: "消息",
			bgColor: "bg-blue-100",
		},
		{
			icon: "📚",
			title: "学习记录",
			bgColor: "bg-green-100",
		},
		{
			icon: "✏️",
			title: "举报与反馈",
			bgColor: "bg-blue-100",
		},
		{
			icon: "⚙️",
			title: "设置",
			bgColor: "bg-gray-100",
		},
	];

	const handleSignOut = async () => {
		await signOut();
		router.replace("/welcome");
	};

	return (
		<SafeAreaView className="flex-1 bg-gray-50">
			<ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
				{/* Header with Dynamic Island */}
				<View className="bg-black px-4 pt-4 pb-8 rounded-b-3xl">
					<View className="flex-row items-center justify-center mb-6">
						<View className="w-20 h-8 bg-gray-600 rounded-full" />
					</View>

					{/* User Avatar and Info */}
					<View className="items-center">
						<View className="w-24 h-24 bg-teal-500 rounded-full items-center justify-center mb-4">
							<Text className="text-4xl">👤</Text>
						</View>

						<View className="flex-row items-center">
							<Text className="text-white text-xl font-semibold mr-2">
								用户{userId}
							</Text>
							<Text className="text-gray-400">›</Text>
						</View>

						<TouchableOpacity className="mt-2">
							<Text className="text-gray-400 text-sm">初一 ▼</Text>
						</TouchableOpacity>
					</View>
				</View>

				{/* Coins and Tasks */}
				<View className="px-4 mt-6">
					<View className="flex-row gap-3">
						{menuItems.map((item, index) => (
							<TouchableOpacity
								key={index}
								className="flex-1 bg-white rounded-2xl p-4 flex-row items-center"
								onPress={() => console.log(`Pressed ${item.title}`)}
							>
								<View
									className={`w-12 h-12 ${item.bgColor} rounded-xl items-center justify-center mr-3`}
								>
									<Text className="text-2xl">{item.icon}</Text>
								</View>
								<View className="flex-1">
									<Text className="text-base font-semibold text-gray-900">
										{item.title}
									</Text>
									<Text className="text-sm text-gray-500 mt-0.5">
										{item.value}
									</Text>
								</View>
								<Text className="text-gray-400 text-xl">›</Text>
							</TouchableOpacity>
						))}
					</View>
				</View>

				{/* Settings Menu */}
				<View className="px-4 mt-6">
					{settingsItems.map((item, index) => (
						<TouchableOpacity
							key={index}
							className="bg-white rounded-2xl p-4 flex-row items-center mb-3"
							onPress={() => {
								if (item.title === "设置") {
									handleSignOut();
								} else {
									console.log(`Pressed ${item.title}`);
								}
							}}
						>
							<View
								className={`w-12 h-12 ${item.bgColor} rounded-xl items-center justify-center mr-3`}
							>
								<Text className="text-2xl">{item.icon}</Text>
							</View>
							<Text className="flex-1 text-base text-gray-900">
								{item.title}
							</Text>
							<Text className="text-gray-400 text-xl">›</Text>
						</TouchableOpacity>
					))}
				</View>

				{/* Version info */}
				<View className="px-4 py-8">
					<Text className="text-center text-xs text-gray-400">版本 1.0.0</Text>
				</View>
			</ScrollView>
		</SafeAreaView>
	);
}
