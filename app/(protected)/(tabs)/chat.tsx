import React, { useState, useRef, useEffect } from "react";
import {
	View,
	ScrollView,
	TextInput,
	TouchableOpacity,
	KeyboardAvoidingView,
	Platform,
	Keyboard,
} from "react-native";

import { SafeAreaView } from "@/components/safe-area-view";
import { Text } from "@/components/ui/text";
import { ChatBubble } from "@/components/ui/chat-bubble";
import { cozeService, CozeMessage } from "@/services/coze";

export default function ChatPage() {
	const [messages, setMessages] = useState<CozeMessage[]>([
		{
			role: "assistant",
			content:
				"Hi，很高兴见到你！有什么需要我帮忙的吗？学知识问问题都可以找我哦。",
			timestamp: new Date().toLocaleTimeString("zh-CN", {
				hour: "2-digit",
				minute: "2-digit",
			}),
		},
	]);
	const [inputText, setInputText] = useState("");
	const [isTyping, setIsTyping] = useState(false);
	const [conversationId, setConversationId] = useState<string>("");
	const scrollViewRef = useRef<ScrollView>(null);

	const suggestedQuestions = [
		"飞机上为什么禁止使用手机？",
		"行程问题的类型和求解方法有哪些？",
		"怎样培养良好的学习习惯？",
	];

	const quickActions = [
		{ icon: "🗣️", label: "练口语", color: "bg-green-100" },
		{ icon: "💬", label: "聊心情", color: "bg-blue-100" },
		{ icon: "✍️", label: "帮我写", color: "bg-purple-100" },
		{ icon: "🎨", label: "帮我画", color: "bg-orange-100" },
	];

	useEffect(() => {
		initConversation();
	}, []);

	const initConversation = async () => {
		const id = await cozeService.createConversation();
		setConversationId(id);
	};

	const handleSend = async () => {
		if (!inputText.trim()) return;

		const userMessage: CozeMessage = {
			role: "user",
			content: inputText,
			timestamp: new Date().toLocaleTimeString("zh-CN", {
				hour: "2-digit",
				minute: "2-digit",
			}),
		};

		setMessages((prev) => [...prev, userMessage]);
		setInputText("");
		setIsTyping(true);
		Keyboard.dismiss();

		try {
			let assistantResponse = "";

			await cozeService.sendMessage(inputText, conversationId, (chunk) => {
				assistantResponse += chunk;
				// Update the last message with streaming content
				setMessages((prev) => {
					const newMessages = [...prev];
					if (newMessages[newMessages.length - 1]?.role === "assistant") {
						newMessages[newMessages.length - 1].content = assistantResponse;
					} else {
						newMessages.push({
							role: "assistant",
							content: assistantResponse,
							timestamp: new Date().toLocaleTimeString("zh-CN", {
								hour: "2-digit",
								minute: "2-digit",
							}),
						});
					}
					return newMessages;
				});
			});
		} catch (error) {
			console.error("Error sending message:", error);
			setMessages((prev) => [
				...prev,
				{
					role: "assistant",
					content: "抱歉，我遇到了一些问题。请稍后再试。",
					timestamp: new Date().toLocaleTimeString("zh-CN", {
						hour: "2-digit",
						minute: "2-digit",
					}),
				},
			]);
		} finally {
			setIsTyping(false);
		}

		scrollViewRef.current?.scrollToEnd({ animated: true });
	};

	const handleSuggestedQuestion = (question: string) => {
		setInputText(question);
		handleSend();
	};

	return (
		<SafeAreaView className="flex-1 bg-white">
			<KeyboardAvoidingView
				className="flex-1"
				behavior={Platform.OS === "ios" ? "padding" : "height"}
			>
				{/* Header */}
				<View className="bg-black px-4 py-3 flex-row items-center justify-between">
					<View className="flex-row items-center">
						<View className="w-10 h-10 bg-green-500 rounded-full items-center justify-center mr-3">
							<Text className="text-2xl">🤖</Text>
						</View>
						<View>
							<Text className="text-white font-semibold">豆包</Text>
							<Text className="text-gray-400 text-xs">内容由AI生成</Text>
						</View>
					</View>
					<View className="flex-row gap-4">
						<TouchableOpacity>
							<Text className="text-white text-xl">🔇</Text>
						</TouchableOpacity>
						<TouchableOpacity>
							<Text className="text-white text-xl">⋯</Text>
						</TouchableOpacity>
					</View>
				</View>

				{/* Chat history link */}
				<TouchableOpacity className="bg-gray-50 px-4 py-2">
					<Text className="text-center text-gray-500 text-sm">
						下拉查看历史
					</Text>
				</TouchableOpacity>

				{/* Messages */}
				<ScrollView
					ref={scrollViewRef}
					className="flex-1 px-4 py-4"
					showsVerticalScrollIndicator={false}
				>
					{messages.map((message, index) => (
						<ChatBubble
							key={index}
							message={message.content}
							isUser={message.role === "user"}
							timestamp={message.timestamp}
							avatar={message.role === "assistant" ? "🤖" : undefined}
						/>
					))}

					{messages.length === 1 && (
						<>
							{/* Suggested questions */}
							<View className="mt-4">
								{suggestedQuestions.map((question, index) => (
									<TouchableOpacity
										key={index}
										className="bg-white border border-gray-200 rounded-2xl p-4 mb-3 flex-row items-center"
										onPress={() => handleSuggestedQuestion(question)}
									>
										<Text className="flex-1 text-gray-700">{question}</Text>
										<Text className="text-gray-400 ml-2">›</Text>
									</TouchableOpacity>
								))}
							</View>

							{/* Quick actions */}
							<View className="flex-row justify-center gap-3 mt-4">
								{quickActions.map((action, index) => (
									<TouchableOpacity
										key={index}
										className="items-center"
										onPress={() => console.log(`Pressed ${action.label}`)}
									>
										<View
											className={`w-12 h-12 rounded-full items-center justify-center mb-1 ${action.color}`}
										>
											<Text className="text-xl">{action.icon}</Text>
										</View>
										<Text className="text-xs text-gray-600">
											{action.label}
										</Text>
									</TouchableOpacity>
								))}
							</View>
						</>
					)}

					{isTyping && (
						<View className="flex-row items-center mt-2">
							<View className="w-10 h-10 rounded-full items-center justify-center mr-2">
								<Text className="text-2xl">🤖</Text>
							</View>
							<View className="bg-gray-100 rounded-2xl rounded-bl-sm px-4 py-3">
								<Text className="text-gray-500">正在思考...</Text>
							</View>
						</View>
					)}
				</ScrollView>

				{/* Input area */}
				<View className="border-t border-gray-200 px-4 py-3">
					<View className="flex-row items-center gap-3">
						<TouchableOpacity className="w-10 h-10 items-center justify-center">
							<Text className="text-2xl">📷</Text>
						</TouchableOpacity>

						<TextInput
							className="flex-1 bg-gray-100 rounded-full px-4 py-2 text-base"
							placeholder="发消息或按住说话..."
							value={inputText}
							onChangeText={setInputText}
							onSubmitEditing={handleSend}
							returnKeyType="send"
						/>

						<TouchableOpacity className="w-10 h-10 items-center justify-center">
							<Text className="text-2xl">🎤</Text>
						</TouchableOpacity>

						{inputText.trim() && (
							<TouchableOpacity
								className="w-10 h-10 items-center justify-center"
								onPress={handleSend}
							>
								<Text className="text-2xl">📤</Text>
							</TouchableOpacity>
						)}
					</View>
				</View>
			</KeyboardAvoidingView>
		</SafeAreaView>
	);
}
