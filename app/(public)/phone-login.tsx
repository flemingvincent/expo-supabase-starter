import React, { useState } from "react";
import { View, TouchableOpacity, Alert } from "react-native";
import { useRouter } from "expo-router";

import { SafeAreaView } from "@/components/safe-area-view";
import { Text } from "@/components/ui/text";
import { H1, Muted } from "@/components/ui/typography";
import { NumericKeypad } from "@/components/ui/numeric-keypad";
import { useAuth } from "@/context/supabase-provider";

export default function PhoneLoginScreen() {
	const router = useRouter();
	const { signInWithPhone } = useAuth();
	const [phoneNumber, setPhoneNumber] = useState("");
	const [isLoading, setIsLoading] = useState(false);

	const handleKeyPress = (key: string) => {
		if (phoneNumber.length < 11) {
			setPhoneNumber(phoneNumber + key);
		}
	};

	const handleDelete = () => {
		setPhoneNumber(phoneNumber.slice(0, -1));
	};

	const handleSendOTP = async () => {
		if (phoneNumber.length !== 11) {
			Alert.alert("提示", "请输入正确的11位手机号");
			return;
		}

		setIsLoading(true);
		try {
			const formattedPhone = `+86${phoneNumber}`;
			const result = await signInWithPhone(formattedPhone);

			if (result.success) {
				router.push({
					pathname: "/verify-otp",
					params: { phone: formattedPhone },
				});
			} else {
				Alert.alert("错误", result.error || "发送验证码失败，请稍后重试");
			}
		} catch (error) {
			Alert.alert("错误", "发送验证码失败，请稍后重试");
		} finally {
			setIsLoading(false);
		}
	};

	const formatPhoneNumber = (phone: string) => {
		if (phone.length <= 3) return phone;
		if (phone.length <= 7) return `${phone.slice(0, 3)} ${phone.slice(3)}`;
		return `${phone.slice(0, 3)} ${phone.slice(3, 7)} ${phone.slice(7)}`;
	};

	return (
		<SafeAreaView className="flex-1 bg-white">
			<View className="flex-1">
				{/* Header */}
				<View className="flex-row items-center p-4">
					<TouchableOpacity onPress={() => router.back()}>
						<Text className="text-2xl">‹</Text>
					</TouchableOpacity>
				</View>

				{/* Title */}
				<View className="px-6 py-4">
					<H1 className="text-2xl font-bold mb-2">手机号登录</H1>
					<Muted>未注册手机验证后自动登录</Muted>
				</View>

				{/* Phone input display */}
				<View className="px-6 py-8">
					<View className="border-b-2 border-green-500 pb-2">
						<Text className="text-green-500 text-sm mb-1">输入手机号</Text>
						<Text className="text-2xl font-semibold h-8">
							{formatPhoneNumber(phoneNumber)}
						</Text>
					</View>
				</View>

				{/* Send OTP button */}
				<View className="px-6 mb-4">
					<TouchableOpacity
						className={`rounded-full py-4 items-center ${
							phoneNumber.length === 11 ? "bg-green-500" : "bg-gray-200"
						}`}
						onPress={handleSendOTP}
						disabled={phoneNumber.length !== 11 || isLoading}
					>
						<Text
							className={`text-base font-medium ${
								phoneNumber.length === 11 ? "text-white" : "text-gray-400"
							}`}
						>
							{isLoading ? "发送中..." : "获取验证码"}
						</Text>
					</TouchableOpacity>
				</View>

				{/* Spacer */}
				<View className="flex-1" />

				{/* Numeric keypad */}
				<NumericKeypad onKeyPress={handleKeyPress} onDelete={handleDelete} />
			</View>
		</SafeAreaView>
	);
}
