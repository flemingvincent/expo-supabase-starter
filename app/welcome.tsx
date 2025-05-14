import React from "react";
import { View, TouchableOpacity } from "react-native";
import { useRouter, Link } from "expo-router";

import Svg, { Text as SvgText } from "react-native-svg";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "@/components/image";
import { SafeAreaView } from "@/components/safe-area-view";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";

export default function WelcomeScreen() {
	const router = useRouter();
	const appIcon = require("@/assets/mm-homie-transparent-bg.png");

	return (
		<SafeAreaView className="flex flex-1 bg-accent p-4">
			<View className="flex flex-1 items-center justify-center web:m-4">
				<Svg width="400" height="150" style={{ marginVertical: 10 }}>
					<SvgText
						x="200"
						y="70"
						textAnchor="middle"
						fill="#25551b"
						stroke="#E2F380"
						strokeWidth="0"
						letterSpacing="2"
						fontFamily="MMDisplay"
						fontSize="48"
						fontWeight="bold"
					>
						WELCOME!
					</SvgText>
				</Svg>

				<Image
					source={appIcon}
					className="w-60 h-60 mx-auto"
					contentFit="contain"
				/>

				<Svg width="400" height="150" style={{ marginVertical: 10 }}>
					<SvgText
						x="200"
						y="70"
						textAnchor="middle"
						fill="#25551b"
						stroke="#E2F380"
						strokeWidth="0"
						letterSpacing="1"
						fontFamily="MMDisplay"
						fontSize="48"
						fontWeight="bold"
					>
						MEALMATE
					</SvgText>
				</Svg>
			</View>

			<View className="flex flex-col items-center gap-y-6 web:m-4">
				{/* Single primary button */}
				<Button
					variant="default"
					className="w-full py-3"
					onPress={() => {
						router.push("/sign-up");
					}}
				>
					<View className="flex-row items-center justify-center">
						<Text className="text-primary-foreground !text-lg mr-2">
							Get Started
						</Text>
						<Ionicons name="arrow-forward" size={20} color="white" />
					</View>
				</Button>

				{/* Secondary sign in link */}
				<View className="flex-row">
					<Text className="text-primary">Already have an account? </Text>
					<Link href="/sign-in" asChild>
						<TouchableOpacity>
							<Text className="text-primary font-bold">Sign in</Text>
						</TouchableOpacity>
					</Link>
				</View>
			</View>
		</SafeAreaView>
	);
}
