import React from "react";
import { View, ScrollView, TouchableOpacity } from "react-native";
import { router } from "expo-router";

import { SafeAreaView } from "@/components/safe-area-view";
import { Text } from "@/components/ui/text";
import { StudyCard } from "@/components/ui/study-card";
import { H1, Muted } from "@/components/ui/typography";

export default function StudyHomepage() {
	const mainFeatures = [
		{
			title: "拍题答疑",
			subtitle: "AI互动讲解",
			icon: "📷",
			bgColor: "bg-blue-500",
			iconBgColor: "bg-blue-100",
		},
		{
			title: "作业批改",
			subtitle: "作业/口算/作文",
			icon: "✅",
			bgColor: "bg-green-500",
			iconBgColor: "bg-green-100",
		},
	];

	const studyTools = [
		{
			title: "语文作文",
			subtitle: "3分钟有思路",
			icon: "✍️",
			bgColor: "bg-orange-100",
		},
		{
			title: "错题本",
			subtitle: "AI帮选必练题",
			icon: "📚",
			bgColor: "bg-green-100",
		},
		{
			title: "拍照翻译",
			subtitle: "能点读会讲解",
			icon: "🌐",
			bgColor: "bg-purple-100",
		},
		{
			title: "英语作文",
			subtitle: "定制不重复",
			icon: "📝",
			bgColor: "bg-purple-100",
		},
		{
			title: "口语练习",
			subtitle: "读英文练对话",
			icon: "🗣️",
			bgColor: "bg-blue-100",
		},
		{
			title: "识万物",
			subtitle: "拍照问AI",
			icon: "🌿",
			bgColor: "bg-green-100",
		},
	];

	return (
		<SafeAreaView className="flex-1 bg-gray-50">
			<ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
				{/* Header */}
				<View className="bg-black px-4 pt-4 pb-6 rounded-b-3xl">
					<View className="flex-row items-center justify-between mb-4">
						<View className="flex-row items-center">
							<View className="w-10 h-10 bg-gray-600 rounded-full mr-3" />
							<Text className="text-white text-base">Dynamic Island</Text>
						</View>
						<TouchableOpacity>
							<Text className="text-white text-xl">⏰</Text>
						</TouchableOpacity>
					</View>

					<View className="flex-row items-center">
						<Text className="text-white text-lg mr-2">初一</Text>
						<Text className="text-white">▼</Text>
					</View>
				</View>

				{/* Main Feature Cards */}
				<View className="px-4 mt-6">
					<View className="flex-row gap-3">
						{mainFeatures.map((feature, index) => (
							<StudyCard
								key={index}
								title={feature.title}
								subtitle={feature.subtitle}
								icon={<Text className="text-4xl">{feature.icon}</Text>}
								bgColor={feature.bgColor}
								iconBgColor={feature.iconBgColor}
								size="large"
								onPress={() => console.log(`Pressed ${feature.title}`)}
							/>
						))}
					</View>
				</View>

				{/* Study Tools Section */}
				<View className="px-4 mt-8">
					<Text className="text-lg font-semibold text-gray-900 mb-4">
						百宝箱
					</Text>

					<View className="flex-row flex-wrap gap-3">
						{studyTools.map((tool, index) => (
							<View key={index} className="w-[48%]">
								<StudyCard
									title={tool.title}
									subtitle={tool.subtitle}
									icon={<Text className="text-2xl">{tool.icon}</Text>}
									bgColor={tool.bgColor}
									onPress={() => console.log(`Pressed ${tool.title}`)}
								/>
							</View>
						))}
					</View>
				</View>

				{/* Bottom spacing */}
				<View className="h-20" />
			</ScrollView>
		</SafeAreaView>
	);
}
