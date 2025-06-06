import { useEffect, useState } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import { 
	View, 
	ScrollView, 
	TouchableOpacity, 
	Image, 
	Dimensions,
	ActivityIndicator 
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { supabase } from "@/config/supabase";

import { SafeAreaView } from "@/components/safe-area-view";
import { Text } from "@/components/ui/text";
import { Button } from "@/components/ui/button";

interface Recipe {
	id: string;
	name: string;
	description?: string;
	prep_time?: number;
	cook_time?: number;
	total_time?: number;
	default_servings?: number;
	created_at?: string;
	image_url?: string;
	difficulty?: string;
}

// Mock data - you'll want to add these fields to your database
interface RecipeDetails extends Recipe {
	ingredients?: string[];
	instructions?: string[];
	nutrition?: {
		calories?: number;
		protein?: string;
		carbs?: string;
		fat?: string;
	};
}

const { width: screenWidth } = Dimensions.get('window');

export default function RecipeDetail() {
	const { id } = useLocalSearchParams<{ id: string }>();
	const router = useRouter();
	const [recipe, setRecipe] = useState<RecipeDetails | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [isFavorited, setIsFavorited] = useState(false);
	const [servings, setServings] = useState(4);

	useEffect(() => {
		fetchRecipe();
	}, [id]);

	const fetchRecipe = async () => {
		if (!id) return;

		try {
			setLoading(true);
			setError(null);

			const { data: recipe, error } = await supabase
				.from('recipe')
				.select('*')
				.eq('id', id)
				.single();

			if (error) {
				console.error('Error fetching recipe:', error);
				setError(error.message);
				return;
			}

			// Add mock ingredients and instructions for demo
			const recipeWithDetails: RecipeDetails = {
				...recipe,
				ingredients: [
					"2 cups all-purpose flour",
					"1 cup granulated sugar",
					"2 large eggs",
					"1/2 cup butter, melted",
					"1 cup milk",
					"2 tsp baking powder",
					"1 tsp vanilla extract",
					"1/2 tsp salt"
				],
				instructions: [
					"Preheat your oven to 350°F (175°C) and grease a 9-inch round cake pan.",
					"In a large bowl, whisk together flour, sugar, baking powder, and salt.",
					"In another bowl, beat eggs, then add milk, melted butter, and vanilla extract.",
					"Pour the wet ingredients into the dry ingredients and mix until just combined.",
					"Pour batter into prepared pan and bake for 25-30 minutes until golden brown.",
					"Let cool for 10 minutes before removing from pan. Serve warm or at room temperature."
				],
				nutrition: {
					calories: 320,
					protein: "6g",
					carbs: "45g",
					fat: "12g"
				}
			};

			setRecipe(recipeWithDetails);
			setServings(recipe.default_servings || 4);
		} catch (err) {
			console.error('Unexpected error:', err);
			setError('Failed to fetch recipe');
		} finally {
			setLoading(false);
		}
	};

	const handleBackPress = () => {
		Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
		router.back();
	};

	const handleFavoritePress = () => {
		Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
		setIsFavorited(!isFavorited);
		// TODO: Implement favorite functionality
	};

	const adjustServings = (increment: boolean) => {
		Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
		setServings(prev => Math.max(1, increment ? prev + 1 : prev - 1));
	};

	const getDifficultyColor = (difficulty?: string) => {
		switch (difficulty?.toLowerCase()) {
			case 'easy': return '#4CAF50';
			case 'medium': return '#FF9800';
			case 'hard': return '#F44336';
			default: return '#25551b';
		}
	};

	if (loading) {
		return (
			<SafeAreaView className="flex-1 bg-background">
				<View className="flex-1 items-center justify-center">
					<ActivityIndicator size="large" color="#25551b" />
					<Text className="mt-4 text-gray-500">Loading recipe...</Text>
				</View>
			</SafeAreaView>
		);
	}

	if (error || !recipe) {
		return (
			<SafeAreaView className="flex-1 bg-background">
				<View className="flex-1 items-center justify-center p-6">
					<Text className="text-red-500 text-center mb-4">
						{error || 'Recipe not found'}
					</Text>
					<Button onPress={() => router.back()}>
						<Text>Go Back</Text>
					</Button>
				</View>
			</SafeAreaView>
		);
	}

	return (
		<SafeAreaView className="flex-1 bg-background" edges={["top"]}>
			{/* Header with back and favorite buttons */}
			<View className="absolute top-16 left-0 right-0 z-10 flex-row justify-between items-center px-6">
				<TouchableOpacity
					onPress={handleBackPress}
					className="p-3 rounded-full bg-white/90"
					style={{
						shadowColor: '#000',
						shadowOffset: { width: 0, height: 2 },
						shadowOpacity: 0.15,
						shadowRadius: 8,
						elevation: 4,
					}}
				>
					<Ionicons name="arrow-back" size={24} color="#25551b" />
				</TouchableOpacity>

				<TouchableOpacity
					onPress={handleFavoritePress}
					className="p-3 rounded-full bg-white/90"
					style={{
						shadowColor: '#000',
						shadowOffset: { width: 0, height: 2 },
						shadowOpacity: 0.15,
						shadowRadius: 8,
						elevation: 4,
					}}
				>
					<Ionicons 
						name={isFavorited ? "heart" : "heart-outline"} 
						size={24} 
						color={isFavorited ? "#F44336" : "#25551b"} 
					/>
				</TouchableOpacity>
			</View>

			<ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
				{/* Hero Image */}
				<View 
					className="w-full bg-gray-100"
					style={{ height: screenWidth * 0.75 }}
				>
					{recipe.image_url ? (
						<Image
							source={{ uri: recipe.image_url }}
							className="w-full h-full"
							resizeMode="cover"
						/>
					) : (
						<View 
							className="w-full h-full items-center justify-center"
							style={{ backgroundColor: '#F1F3E4' }}
						>
							<Ionicons name="restaurant-outline" size={80} color="#25551b" style={{ opacity: 0.3 }} />
						</View>
					)}
				</View>

				{/* Recipe Content */}
				<View className="px-6 py-6">
					{/* Title and Description */}
					<View className="mb-6">
						<Text 
							className="text-3xl font-bold mb-3"
							style={{ 
								fontFamily: 'Montserrat',
								color: '#25551b',
								lineHeight: 36
							}}
						>
							{recipe.name}
						</Text>
						
						{recipe.description && (
							<Text 
								className="text-base text-gray-600 leading-6"
								style={{ fontFamily: 'Montserrat' }}
							>
								{recipe.description}
							</Text>
						)}
					</View>

					{/* Recipe Stats */}
					<View className="flex-row justify-between mb-8">
						{recipe.prep_time && (
							<View className="items-center">
								<View className="p-3 rounded-full mb-2" style={{ backgroundColor: '#E2F380' }}>
									<Ionicons name="time-outline" size={24} color="#25551b" />
								</View>
								<Text className="text-sm font-medium text-gray-500">Prep Time</Text>
								<Text className="text-lg font-bold" style={{ color: '#25551b' }}>
									{recipe.prep_time}m
								</Text>
							</View>
						)}

						{recipe.cook_time && (
							<View className="items-center">
								<View className="p-3 rounded-full mb-2" style={{ backgroundColor: '#E2F380' }}>
									<Ionicons name="flame-outline" size={24} color="#25551b" />
								</View>
								<Text className="text-sm font-medium text-gray-500">Cook Time</Text>
								<Text className="text-lg font-bold" style={{ color: '#25551b' }}>
									{recipe.cook_time}m
								</Text>
							</View>
						)}

						{recipe.difficulty && (
							<View className="items-center">
								<View className="p-3 rounded-full mb-2" style={{ backgroundColor: '#E2F380' }}>
									<Ionicons name="star-outline" size={24} color="#25551b" />
								</View>
								<Text className="text-sm font-medium text-gray-500">Difficulty</Text>
								<Text 
									className="text-lg font-bold capitalize"
									style={{ color: getDifficultyColor(recipe.difficulty) }}
								>
									{recipe.difficulty}
								</Text>
							</View>
						)}
					</View>

					{/* Servings Adjuster */}
					<View className="bg-white rounded-2xl p-4 mb-6" style={{
						shadowColor: '#000',
						shadowOffset: { width: 0, height: 2 },
						shadowOpacity: 0.05,
						shadowRadius: 8,
						elevation: 2,
					}}>
						<View className="flex-row items-center justify-between">
							<Text className="text-lg font-semibold" style={{ color: '#25551b' }}>
								Servings
							</Text>
							<View className="flex-row items-center">
								<TouchableOpacity
									onPress={() => adjustServings(false)}
									className="w-10 h-10 rounded-full items-center justify-center"
									style={{ backgroundColor: '#E2F380' }}
								>
									<Ionicons name="remove" size={20} color="#25551b" />
								</TouchableOpacity>
								<Text className="mx-6 text-xl font-bold" style={{ color: '#25551b' }}>
									{servings}
								</Text>
								<TouchableOpacity
									onPress={() => adjustServings(true)}
									className="w-10 h-10 rounded-full items-center justify-center"
									style={{ backgroundColor: '#E2F380' }}
								>
									<Ionicons name="add" size={20} color="#25551b" />
								</TouchableOpacity>
							</View>
						</View>
					</View>

					{/* Ingredients */}
					{recipe.ingredients && (
						<View className="mb-8">
							<Text 
								className="text-xl font-bold mb-4"
								style={{ 
									fontFamily: 'Montserrat',
									color: '#25551b'
								}}
							>
								INGREDIENTS
							</Text>
							<View className="bg-white rounded-2xl p-4" style={{
								shadowColor: '#000',
								shadowOffset: { width: 0, height: 2 },
								shadowOpacity: 0.05,
								shadowRadius: 8,
								elevation: 2,
							}}>
								{recipe.ingredients.map((ingredient, index) => (
									<View key={index} className="flex-row items-center py-3 border-b border-gray-100 last:border-b-0">
										<View 
											className="w-2 h-2 rounded-full mr-4"
											style={{ backgroundColor: '#E2F380' }}
										/>
										<Text className="flex-1 text-base" style={{ color: '#25551b' }}>
											{ingredient}
										</Text>
									</View>
								))}
							</View>
						</View>
					)}

					{/* Instructions */}
					{recipe.instructions && (
						<View className="mb-8">
							<Text 
								className="text-xl font-bold mb-4"
								style={{ 
									fontFamily: 'Montserrat',
									color: '#25551b'
								}}
							>
								INSTRUCTIONS
							</Text>
							<View className="bg-white rounded-2xl p-4" style={{
								shadowColor: '#000',
								shadowOffset: { width: 0, height: 2 },
								shadowOpacity: 0.05,
								shadowRadius: 8,
								elevation: 2,
							}}>
								{recipe.instructions.map((instruction, index) => (
									<View key={index} className="flex-row py-4 border-b border-gray-100 last:border-b-0">
										<View 
											className="w-8 h-8 rounded-full items-center justify-center mr-4 mt-1"
											style={{ backgroundColor: '#E2F380' }}
										>
											<Text className="text-sm font-bold" style={{ color: '#25551b' }}>
												{index + 1}
											</Text>
										</View>
										<Text className="flex-1 text-base leading-6" style={{ color: '#25551b' }}>
											{instruction}
										</Text>
									</View>
								))}
							</View>
						</View>
					)}

					{/* Nutrition Info */}
					{recipe.nutrition && (
						<View className="mb-8">
							<Text 
								className="text-xl font-bold mb-4"
								style={{ 
									fontFamily: 'Montserrat',
									color: '#25551b'
								}}
							>
								NUTRITION PER SERVING
							</Text>
							<View className="bg-white rounded-2xl p-4" style={{
								shadowColor: '#000',
								shadowOffset: { width: 0, height: 2 },
								shadowOpacity: 0.05,
								shadowRadius: 8,
								elevation: 2,
							}}>
								<View className="flex-row justify-between">
									{recipe.nutrition.calories && (
										<View className="items-center">
											<Text className="text-2xl font-bold" style={{ color: '#25551b' }}>
												{recipe.nutrition.calories}
											</Text>
											<Text className="text-sm text-gray-500">Calories</Text>
										</View>
									)}
									{recipe.nutrition.protein && (
										<View className="items-center">
											<Text className="text-2xl font-bold" style={{ color: '#25551b' }}>
												{recipe.nutrition.protein}
											</Text>
											<Text className="text-sm text-gray-500">Protein</Text>
										</View>
									)}
									{recipe.nutrition.carbs && (
										<View className="items-center">
											<Text className="text-2xl font-bold" style={{ color: '#25551b' }}>
												{recipe.nutrition.carbs}
											</Text>
											<Text className="text-sm text-gray-500">Carbs</Text>
										</View>
									)}
									{recipe.nutrition.fat && (
										<View className="items-center">
											<Text className="text-2xl font-bold" style={{ color: '#25551b' }}>
												{recipe.nutrition.fat}
											</Text>
											<Text className="text-sm text-gray-500">Fat</Text>
										</View>
									)}
								</View>
							</View>
						</View>
					)}
				</View>
			</ScrollView>

			{/* Bottom Action Button */}
			<View className="px-6 pb-6 pt-4 bg-background border-t border-gray-200">
				<Button
					size="default"
					className="w-full"
					onPress={() => {
						Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
						// TODO: Implement start cooking functionality
						console.log('Start cooking:', recipe.name);
					}}
				>
					<View className="flex-row items-center">
						<Ionicons name="play" size={20} color="white" style={{ marginRight: 8 }} />
						<Text className="text-primary-foreground font-semibold">Start Cooking</Text>
					</View>
				</Button>
			</View>
		</SafeAreaView>
	);
}