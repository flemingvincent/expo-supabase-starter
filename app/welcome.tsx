import React, { useEffect, useRef } from "react";
import { View, TouchableOpacity, Animated } from "react-native";
import { useRouter, Link } from "expo-router";
import * as Haptics from 'expo-haptics';

import Svg, { Text as SvgText } from "react-native-svg";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "@/components/image";
import { SafeAreaView } from "@/components/safe-area-view";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";

export default function WelcomeScreen() {
	const router = useRouter();
	const appIcon = require("@/assets/mm-homie-transparent-bg.png");

	// Animation values
	const welcomeOpacity = useRef(new Animated.Value(0)).current;
	const logoScale = useRef(new Animated.Value(0.8)).current;
	const logoOpacity = useRef(new Animated.Value(0)).current;
	const mealmateOpacity = useRef(new Animated.Value(0)).current;
	const buttonOpacity = useRef(new Animated.Value(0)).current;
	const buttonTranslateY = useRef(new Animated.Value(30)).current;
	const welcomeScale = useRef(new Animated.Value(0.8)).current;

	// Individual letter animations for MEALMATE
	const letters = ['M', 'E', 'A', 'L', 'M', 'A', 'T', 'E'];
	const letterAnimations = useRef(
		letters.map(() => ({
			opacity: new Animated.Value(0),
			translateY: new Animated.Value(30),
		}))
	).current;

	// Breathing animation for logo
	const breathingAnimation = useRef(new Animated.Value(1)).current;

	useEffect(() => {
		// Stage-based animation sequence matching web component timing
		
		// Stage 1: Welcome text fade in and scale (at 300ms like web logo)
		const welcomeTimer = setTimeout(() => {
			Animated.parallel([
				Animated.timing(welcomeOpacity, {
					toValue: 1,
					duration: 800,
					useNativeDriver: true,
				}),
				Animated.timing(welcomeScale, {
					toValue: 1,
					duration: 800,
					useNativeDriver: true,
				}),
			]).start();
		}, 300);

		// Stage 2: Logo fade in and scale (at 600ms)
		const logoTimer = setTimeout(() => {
			Animated.parallel([
				Animated.spring(logoScale, {
					toValue: 1,
					tension: 50,
					friction: 7,
					useNativeDriver: true,
				}),
				Animated.timing(logoOpacity, {
					toValue: 1,
					duration: 700,
					useNativeDriver: true,
				}),
			]).start();
		}, 600);

		// Stage 3: MEALMATE letters with staggered animation (at 800ms like web text)
		const textTimer = setTimeout(() => {
			// Start each letter with delay: 100 + index * 60 (matching web component)
			letterAnimations.forEach((letterAnim, index) => {
				setTimeout(() => {
					Animated.parallel([
						Animated.timing(letterAnim.opacity, {
							toValue: 1,
							duration: 500,
							useNativeDriver: true,
						}),
						Animated.timing(letterAnim.translateY, {
							toValue: 0,
							duration: 500,
							useNativeDriver: true,
						}),
					]).start();
				}, 100 + index * 60); // Exact timing from web component
			});
		}, 800);

		// Stage 4: Button entrance (at 1400ms like web progress bar)
		const buttonTimer = setTimeout(() => {
			Animated.parallel([
				Animated.timing(buttonOpacity, {
					toValue: 1,
					duration: 700,
					useNativeDriver: true,
				}),
				Animated.spring(buttonTranslateY, {
					toValue: 0,
					tension: 50,
					friction: 8,
					useNativeDriver: true,
				}),
			]).start();
		}, 1400);

		// Breathing animation for logo (starts after logo is visible)
		const breathingLoop = Animated.loop(
			Animated.sequence([
				Animated.timing(breathingAnimation, {
					toValue: 1.03, // More subtle than before
					duration: 2000,
					useNativeDriver: true,
				}),
				Animated.timing(breathingAnimation, {
					toValue: 1,
					duration: 2000,
					useNativeDriver: true,
				}),
			]),
			{ iterations: -1 }
		);

		// Start breathing after logo animation completes
		setTimeout(() => breathingLoop.start(), 1300);

		return () => {
			// Cleanup
			clearTimeout(welcomeTimer);
			clearTimeout(logoTimer);
			clearTimeout(textTimer);
			clearTimeout(buttonTimer);
			breathingLoop.stop();
		};
	}, []);

	return (
		<SafeAreaView className="flex flex-1 bg-accent p-4">
			<View className="flex flex-1 items-center justify-center web:m-4">
				{/* Animated Welcome Text with scale */}
				<Animated.View 
					style={{ 
						opacity: welcomeOpacity,
						transform: [{ scale: welcomeScale }]
					}}
				>
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
				</Animated.View>

				{/* Animated Logo with breathing effect */}
				<Animated.View
					style={{
						transform: [
							{ scale: Animated.multiply(logoScale, breathingAnimation) }
						],
						opacity: logoOpacity,
					}}
				>
					<Image
						source={appIcon}
						className="w-60 h-60 mx-auto"
						contentFit="contain"
					/>
				</Animated.View>

				{/* Animated MEALMATE with properly spaced individual letters */}
				<View style={{ marginVertical: 10, height: 150, justifyContent: 'center' }}>
					<View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
						{letters.map((letter, index) => {
							// Define proper widths for each letter to handle spacing
							const letterWidths: { [key: string]: number } = {
								'M': 45, 'E': 30, 'A': 35, 'L': 28, 'T': 32
							};
							const width = letterWidths[letter] || 35;
							
							return (
								<Animated.View
									key={index}
									style={{
										opacity: letterAnimations[index].opacity,
										transform: [{ translateY: letterAnimations[index].translateY }],
										width: width,
										alignItems: 'center',
									}}
								>
									<Svg width={width} height="60">
										<SvgText
											x={width / 2}
											y="40"
											textAnchor="middle"
											fill="#25551b"
											stroke="#E2F380"
											strokeWidth="0"
											fontFamily="MMDisplay"
											fontSize="48"
											fontWeight="bold"
										>
											{letter}
										</SvgText>
									</Svg>
								</Animated.View>
							);
						})}
					</View>
				</View>
			</View>

			{/* Animated Bottom Section */}
			<Animated.View
				style={{
					opacity: buttonOpacity,
					transform: [{ translateY: buttonTranslateY }],
				}}
				className="flex flex-col items-center gap-y-6 web:m-4"
			>
				{/* Enhanced Button with subtle scale animation */}
				<Animated.View className="w-full">
					<Button
						variant="default"
						className="w-full py-3"
						onPress={() => {
							// Add haptic feedback
							Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
							
							// Add subtle press animation
							Animated.sequence([
								Animated.timing(buttonOpacity, {
									toValue: 0.8,
									duration: 100,
									useNativeDriver: true,
								}),
								Animated.timing(buttonOpacity, {
									toValue: 1,
									duration: 100,
									useNativeDriver: true,
								}),
							]).start();
							
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
				</Animated.View>

				{/* Sign in link */}
				<View className="flex-row">
					<Text className="text-primary">Already have an account? </Text>
					<Link href="/sign-in" asChild>
						<TouchableOpacity
							onPress={() => {
								Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
							}}
						>
							<Text className="text-primary font-bold">Sign in</Text>
						</TouchableOpacity>
					</Link>
				</View>
			</Animated.View>
		</SafeAreaView>
	);
}