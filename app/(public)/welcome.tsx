import React, { useState } from "react";
import { View, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";

import { SafeAreaView } from "@/components/safe-area-view";
import { Text } from "@/components/ui/text";
import { H1 } from "@/components/ui/typography";

export default function WelcomeScreen() {
	const router = useRouter();
	const [termsAccepted, setTermsAccepted] = useState(false);

	return (
		<SafeAreaView className="flex-1 bg-white">
			<View className="flex-1">
				{/* Close button */}
				<TouchableOpacity className="p-4 self-start">
					<Text className="text-3xl text-gray-600">×</Text>
				</TouchableOpacity>

				{/* Logo and title */}
				<View className="flex-1 justify-center items-center px-8">
					<View className="w-36 h-36 bg-green-100 rounded-full items-center justify-center mb-8">
						<View className="w-28 h-28 bg-green-200 rounded-full items-center justify-center">
							<Text className="text-5xl">👩‍🎓</Text>
						</View>
					</View>

					<H1 className="text-2xl font-bold mb-2">登录体验AI功能</H1>
				</View>

				{/* Login buttons */}
				<View className="px-6 pb-8">
					{/* TikTok login */}
					<TouchableOpacity
						className="flex-row items-center justify-center bg-black rounded-full py-4 px-6 mb-4"
						onPress={() => {
							console.log("TikTok login");
						}}
					>
						<Text className="text-lg mr-2">🎵</Text>
						<Text className="text-white text-base font-medium">
							抖音一键登录
						</Text>
					</TouchableOpacity>

					{/* Phone login */}
					<TouchableOpacity
						className="flex-row items-center justify-center bg-white border border-gray-300 rounded-full py-4 px-6 mb-4"
						onPress={() => router.push("/phone-login")}
					>
						<Text className="text-lg mr-2">📱</Text>
						<Text className="text-gray-900 text-base font-medium">
							手机号登录
						</Text>
					</TouchableOpacity>

					{/* Account login */}
					<TouchableOpacity
						className="flex-row items-center justify-center bg-white border border-gray-300 rounded-full py-4 px-6 mb-4"
						onPress={() => router.push("/sign-in")}
					>
						<Text className="text-lg mr-2">👤</Text>
						<Text className="text-gray-900 text-base font-medium">
							账号密码登录
						</Text>
					</TouchableOpacity>

					{/* Apple login */}
					<TouchableOpacity
						className="flex-row items-center justify-center bg-white border border-gray-300 rounded-full py-4 px-6 mb-4"
						onPress={() => {
							console.log("Apple login");
						}}
					>
						<Text className="text-lg mr-2">🍎</Text>
						<Text className="text-gray-900 text-base font-medium">
							Apple 登录
						</Text>
					</TouchableOpacity>

					{/* Terms checkbox */}
					<TouchableOpacity
						className="flex-row items-start justify-center mt-4 px-4"
						onPress={() => setTermsAccepted(!termsAccepted)}
					>
						<View
							className={`w-4 h-4 border rounded mr-2 mt-0.5 ${
								termsAccepted
									? "bg-green-500 border-green-500"
									: "border-gray-300"
							}`}
						>
							{termsAccepted && (
								<Text className="text-white text-xs text-center">✓</Text>
							)}
						</View>
						<Text className="text-xs text-gray-500 flex-1">
							已阅读并同意 <Text className="text-blue-500">服务协议</Text>、
							<Text className="text-blue-500">隐私协议</Text> 和
							<Text className="text-blue-500">儿童个人信息保护指引</Text>
						</Text>
					</TouchableOpacity>
				</View>
			</View>
		</SafeAreaView>
	);
}
