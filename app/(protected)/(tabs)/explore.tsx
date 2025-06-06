import { router } from "expo-router";
import { View, FlatList, Image, TouchableOpacity, ScrollView } from "react-native";
import { useState, useEffect } from "react";
import { supabase } from "@/config/supabase";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";

import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { H1, H3, Muted } from "@/components/ui/typography";

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

interface RecipeCategory {
	id: string;
	title: string;
	recipes: Recipe[];
}

export default function Explore() {
	const [recipes, setRecipes] = useState<Recipe[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	const fetchRecipes = async () => {
		try {
			setLoading(true);
			setError(null);

			let { data: recipe, error } = await supabase
				.from('recipe')
				.select('*')

			console.log('Fetched recipes:', recipe);

			if (error) {
				console.error('Error fetching recipes:', error);
				setError(error.message);
				return;
			}

			setRecipes(recipe || []);
		} catch (err) {
			console.error('Unexpected error:', err);
			setError('Failed to fetch recipes');
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchRecipes();
	}, []);

	const handleFilterPress = () => {
		Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
		// TODO: Implement filter functionality
		console.log('Filter pressed');
	};

	const handleSearchPress = () => {
		Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
		// TODO: Implement search functionality
		console.log('Search pressed');
	};

	// Create mock categories - in real app, this would come from your data
	const createRecipeCategories = (recipes: Recipe[]): RecipeCategory[] => {
		if (recipes.length === 0) return [];

		// Mock categories - you can customize these based on your actual data structure
		const categories: RecipeCategory[] = [
			{
				id: 'trending',
				title: 'Trending Now',
				recipes: recipes.slice(0, Math.ceil(recipes.length * 0.4))
			},
			{
				id: 'quick',
				title: 'Quick & Easy',
				recipes: recipes.filter(r => (r.cook_time || 30) <= 30)
			},
			{
				id: 'popular',
				title: 'Most Popular',
				recipes: recipes.slice(Math.ceil(recipes.length * 0.3))
			},
			{
				id: 'recent',
				title: 'Recently Added',
				recipes: recipes.slice().reverse().slice(0, Math.ceil(recipes.length * 0.6))
			}
		];

		// Filter out empty categories
		return categories.filter(category => category.recipes.length > 0);
	};

	// Generate random background colors for cards
	const getRandomBackground = (recipeId: string) => {
		const colors = [
			'#FFF7DC', // Brand cream
			'#F1F3E4', // Light background green
			'#FFBDBE', // Brand pink
			'#E2F380', // Brand light green
			'#F5F7E8', // Very light green
			'#FFEAEB', // Very light pink
		];
		
		// Use recipe ID to ensure consistent color per recipe
		const index = recipeId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % colors.length;
		return colors[index];
	};

	const HorizontalRecipeCard = ({ recipe }: { recipe: Recipe }) => (
		<TouchableOpacity 
			className="mr-4 bg-white rounded-2xl overflow-hidden"
			style={{ 
				width: 200,
				shadowColor: '#000',
				shadowOffset: {
					width: 0,
					height: 2,
				},
				shadowOpacity: 0.1,
				shadowRadius: 8,
				elevation: 4, // For Android
			}}
			onPress={() => {
				Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
				router.push(`/recipe/${recipe.id}`);
			}}
		>
			<View 
				className="w-full h-32 items-center justify-center overflow-hidden"
				style={{ backgroundColor: getRandomBackground(recipe.id) }}
			>
				{recipe.image_url ? (
					<Image
						source={{ uri: recipe.image_url }}
						className="w-full h-full"
						resizeMode="contain"
					/>
				) : (
					<Ionicons name="restaurant-outline" size={28} color="#25551b" style={{ opacity: 0.4 }} />
				)}
			</View>
			
			<View className="p-4">
				<Text 
					className="text-base font-bold mb-3"
					style={{ 
						fontFamily: 'Montserrat',
						color: '#25551b'
					}}
					numberOfLines={2}
				>
					{recipe.name}
				</Text>
				
				<View className="flex-row items-center justify-between">
					<View className="flex-row items-center">
						{recipe.cook_time && (
							<View className="flex-row items-center mr-3">
								<Ionicons name="time-outline" size={14} color="#25551b" style={{ opacity: 0.6 }} />
								<Text className="text-sm text-gray-500 ml-1">
									{recipe.cook_time}m
								</Text>
							</View>
						)}
						{/* Mock ingredients count - replace with actual data */}
						<View className="flex-row items-center">
							<Ionicons name="list-outline" size={14} color="#25551b" style={{ opacity: 0.6 }} />
							<Text className="text-sm text-gray-500 ml-1">
								{Math.floor(Math.random() * 8) + 5} ing
							</Text>
						</View>
					</View>
					
					<TouchableOpacity 
						className="p-2 rounded-full"
						style={{ backgroundColor: '#E2F380' }}
						onPress={(e) => {
							e.stopPropagation(); // Prevent card tap
							Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
							// TODO: Implement favorite functionality
							console.log('Favorited:', recipe.name);
						}}
					>
						<Ionicons name="heart-outline" size={14} color="#25551b" />
					</TouchableOpacity>
				</View>
			</View>
		</TouchableOpacity>
	);

	const CategorySection = ({ category }: { category: RecipeCategory }) => (
		<View className="mb-10">
			<View className="px-6 mb-3 flex-row items-center justify-between">
				<Text 
					className="text-xl font-bold"
					style={{ 
						fontFamily: 'montserrat',
						color: '#25551b'
					}}
				>
					{category.title.toUpperCase()}
				</Text>
				<TouchableOpacity
					onPress={() => {
						Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
						// TODO: Navigate to category view
						console.log('View all for category:', category.title);
					}}
				>
					<Text 
						className="text-base font-medium"
						style={{ color: '#25551b', opacity: 0.7 }}
					>
						View All →
					</Text>
				</TouchableOpacity>
			</View>
			
			<FlatList
				data={category.recipes}
				renderItem={({ item }) => <HorizontalRecipeCard recipe={item} />}
				keyExtractor={(item) => `${category.id}-${item.id}`}
				horizontal
				showsHorizontalScrollIndicator={false}
				contentContainerStyle={{ paddingHorizontal: 24 }}
				decelerationRate="fast"
				snapToInterval={208} // Card width + margin
				snapToAlignment="start"
			/>
		</View>
	);

	if (loading) {
		return (
			<View className="flex-1 items-center justify-center bg-background p-4">
				<Text>Loading recipes...</Text>
			</View>
		);
	}

	if (error) {
		return (
			<View className="flex-1 items-center justify-center bg-background p-4 gap-y-4">
				<H1 className="text-center">Explore</H1>
				<Text className="text-red-500 text-center">{error}</Text>
				<Button onPress={fetchRecipes}>
					<Text>Retry</Text>
				</Button>
			</View>
		);
	}

	const categories = createRecipeCategories(recipes);

	return (
		<View className="flex-1 bg-background">
			{/* Modern Header with icons */}
			<View className="px-6 pt-16 pb-6 bg-background border-b border-gray-200">
				<View className="flex-row items-center justify-between">
					<View className="flex-1">
						<Text 
							className="text-foreground text-3xl font-bold"
							style={{ 
								fontFamily: 'MMDisplay',
								color: '#25551b',
								letterSpacing: 0.5 
							}}
						>
							EXPLORE
						</Text>
					</View>
					
					<View className="flex-row items-center gap-3">
						<TouchableOpacity 
							onPress={handleSearchPress}
							className="p-3 rounded-full"
							style={{ backgroundColor: '#E2F380' }}
						>
							<Ionicons 
								name="search-outline" 
								size={24} 
								color="#25551b" 
							/>
						</TouchableOpacity>
						
						<TouchableOpacity 
							onPress={handleFilterPress}
							className="p-3 rounded-full"
							style={{ backgroundColor: '#E2F380' }}
						>
							<Ionicons 
								name="options-outline" 
								size={24} 
								color="#25551b" 
							/>
						</TouchableOpacity>
					</View>
				</View>
			</View>
			
			{recipes.length === 0 ? (
				<View className="flex-1 items-center justify-center p-6">
					<Text className="text-gray-500 text-center text-lg">
						No recipes found. Be the first to add one!
					</Text>
				</View>
			) : (
				<ScrollView 
					className="flex-1"
					showsVerticalScrollIndicator={false}
					contentContainerStyle={{ paddingTop: 16, paddingBottom: 20 }}
				>
					{categories.map((category) => (
						<CategorySection key={category.id} category={category} />
					))}
				</ScrollView>
			)}
		</View>
	);
}