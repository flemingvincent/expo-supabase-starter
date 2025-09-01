import React, { useState } from "react";
import { 
	View, 
	TouchableOpacity, 
	TextInput, 
	ActivityIndicator,
	Alert,
	KeyboardAvoidingView,
	Platform,
	ScrollView
} from "react-native";
import { useRouter } from "expo-router";

import { SafeAreaView } from "@/components/safe-area-view";
import { Text } from "@/components/ui/text";
import { H1, Muted } from "@/components/ui/typography";
import { useAuth } from "@/context/supabase-provider";

export default function SignIn() {
	const router = useRouter();
	const { signIn } = useAuth();
	
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const [showPassword, setShowPassword] = useState(false);
	const [rememberMe, setRememberMe] = useState(false);

	const handleSignIn = async () => {
		if (!email || !password) {
			Alert.alert("提示", "请输入邮箱和密码");
			return;
		}

		setIsLoading(true);
		try {
			await signIn(email, password);
			// Navigation will be handled by auth state change
		} catch (error) {
			Alert.alert("登录失败", "邮箱或密码错误");
		} finally {
			setIsLoading(false);
		}
	};


	return (
		<SafeAreaView className="flex-1 bg-white">
			<KeyboardAvoidingView 
				className="flex-1"
				behavior={Platform.OS === "ios" ? "padding" : "height"}
			>
				<ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
					{/* Header */}
					<View className="flex-row items-center p-4">
						<TouchableOpacity onPress={() => router.back()}>
							<Text className="text-2xl">‹</Text>
						</TouchableOpacity>
					</View>

					{/* Title */}
					<View className="px-6 py-4">
						<H1 className="text-2xl font-bold mb-2">邮箱密码登录</H1>
						<Muted>使用邮箱和密码登录</Muted>
					</View>

					{/* Form */}
					<View className="px-6 py-4">
						{/* Email input */}
						<View className="mb-4">
							<Text className="text-sm text-gray-600 mb-2">邮箱</Text>
							<TextInput
								className="border border-gray-300 rounded-lg px-4 py-3 text-base"
								placeholder="请输入邮箱地址"
								value={email}
								onChangeText={setEmail}
								autoCapitalize="none"
								autoCorrect={false}
								keyboardType="email-address"
							/>
						</View>

						{/* Password input */}
						<View className="mb-4">
							<Text className="text-sm text-gray-600 mb-2">密码</Text>
							<View className="flex-row items-center border border-gray-300 rounded-lg px-4">
								<TextInput
									className="flex-1 py-3 text-base"
									placeholder="请输入密码"
									value={password}
									onChangeText={setPassword}
									secureTextEntry={!showPassword}
									autoCapitalize="none"
									autoCorrect={false}
								/>
								<TouchableOpacity 
									onPress={() => setShowPassword(!showPassword)}
									className="p-2"
								>
									<Text className="text-gray-500">
										{showPassword ? "👁️" : "👁️‍🗨️"}
									</Text>
								</TouchableOpacity>
							</View>
						</View>

						{/* Options */}
						<View className="flex-row items-center justify-between mb-6">
							<TouchableOpacity 
								className="flex-row items-center"
								onPress={() => setRememberMe(!rememberMe)}
							>
								<View className={`w-5 h-5 border rounded mr-2 items-center justify-center ${
									rememberMe ? 'bg-green-500 border-green-500' : 'border-gray-300'
								}`}>
									{rememberMe && <Text className="text-white text-xs">✓</Text>}
								</View>
								<Text className="text-gray-600">记住密码</Text>
							</TouchableOpacity>
							
							<TouchableOpacity onPress={() => router.push("/forgot-password")}>
								<Text className="text-blue-500">忘记密码？</Text>
							</TouchableOpacity>
						</View>

						{/* Sign in button */}
						<TouchableOpacity
							className={`rounded-full py-4 items-center mb-4 ${
								isLoading ? "bg-gray-300" : "bg-green-500"
							}`}
							onPress={handleSignIn}
							disabled={isLoading}
						>
							{isLoading ? (
								<ActivityIndicator color="white" />
							) : (
								<Text className="text-white text-base font-medium">登录</Text>
							)}
						</TouchableOpacity>

						{/* Register link */}
						<View className="flex-row items-center justify-center mb-6">
							<Text className="text-gray-600">还没有账号？</Text>
							<TouchableOpacity onPress={() => router.push("/sign-up")}>
								<Text className="text-blue-500 ml-1">立即注册</Text>
							</TouchableOpacity>
						</View>

					</View>

					{/* Other login methods */}
					<View className="px-6 py-4">
						<View className="flex-row items-center mb-4">
							<View className="flex-1 h-px bg-gray-300" />
							<Text className="px-3 text-gray-500 text-sm">其他登录方式</Text>
							<View className="flex-1 h-px bg-gray-300" />
						</View>
						
						<View className="flex-row justify-center gap-6">
							<TouchableOpacity 
								className="items-center"
								onPress={() => router.replace("/phone-login")}
							>
								<View className="w-12 h-12 bg-gray-100 rounded-full items-center justify-center mb-1">
									<Text className="text-2xl">📱</Text>
								</View>
								<Text className="text-xs text-gray-600">手机号</Text>
							</TouchableOpacity>
							
							<TouchableOpacity className="items-center">
								<View className="w-12 h-12 bg-gray-100 rounded-full items-center justify-center mb-1">
									<Text className="text-2xl">🎵</Text>
								</View>
								<Text className="text-xs text-gray-600">抖音</Text>
							</TouchableOpacity>
							
							<TouchableOpacity className="items-center">
								<View className="w-12 h-12 bg-gray-100 rounded-full items-center justify-center mb-1">
									<Text className="text-2xl">🍎</Text>
								</View>
								<Text className="text-xs text-gray-600">Apple</Text>
							</TouchableOpacity>
						</View>
					</View>
				</ScrollView>
			</KeyboardAvoidingView>
		</SafeAreaView>
	);
}
