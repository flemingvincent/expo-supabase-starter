import React, { useState, useEffect } from "react";
import { View, TouchableOpacity, Alert } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";

import { SafeAreaView } from "@/components/safe-area-view";
import { Text } from "@/components/ui/text";
import { H1, Muted } from "@/components/ui/typography";
import { OTPInput } from "@/components/ui/otp-input";
import { NumericKeypad } from "@/components/ui/numeric-keypad";
import { useAuth } from "@/context/supabase-provider";

export default function VerifyOTPScreen() {
	const router = useRouter();
	const params = useLocalSearchParams();
	const phone = params.phone as string;
	const { verifyOTP, signInWithPhone } = useAuth();

	const [otp, setOTP] = useState("");
	const [isVerifying, setIsVerifying] = useState(false);
	const [countdown, setCountdown] = useState(59);
	const [canResend, setCanResend] = useState(false);

	useEffect(() => {
		const timer = setInterval(() => {
			setCountdown((prev) => {
				if (prev <= 1) {
					setCanResend(true);
					return 0;
				}
				return prev - 1;
			});
		}, 1000);

		return () => clearInterval(timer);
	}, []);

	useEffect(() => {
		if (otp.length === 4) {
			handleVerifyOTP();
		}
	}, [otp]);

	const handleKeyPress = (key: string) => {
		if (otp.length < 4) {
			setOTP(otp + key);
		}
	};

	const handleDelete = () => {
		setOTP(otp.slice(0, -1));
	};

	const handleVerifyOTP = async () => {
		if (otp.length !== 4) return;

		setIsVerifying(true);
		try {
			const result = await verifyOTP(phone, otp);

			if (result.success) {
				router.replace("/(protected)/(tabs)");
			} else {
				Alert.alert("验证失败", result.error || "验证码错误，请重新输入");
				setOTP("");
			}
		} catch (error) {
			Alert.alert("错误", "验证失败，请稍后重试");
			setOTP("");
		} finally {
			setIsVerifying(false);
		}
	};

	const handleResendOTP = async () => {
		if (!canResend) return;

		setCanResend(false);
		setCountdown(59);

		try {
			const result = await signInWithPhone(phone);
			if (result.success) {
				Alert.alert("提示", "验证码已重新发送");
			} else {
				Alert.alert("错误", result.error || "发送失败，请稍后重试");
			}
		} catch (error) {
			Alert.alert("错误", "发送失败，请稍后重试");
		}
	};

	const displayPhone = phone?.replace("+86", "");
	const formattedPhone = displayPhone
		? `${displayPhone.slice(0, 3)} ${displayPhone.slice(3, 7)} ${displayPhone.slice(7)}`
		: "";

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
					<H1 className="text-2xl font-bold mb-2">输入 4 位验证码</H1>
					<Muted>验证码已发送至 {formattedPhone}</Muted>
				</View>

				{/* OTP input */}
				<View className="px-6 py-8">
					<OTPInput value={otp} onChange={setOTP} length={4} autoFocus />
				</View>

				{/* Resend button */}
				<View className="px-6">
					<TouchableOpacity onPress={handleResendOTP} disabled={!canResend}>
						<Text className="text-center text-gray-500">
							{canResend ? "重新发送" : `重新发送${countdown}s`}
						</Text>
					</TouchableOpacity>
				</View>

				{/* Loading indicator */}
				{isVerifying && (
					<View className="px-6 py-4">
						<Text className="text-center text-green-500">验证中...</Text>
					</View>
				)}

				{/* Spacer */}
				<View className="flex-1" />

				{/* Numeric keypad */}
				<NumericKeypad onKeyPress={handleKeyPress} onDelete={handleDelete} />
			</View>
		</SafeAreaView>
	);
}
