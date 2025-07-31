import { router } from "expo-router";
import { View, FlatList, TouchableOpacity, ScrollView, Animated, Dimensions } from "react-native";
import { useState, useEffect, useRef } from "react";
import { supabase } from "@/config/supabase";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { usePressAnimation } from "@/hooks/onPressAnimation";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { H1, H3, Muted } from "@/components/ui/typography";
import { Recipe } from "@/types/recipe";
import { SafeAreaView } from "@/components/safe-area-view";
import { Image } from "@/components/image";

// Smaller horizontal recipe card component
const HorizontalRecipeCard = ({ recipe, colors }: { recipe: Recipe; colors: { text: string; background: string } }) => {
	return (
		<TouchableOpacity
			style={{ backgroundColor: colors.background, width: 280 }}
			className="p-4 rounded-xl mr-4"
			accessibilityRole="button"
			accessibilityLabel={`View ${recipe.name} recipe`}
		>
			<View>
				<Text 
					style={{ color: colors.text }}
					className="text-lg font-semibold uppercase mb-2 leading-tight"
				>
					RECIPE
				</Text>

				<View 
					style={{ backgroundColor: colors.text }}
					className="aspect-[5/3] rounded-lg overflow-hidden mb-2"
				>
					<Image
						source={typeof recipe.image_url === 'string' ? { uri: recipe.image_url } : recipe.image_url}
						className="w-full h-full"
						contentFit="cover"
					/>
				</View>

				<Text className="text-background text-xl font-bold tracking-wide uppercase mb-2 leading-tight">
					{recipe.name}
				</Text>

				<View className="flex-row justify-between items-center">
					<View className="flex-row items-center gap-1">
						<Ionicons name="star" size={16} color={colors.text} />
						<Text 
							style={{ color: colors.text }}
							className="text-sm font-semibold"
						>
							{recipe.difficulty || "Easy"}
						</Text>
					</View>
					<View className="flex-row items-center gap-1">
						<Ionicons name="time-outline" size={16} color={colors.text} />
						<Text 
							style={{ color: colors.text }}
							className="text-sm font-semibold"
						>
							{recipe.total_time} mins
						</Text>
					</View>
				</View>
			</View>
		</TouchableOpacity>
	);
};

const RecipeGroup = ({ title, recipes, colors, showAll = false }: { 
	title: string; 
	recipes: Recipe[]; 
	colors: { text: string; background: string }; 
	showAll?: boolean 
}) => {
	const displayRecipes = showAll ? recipes : recipes.slice(0, 8);
	
	return (
		<View className="mb-8">
			<View className="flex-row items-center justify-between mb-4 px-4">
				<Text
                    style={{ color: colors.text }}
                    className="text-2xl font-bold tracking-wide uppercase">
					{title}
				</Text>
                <TouchableOpacity>
                    <Text 
                        style={{ color: colors.text }}
                        className="text-base font-semibold uppercase tracking-wide"
                    >
                        SEE ALL
                    </Text>
                </TouchableOpacity>
			</View>
			
			<ScrollView 
				horizontal 
				showsHorizontalScrollIndicator={false}
				contentContainerStyle={{ paddingHorizontal: 16, paddingRight: 32 }}
				decelerationRate="fast"
				snapToInterval={288}
				snapToAlignment="start"
			>
				{displayRecipes.map((recipe: Recipe) => (
					<HorizontalRecipeCard 
						key={recipe.id} 
						recipe={recipe} 
						colors={colors}
					/>
				))}
			</ScrollView>
		</View>
	);
};

