import { useEffect, useState } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import {
	View,
	ScrollView,
	TouchableOpacity,
	Image,
	Dimensions,
	ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { supabase } from "@/config/supabase";

import { SafeAreaView } from "@/components/safe-area-view";
import { Text } from "@/components/ui/text";
import { Button } from "@/components/ui/button";
import { RecipeWithTags } from "@/components/home-screen/MealCard";
import { useAppData } from "@/context/app-data-provider";
import { Ingredient } from "@/types/state";
import { getRecipeColorScheme } from "@/lib/colors";
import { Instruction, RecipeIngredient } from "@/types/recipe";
import { useRef } from "react"; // Add this
import { Animated } from "react-native"; // Add this to existing react-native imports

const { width: screenWidth } = Dimensions.get("window");

export default function RecipeDetail() {
	const { id } = useLocalSearchParams<{ id: string }>();
	const router = useRouter();
	const { tags, ingredients: allIngredients, units } = useAppData();
	const [recipe, setRecipe] = useState<RecipeWithTags | null>(null);
	const [recipeIngredients, setRecipeIngredients] = useState<
		RecipeIngredient[]
	>([]);
	const [instructions, setInstructions] = useState<Instruction[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [isFavorited, setIsFavorited] = useState(false);
	const [servings, setServings] = useState(4);

	// Get dynamic colors based on recipe tags
	const colors = recipe
		? getRecipeColorScheme(recipe.tagIds, tags)
		: {
				text: "#FF6525",
				background: "#FFE0D1",
			};

	const adjustServings = (increment: boolean) => {
		Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
		setServings((prev) => Math.max(1, increment ? prev + 1 : prev - 1));
	};

	// Add these after your existing useState declarations
	const scrollY = useRef(new Animated.Value(0)).current;
	const [isImageStuck, setIsImageStuck] = useState(false);

	// Calculate the "stick point" - where the image should stop scrolling
	const imageInitialHeight = screenWidth;
	const imageMinHeight = screenWidth * 0.6; // Height when it "sticks"
	const scrollThreshold = imageInitialHeight - imageMinHeight;

	const handleScroll = Animated.event(
		[{ nativeEvent: { contentOffset: { y: scrollY } } }],
		{
			useNativeDriver: false,
			listener: (event: any) => {
				const offsetY = event.nativeEvent.contentOffset.y;
				setIsImageStuck(offsetY >= scrollThreshold);
			},
		},
	);

	// Create extended color scheme from the primary colors
	const colorScheme = {
		primary: colors.text,
		primaryBg: colors.background,
		secondary: "#54CDC3", // Keep teal for ingredients
		secondaryBg: "#E8F9F7",
		accent: "#FFB524", // Keep golden for instructions
		accentBg: "#FFF2D6",
		success: "#6B8E23", // Keep olive for success actions
		successBg: "#EBF3E7",
		coral: "#F88675", // Keep coral for servings
		coralBg: "#FFE5E1",
		salmon: "#FF6F61",
		salmonBg: "#FFE6E2",
	};

	useEffect(() => {
		fetchRecipe();
	}, [id]);

	const fetchRecipe = async () => {
		if (!id) return;

		try {
			setLoading(true);
			setError(null);

			// Fetch recipe with tags
			const { data: recipe, error: recipeError } = await supabase
				.from("recipe")
				.select(
					`
					*,
					recipe_tags(
						tag_id
					)
				`,
				)
				.eq("id", id)
				.single();

			if (recipeError) {
				console.error("Error fetching recipe:", recipeError);
				setError(recipeError.message);
				return;
			}

			// Transform recipe data to include tagIds
			const recipeWithTags = {
				...recipe,
				tagIds:
					recipe.recipe_tags?.map((rt: any) => rt.tag_id).filter(Boolean) || [],
			};

			const { data: ingredientsData, error: ingredientsError } = await supabase
				.from("recipe_ingredients")
				.select("*")
				.eq("recipe_id", id)
				.order("id");

			if (ingredientsError) {
				console.error("Error fetching ingredients:", ingredientsError);
				setError(ingredientsError.message);
				return;
			}

			const { data: instructionsData, error: instructionsError } =
				await supabase
					.from("instructions")
					.select("*")
					.eq("recipe_id", id)
					.order("step_number");

			if (instructionsError) {
				console.error("Error fetching instructions:", instructionsError);
				setError(instructionsError.message);
				return;
			}

			setRecipe(recipeWithTags);
			setRecipeIngredients(ingredientsData || []);
			setInstructions(instructionsData || []);
			setServings(recipeWithTags.default_servings || 4);
		} catch (err) {
			console.error("Unexpected error:", err);
			setError("Failed to fetch recipe");
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
	};

	const getIngredientName = (ingredientId: string) => {
		const ingredient = allIngredients.find((ing) => ing.id === ingredientId);
		return ingredient?.name || ingredientId;
	};

	// Helper function to get unit info by id
	const getUnitInfo = (unitId?: string) => {
		if (!unitId) return null;
		const unit = units.find((u) => u.id === unitId);
		return unit;
	};

	const formatQuantity = (quantity?: number, unitInfo?: any) => {
		if (!quantity) return "";

		const formattedQuantity =
			quantity % 1 === 0 ? quantity.toString() : quantity.toFixed(2);

		if (!unitInfo) return formattedQuantity;

		// Use abbreviation if available, otherwise use full name
		const unitDisplay = unitInfo.abbreviation || unitInfo.name;
		return `${formattedQuantity} ${unitDisplay}`;
	};

	if (loading) {
		return (
			<SafeAreaView
				className="flex-1"
				style={{ backgroundColor: colorScheme.accentBg }}
			>
				<View className="flex-1 items-center justify-center">
					<View
						style={{
							backgroundColor: colorScheme.accent,
							shadowColor: colorScheme.accent,
						}}
						className="w-20 h-20 rounded-2xl items-center justify-center mb-6 shadow-[0px_4px_0px_0px]"
					>
						<Ionicons name="restaurant" size={40} color="#FFF" />
					</View>
					<Text
						style={{ color: colorScheme.accent }}
						className="text-xl font-montserrat-bold tracking-wide uppercase"
					>
						LOADING RECIPE
					</Text>
				</View>
			</SafeAreaView>
		);
	}

	if (error || !recipe) {
		return (
			<SafeAreaView
				className="flex-1"
				style={{ backgroundColor: colorScheme.primaryBg }}
			>
				<View className="flex-1 items-center justify-center p-6">
					<View
						style={{
							backgroundColor: colorScheme.primary,
							shadowColor: colorScheme.primary,
						}}
						className="w-20 h-20 rounded-2xl items-center justify-center mb-6 shadow-[0px_4px_0px_0px]"
					>
						<Ionicons name="alert-circle" size={40} color="#FFF" />
					</View>
					<Text
						style={{ color: colorScheme.primary }}
						className="text-xl font-montserrat-bold tracking-wide uppercase mb-4 text-center"
					>
						{error || "RECIPE NOT FOUND"}
					</Text>
					<TouchableOpacity
						onPress={() => router.back()}
						style={{
							backgroundColor: colorScheme.primary,
							shadowColor: colorScheme.primary,
						}}
						className="px-6 py-3 rounded-xl shadow-[0px_4px_0px_0px] active:shadow-[0px_0px_0px_0px] active:translate-y-[4px]"
					>
						<Text className="text-white font-montserrat-bold tracking-wide uppercase">
							GO BACK
						</Text>
					</TouchableOpacity>
				</View>
			</SafeAreaView>
		);
	}

	return (
		<SafeAreaView
			className="flex-1"
			style={{ backgroundColor: colorScheme.primaryBg }}
			edges={["top"]}
		>
			{/* Header with back and favorite buttons */}
			<View className="absolute top-16 left-0 right-0 z-20 flex-row justify-between items-center px-6">
				<TouchableOpacity
					onPress={handleBackPress}
					style={{
						backgroundColor: "#FFF",
						borderColor: colorScheme.primary,
						shadowColor: colorScheme.primary,
					}}
					className="p-3 rounded-xl border-2 shadow-[0px_4px_0px_0px] active:shadow-[0px_0px_0px_0px] active:translate-y-[4px]"
				>
					<Ionicons name="arrow-back" size={24} color={colorScheme.primary} />
				</TouchableOpacity>

				<TouchableOpacity
					onPress={handleFavoritePress}
					style={{
						backgroundColor: isFavorited ? colorScheme.coral : "#FFF",
						borderColor: isFavorited ? colorScheme.coral : colorScheme.coral,
						shadowColor: isFavorited ? colorScheme.coral : colorScheme.coral,
					}}
					className="p-3 rounded-xl border-2 shadow-[0px_4px_0px_0px] active:shadow-[0px_0px_0px_0px] active:translate-y-[4px]"
				>
					<Ionicons
						name={isFavorited ? "heart" : "heart-outline"}
						size={24}
						color={isFavorited ? "#FFF" : colorScheme.coral}
					/>
				</TouchableOpacity>
			</View>

			<Animated.View
				style={{
					position: "absolute",
					top: 0,
					left: 0,
					right: 0,
					zIndex: 10,
					height: scrollY.interpolate({
						inputRange: [0, scrollThreshold],
						outputRange: [imageInitialHeight, imageMinHeight],
						extrapolate: "clamp",
					}),
					transform: [
						{
							translateY: scrollY.interpolate({
								inputRange: [0, scrollThreshold, scrollThreshold + 1],
								outputRange: [0, -scrollThreshold, -scrollThreshold],
								extrapolate: "clamp",
							}),
						},
					],
					backgroundColor: colorScheme.primaryBg,
					borderBottomWidth: 4,
					borderBottomColor: colorScheme.primary,
				}}
			>
				{recipe.image_url ? (
					<Animated.Image
						source={{ uri: recipe.image_url }}
						className="w-full h-full"
						resizeMode="cover"
						style={{
							opacity: scrollY.interpolate({
								inputRange: [0, scrollThreshold],
								outputRange: [1, 0],
								extrapolate: "clamp",
							}),
						}}
					/>
				) : (
					<Animated.View
						className="w-full h-full items-center justify-center"
						style={{
							opacity: scrollY.interpolate({
								inputRange: [0, scrollThreshold],
								outputRange: [1, 0],
								extrapolate: "clamp",
							}),
						}}
					>
						<Ionicons
							name="restaurant-outline"
							size={80}
							color={colorScheme.primary}
							style={{ opacity: 0.3 }}
						/>
					</Animated.View>
				)}
			</Animated.View>

			<ScrollView
				className="flex-1 bg-white"
				showsVerticalScrollIndicator={false}
				onScroll={handleScroll}
				scrollEventThrottle={16}
				contentContainerStyle={{ paddingTop: imageInitialHeight }}
			>
				{/* Recipe Content */}
				<View className="px-6">
					{/* Title and Description */}
					<View className="mb-6">
						<Text
							style={{ color: colorScheme.primary }}
							className="text-sm font-montserrat-bold tracking-wide uppercase mb-2"
						>
							RECIPE DETAILS
						</Text>
						<Text
							className="text-3xl font-montserrat-bold mb-3"
							style={{
								color: colorScheme.primary,
								lineHeight: 36,
							}}
						>
							{recipe.name}
						</Text>

						{recipe.description && (
							<Text
								className="text-base font-montserrat-semibold leading-6"
								style={{
									color: colorScheme.primary + "CC",
								}}
							>
								{recipe.description}
							</Text>
						)}
					</View>

					{/* Recipe Stats */}
					<View className="flex-row justify-center gap-4 mb-8">
						{recipe.prep_time && (
							<View className="items-center">
								<View
									style={{
										backgroundColor: colorScheme.primary, // Changed from colorScheme.secondary
										shadowColor: colorScheme.primary, // Changed from colorScheme.secondary
									}}
									className="p-3 rounded-xl mb-2 shadow-[0px_4px_0px_0px]"
								>
									<Ionicons name="time-outline" size={24} color="#FFF" />
								</View>
								<Text
									className="text-sm font-montserrat-bold tracking-wide uppercase"
									style={{ color: colorScheme.primary }} // Changed from colorScheme.secondary
								>
									PREP TIME
								</Text>
								<Text
									className="text-lg font-montserrat-bold"
									style={{ color: colorScheme.primary }} // Changed from colorScheme.secondary
								>
									{recipe.prep_time}M
								</Text>
							</View>
						)}

						{recipe.cook_time && (
							<View className="items-center">
								<View
									style={{
										backgroundColor: colorScheme.primary, // Changed from colorScheme.accent
										shadowColor: colorScheme.primary, // Changed from colorScheme.accent
									}}
									className="p-3 rounded-xl mb-2 shadow-[0px_4px_0px_0px]"
								>
									<Ionicons name="flame-outline" size={24} color="#FFF" />
								</View>
								<Text
									className="text-sm font-montserrat-bold tracking-wide uppercase"
									style={{ color: colorScheme.primary }} // Changed from colorScheme.accent
								>
									COOK TIME
								</Text>
								<Text
									className="text-lg font-montserrat-bold"
									style={{ color: colorScheme.primary }} // Changed from colorScheme.accent
								>
									{recipe.cook_time}M
								</Text>
							</View>
						)}

						<View className="items-center">
							<View
								style={{
									backgroundColor: colorScheme.primary, // Changed from colorScheme.success
									shadowColor: colorScheme.primary, // Changed from colorScheme.success
								}}
								className="p-3 rounded-xl mb-2 shadow-[0px_4px_0px_0px]"
							>
								<Ionicons name="star" size={24} color="#FFF" />
							</View>
							<Text
								className="text-sm font-montserrat-bold tracking-wide uppercase"
								style={{ color: colorScheme.primary }} // Changed from colorScheme.success
							>
								DIFFICULTY
							</Text>
							<Text
								className="text-lg font-montserrat-bold"
								style={{ color: colorScheme.primary }} // Changed from colorScheme.success
							>
								EASY
							</Text>
						</View>
					</View>

					{/* Servings Adjuster */}
					<View
						style={{
							backgroundColor: colorScheme.coralBg,
							borderColor: colorScheme.coral,
							shadowColor: colorScheme.coral,
						}}
						className="border-2 rounded-2xl p-4 mb-6 shadow-[0px_4px_0px_0px]"
					>
						<View className="flex-row items-center justify-between">
							<Text
								className="text-lg font-montserrat-bold tracking-wide uppercase"
								style={{ color: colorScheme.coral }}
							>
								SERVINGS
							</Text>
							<View className="flex-row items-center">
								<TouchableOpacity
									onPress={() => adjustServings(false)}
									style={{
										backgroundColor: colorScheme.coral,
										shadowColor: colorScheme.coral,
									}}
									className="w-10 h-10 rounded-xl items-center justify-center shadow-[0px_2px_0px_0px] active:shadow-[0px_0px_0px_0px] active:translate-y-[2px]"
								>
									<Ionicons name="remove" size={20} color="#FFF" />
								</TouchableOpacity>
								<Text
									className="mx-6 text-xl font-montserrat-bold"
									style={{ color: colorScheme.coral }}
								>
									{servings}
								</Text>
								<TouchableOpacity
									onPress={() => adjustServings(true)}
									style={{
										backgroundColor: colorScheme.coral,
										shadowColor: colorScheme.coral,
									}}
									className="w-10 h-10 rounded-xl items-center justify-center shadow-[0px_2px_0px_0px] active:shadow-[0px_0px_0px_0px] active:translate-y-[2px]"
								>
									<Ionicons name="add" size={20} color="#FFF" />
								</TouchableOpacity>
							</View>
						</View>
					</View>

					{/* Ingredients */}
					{recipeIngredients.length > 0 && (
						<View className="mb-8">
							<Text
								className="text-xl font-montserrat-bold mb-4 tracking-wide uppercase"
								style={{ color: colorScheme.secondary }}
							>
								INGREDIENTS
							</Text>
							<View
								style={{
									backgroundColor: colorScheme.secondaryBg,
									borderColor: colorScheme.secondary,
									shadowColor: colorScheme.secondary,
								}}
								className="border-2 rounded-2xl p-4 shadow-[0px_4px_0px_0px]"
							>
								{recipeIngredients.map((recipeIngredient, index) => {
									const ingredientName = getIngredientName(
										recipeIngredient.ingredient_id,
									);
									const unitInfo = getUnitInfo(recipeIngredient.unit_id);
									const adjustedQuantity = recipeIngredient.quantity_per_serving
										? recipeIngredient.quantity_per_serving * servings
										: undefined;
									const quantityDisplay = formatQuantity(
										adjustedQuantity,
										unitInfo,
									);

									return (
										<View
											key={index}
											className="flex-row items-center py-3 border-b border-gray-200 last:border-b-0"
										>
											<View
												className="w-3 h-3 rounded-full mr-4 flex-shrink-0"
												style={{ backgroundColor: colorScheme.secondary }}
											/>
											<View className="flex-1">
												<Text
													className="text-base font-montserrat-bold"
													style={{ color: colorScheme.secondary }}
												>
													{ingredientName}
												</Text>
												{quantityDisplay && (
													<Text
														className="text-sm font-montserrat-medium mt-1"
														style={{ color: colorScheme.secondary + "CC" }}
													>
														{quantityDisplay}
													</Text>
												)}
											</View>
										</View>
									);
								})}
							</View>
						</View>
					)}

					{/* Instructions */}
					{instructions.length > 0 && (
						<View className="mb-8">
							<Text
								className="text-xl font-montserrat-bold mb-4 tracking-wide uppercase"
								style={{ color: colorScheme.accent }}
							>
								INSTRUCTIONS
							</Text>
							<View
								style={{
									backgroundColor: colorScheme.accentBg,
									borderColor: colorScheme.accent,
									shadowColor: colorScheme.accent,
								}}
								className="border-2 rounded-2xl p-4 shadow-[0px_4px_0px_0px]"
							>
								{instructions.map((instruction, index) => (
									<View
										key={index}
										className="flex-row py-4 border-b border-gray-200 last:border-b-0"
									>
										<View
											className="w-8 h-8 rounded-xl items-center justify-center mr-4 mt-1"
											style={{
												backgroundColor: colorScheme.accent,
												shadowColor: colorScheme.accent,
											}}
										>
											<Text
												className="text-sm font-montserrat-bold"
												style={{ color: "#FFF" }}
											>
												{index + 1}
											</Text>
										</View>
										<Text
											className="flex-1 text-base leading-6 font-montserrat-medium"
											style={{ color: colorScheme.accent }}
										>
											{instruction.instruction}
										</Text>
									</View>
								))}
							</View>
						</View>
					)}
				</View>
			</ScrollView>
		</SafeAreaView>
	);
}
