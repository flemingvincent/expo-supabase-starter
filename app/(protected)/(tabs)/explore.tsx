import { router } from "expo-router";
import { View, FlatList, Image, TouchableOpacity } from "react-native";
import { useState, useEffect } from "react";
import { supabase } from "@/config/supabase";

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

	const RecipeCard = ({ recipe }: { recipe: Recipe }) => (
		<TouchableOpacity 
			className="bg-white rounded-xl shadow-sm border border-gray-100 mb-4 overflow-hidden"
			onPress={() => {
				// Navigate to recipe detail page
				// router.push(`/recipe/${recipe.id}`);
				console.log('Recipe tapped:', recipe.name);
			}}
		>
			{recipe.image_url && (
				<Image
					source={{ uri: recipe.image_url }}
					className="w-full h-48"
					resizeMode="cover"
				/>
			)}
			<View className="p-4">
				<H3 className="text-foreground mb-2">{recipe.name}</H3>
				{recipe.description && (
					<Text className="text-gray-600 text-sm mb-3" numberOfLines={2}>
						{recipe.description}
					</Text>
				)}
				<View className="flex-row items-center justify-between">
					{recipe.cook_time && (
						<Text className="text-xs text-gray-500">
							{recipe.cook_time} mins
						</Text>
					)}
					{recipe.difficulty && (
						<Text className="text-xs text-gray-500 capitalize">
							{recipe.difficulty}
						</Text>
					)}
				</View>
			</View>
		</TouchableOpacity>
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

	return (
		<View className="flex-1 bg-background">
			<View className="p-4 pb-2">
				<H1 className="text-foreground">Explore Recipes</H1>
				<Muted className="mt-1">
					Discover delicious recipes from our community
				</Muted>
			</View>
			
			{recipes.length === 0 ? (
				<View className="flex-1 items-center justify-center p-4">
					<Text className="text-gray-500 text-center">
						No recipes found. Be the first to add one!
					</Text>
				</View>
			) : (
				<FlatList
					data={recipes}
					renderItem={({ item }) => <RecipeCard recipe={item} />}
					keyExtractor={(item) => item.id}
					contentContainerStyle={{ padding: 16 }}
					showsVerticalScrollIndicator={false}
					refreshing={loading}
					onRefresh={fetchRecipes}
				/>
			)}
		</View>
	);
}