export default function Explore() {
	const [recipes, setRecipes] = useState<Recipe[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

    const contentOpacity = useRef(new Animated.Value(0)).current;
	const contentTranslateY = useRef(new Animated.Value(20)).current;
	const scrollY = useRef(new Animated.Value(0)).current;

    const searchPress = usePressAnimation({
		hapticStyle: 'Light',
		pressDistance: 2,
	});

	const filterPress = usePressAnimation({
		hapticStyle: 'Light',
		pressDistance: 2,
	});

	const retryPress = usePressAnimation({
		hapticStyle: 'Medium',
		pressDistance: 4,
	});

	// Color schemes for different categories
	const categoryColors = {
		"Popular": { text: "#F88675", background: "#FFC2B9" },
		"Quick & Easy": { text: "#FFB524", background: "#FFDF9E" },
		"Healthy": { text: "#6B8E23", background: "#D3E4CD" },
		"Comfort Food": { text: "#FF6525", background: "#FFA884" },
		"Seafood": { text: "#54CDC3", background: "#BEF1ED" },
		"Vegetarian": { text: "#4CAF50", background: "#A5D6A7" }
	};

    useEffect(() => {
		const contentTimer = setTimeout(() => {
			Animated.parallel([
				Animated.timing(contentOpacity, {
					toValue: 1,
					duration: 400,
					useNativeDriver: true,
				}),
				Animated.timing(contentTranslateY, {
					toValue: 0,
					duration: 400,
					useNativeDriver: true,
				}),
			]).start();
		}, 300);

		return () => {
			clearTimeout(contentTimer);
		};
	}, []);

	const fetchRecipes = async () => {
		try {
			setLoading(true);
			setError(null);

			let { data: recipe, error } = await supabase
				.from('recipe')
				.select('*')

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
		console.log('Filter pressed');
	};

	const handleSearchPress = () => {
		Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
		console.log('Search pressed');
	};

	// Group recipes by category (mock grouping for demo)
	const groupedRecipes = {
		"Popular": recipes.slice(0, 6),
		"Quick & Easy": recipes.filter(r => r.total_time != null && r.total_time <= 30),
		"Healthy": recipes.slice(2, 8),
		"Comfort Food": recipes.slice(1, 7),
		"Seafood": recipes.slice(3, 9),
		"Vegetarian": recipes.slice(0, 5)
	};

	// Header animation based on scroll
	const headerOpacity = scrollY.interpolate({
		inputRange: [0, 100],
		outputRange: [0, 1],
		extrapolate: 'clamp',
	});

	if (loading) {
		return (
			<SafeAreaView className="flex-1 bg-background" edges={["top", "bottom"]}>
				<View className="flex-1 items-center justify-center p-4">
					<View className="bg-[#FFB524] rounded-2xl p-8 items-center shadow-lg">
						<Text className="text-background text-2xl font-bold tracking-wider uppercase mb-4">
							LOADING
						</Text>
						<Text className="text-background/80 text-lg">Loading delicious recipes...</Text>
					</View>
				</View>
			</SafeAreaView>
		);
	}

    if (error) {
		return (
			<SafeAreaView className="flex-1 bg-background" edges={["top", "bottom"]}>
				<View className="flex-1 items-center justify-center p-4">
					<View className="bg-[#FF6525] rounded-2xl p-8 items-center shadow-lg w-full max-w-sm">
						<Text className="text-background text-2xl font-bold tracking-wider uppercase mb-6">
							ERROR
						</Text>
						
						<View className="items-center mb-6">
							<Ionicons name="alert-circle-outline" size={48} color="#FFF" className="mb-3" />
							<Text className="text-background/90 text-center text-base leading-relaxed">
								{error}
							</Text>
						</View>

						<Button 
							onPress={fetchRecipes}
							size="lg"
							variant="default"
							className="w-full bg-background"
							{...retryPress}
						>
							<View className="flex-row items-center">
								<Ionicons name="refresh" size={18} color="#FF6525" className="mr-2" />
								<Text className="text-[#FF6525] text-lg font-semibold">Try Again</Text>
							</View>
						</Button>
					</View>
				</View>
			</SafeAreaView>
		);
	}

	return (
		<View className="flex-1 bg-background">
			{/* Floating Search Bar */}
			<Animated.View 
				style={{ opacity: headerOpacity }}
				className="absolute top-0 left-0 right-0 z-10 px-4 pt-16 pb-4 bg-background/95 backdrop-blur-sm border-b border-gray-200"
			>
				<View className="flex-row items-center gap-3">
					<View className="flex-1 bg-gray-100 rounded-full px-4 py-3 flex-row items-center">
						<Ionicons name="search-outline" size={20} color="#666" className="mr-3" />
						<Text className="text-gray-500 text-base flex-1">Search recipes...</Text>
					</View>
					
					<TouchableOpacity 
						onPress={handleFilterPress}
						className="bg-[#FFB524] rounded-full p-3 shadow-sm"
						accessibilityRole="button"
						accessibilityLabel="Filter recipes"
						{...filterPress}
					>
						<Ionicons name="options-outline" size={20} color="#FFF" />
					</TouchableOpacity>
				</View>
			</Animated.View>

			<Animated.ScrollView 
				className="flex-1"
				showsVerticalScrollIndicator={false}
				contentContainerStyle={{ 
					paddingTop: 60,
				}}
				onScroll={Animated.event(
					[{ nativeEvent: { contentOffset: { y: scrollY } } }],
					{ useNativeDriver: false }
				)}
				scrollEventThrottle={16}
			>
				{/* Header Section */}
				<View className="px-4 mb-4 pt-6">
					<TouchableOpacity 
						onPress={handleSearchPress}
						className="bg-pink rounded-2xl p-6 shadow-lg"
						{...searchPress}
					>
						<View className="flex-row items-center justify-between">
							<View className="flex-1">
								<Text className="text-background text-xl font-bold tracking-wide uppercase mb-2">
									FIND YOUR RECIPE
								</Text>
								<Text className="text-background/80 text-base">
									Search by ingredient, cuisine, or dish name
								</Text>
							</View>
							<View className="bg-background/20 rounded-full p-4">
								<Ionicons name="search-outline" size={28} color="#FFF" />
							</View>
						</View>
					</TouchableOpacity>
				</View>

				{/* Quick Actions */}
				<View className="flex-row gap-3 mb-8 px-4">
					<TouchableOpacity 
						onPress={handleFilterPress}
						className="flex-1 bg-[#FFB524] rounded-xl p-4 flex-row items-center justify-center"
						{...filterPress}
					>
						<Ionicons name="options-outline" size={20} color="#FFF" className="mr-2" />
						<Text className="text-background font-semibold uppercase tracking-wide">
							FILTERS
						</Text>
					</TouchableOpacity>
					
					<TouchableOpacity className="flex-1 bg-[#F88675] rounded-xl p-4 flex-row items-center justify-center">
						<Ionicons name="heart-outline" size={20} color="#FFF" className="mr-2" />
						<Text className="text-background font-semibold uppercase tracking-wide">
							FAVORITES
						</Text>
					</TouchableOpacity>
				</View>

				{recipes.length > 0 && (
					<Animated.View
						style={{
							opacity: contentOpacity,
							transform: [{ translateY: contentTranslateY }],
						}}
					>
						{Object.entries(groupedRecipes).map(([category, categoryRecipes]) => 
							categoryRecipes.length > 0 && (
								<RecipeGroup
									key={category}
									title={category}
									recipes={categoryRecipes}
									colors={categoryColors[category as keyof typeof categoryColors] || categoryColors["Popular"]}
								/>
							)
						)}
					</Animated.View>
				)}

				{!loading && !error && recipes.length === 0 && (
					<Animated.View
						style={{
							opacity: contentOpacity,
							transform: [{ translateY: contentTranslateY }],
						}}
						className="items-center justify-center p-4"
					>
						<View className="bg-[#F88675] rounded-2xl p-8 items-center shadow-lg mx-4">
							<Ionicons name="restaurant-outline" size={48} color="#FFF" className="mb-4" />
							<Text className="text-background text-xl font-bold tracking-wider uppercase mb-2 text-center">
								No Recipes Found
							</Text>
							<Text className="text-background/80 text-center text-base leading-relaxed">
								Check back soon for delicious new recipes!
							</Text>
						</View>
					</Animated.View>
				)}
			</Animated.ScrollView>
		</View>
	);
}