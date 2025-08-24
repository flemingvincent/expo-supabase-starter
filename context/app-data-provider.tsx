import {
	createContext,
	PropsWithChildren,
	useContext,
	useEffect,
	useState,
} from "react";
import { supabase } from "@/config/supabase";
import { useAuth } from "./supabase-provider";

import {
	Recipe,
	Tag,
	UserMealPlan,
	MealPlanWithRecipe,
	RecipeWithTags,
	MealPlanItem,
	Ingredient,
	Equipment,
	Unit,
	UserPreferences,
	UserPreferencesWithTags,
	WeekWithComputed,
} from "@/types/database";

interface AppDataState {
	tags: Tag[];
	ingredients: Ingredient[];
	equipment: Equipment[];
	units: Unit[];
	recipes: RecipeWithTags[];
	filteredRecipes: RecipeWithTags[];
	currentMealPlan: MealPlanItem[];
	weeks: WeekWithComputed[];
	currentWeek: WeekWithComputed | null;
	userPreferences: UserPreferencesWithTags;
	loading: boolean;
	error: Error | null;

	// Data refresh methods
	refreshTags: () => Promise<void>;
	refreshIngredients: () => Promise<void>;
	refreshEquipment: () => Promise<void>;
	refreshUnits: () => Promise<void>;
	refreshRecipes: () => Promise<void>;
	refreshUserPreferences: () => Promise<void>;
	refreshWeeks: () => Promise<void>;
	refreshAll: () => Promise<void>;

	// Meal plan management methods
	getCurrentMealPlan: (limit?: number) => MealPlanItem[];
	generateInitialMealPlan: () => Promise<void>;
	updateMealServings: (mealId: string, servings: number) => void;
	addMealToPlan: (recipe: RecipeWithTags, servings?: number) => void;
	removeMealFromPlan: (mealId: string) => void;

	// Recipe filtering
	getAvailableRecipes: () => RecipeWithTags[];
	refreshFilteredRecipes: () => void;

	// Week helper methods
	getWeekById: (weekId: string) => WeekWithComputed | undefined;
	getWeeksRange: (startOffset: number, endOffset: number) => WeekWithComputed[];
	getUpcomingWeeks: (count: number) => WeekWithComputed[];

	// Meal plan persistence
	saveMealPlanForWeek: (
		weekId: string,
		meals: MealPlanItem[],
		status?: "draft" | "confirmed" | "completed",
	) => Promise<void>;
	getMealPlanForWeek: (weekId: string) => Promise<MealPlanItem[]>;
	loadMealPlanForWeek: (weekId: string) => Promise<void>;
	updateMealPlanStatus: (
		weekId: string,
		status: "draft" | "confirmed" | "completed",
	) => Promise<void>;
}

const AppDataContext = createContext<AppDataState>({
	tags: [],
	ingredients: [],
	equipment: [],
	units: [],
	recipes: [],
	filteredRecipes: [],
	currentMealPlan: [],
	weeks: [],
	currentWeek: null,
	userPreferences: {
		id: "",
		user_id: "",
		meals_per_week: 1,
		serves_per_meal: 1,
		created_at: "",
		user_goals: [],
		user_preference_tags: [],
	},
	loading: false,
	error: null,
	refreshTags: async () => {},
	refreshIngredients: async () => {},
	refreshEquipment: async () => {},
	refreshUnits: async () => {},
	refreshRecipes: async () => {},
	refreshUserPreferences: async () => {},
	refreshWeeks: async () => {},
	refreshAll: async () => {},
	getCurrentMealPlan: () => [],
	generateInitialMealPlan: async () => {},
	updateMealServings: () => {},
	addMealToPlan: () => {},
	removeMealFromPlan: () => {},
	getAvailableRecipes: () => [],
	refreshFilteredRecipes: () => {},
	getWeekById: () => undefined,
	getWeeksRange: () => [],
	getUpcomingWeeks: () => [],
	saveMealPlanForWeek: async () => {},
	getMealPlanForWeek: async () => [],
	loadMealPlanForWeek: async () => {},
	updateMealPlanStatus: async () => {},
});

export const useAppData = () => useContext(AppDataContext);

export function AppDataProvider({ children }: PropsWithChildren) {
	const [tags, setTags] = useState<Tag[]>([]);
	const [ingredients, setIngredients] = useState<Ingredient[]>([]);
	const [equipment, setEquipment] = useState<Equipment[]>([]);
	const [units, setUnits] = useState<Unit[]>([]);
	const [recipes, setRecipes] = useState<RecipeWithTags[]>([]);
	const [filteredRecipes, setFilteredRecipes] = useState<RecipeWithTags[]>([]);
	const [currentMealPlan, setCurrentMealPlan] = useState<MealPlanItem[]>([]);
	const [weeks, setWeeks] = useState<WeekWithComputed[]>([]);
	const [currentWeek, setCurrentWeek] = useState<WeekWithComputed | null>(null);
	const [userPreferences, setUserPreferences] =
		useState<UserPreferencesWithTags>({
			id: "",
			user_id: "",
			meals_per_week: 1,
			serves_per_meal: 1,
			user_goals: [],
			user_preference_tags: [],
			created_at: "",
		});
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<Error | null>(null);
	const { session } = useAuth();

	// Generate a unique ID for meal plan items
	const generateMealId = () =>
		`meal_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

	const fetchTags = async () => {
		try {
			setLoading(true);
			setError(null);

			const { data, error } = await supabase
				.from("tags")
				.select("*")
				.order("name");

			if (error) {
				throw new Error(error.message);
			}

			setTags(data || []);
		} catch (error) {
			console.error("Error fetching tags:", error);
			setError(error instanceof Error ? error : new Error(String(error)));
		} finally {
			setLoading(false);
		}
	};

	const fetchIngredients = async () => {
		try {
			setLoading(true);
			setError(null);

			const { data, error } = await supabase
				.from("ingredients")
				.select("*")
				.order("name");

			if (error) {
				throw new Error(error.message);
			}

			setIngredients(data || []);
		} catch (error) {
			console.error("Error fetching ingredients:", error);
			setError(error instanceof Error ? error : new Error(String(error)));
		} finally {
			setLoading(false);
		}
	};

	const fetchEquipment = async () => {
		try {
			setLoading(true);
			setError(null);

			const { data, error } = await supabase
				.from("equipment")
				.select("*")
				.order("name");

			if (error) {
				throw new Error(error.message);
			}

			setEquipment(data || []);
		} catch (error) {
			console.error("Error fetching equipment:", error);
			setError(error instanceof Error ? error : new Error(String(error)));
		} finally {
			setLoading(false);
		}
	};

	const fetchUnits = async () => {
		try {
			setLoading(true);
			setError(null);

			const { data, error } = await supabase
				.from("units")
				.select("*")
				.order("name");

			if (error) {
				throw new Error(error.message);
			}

			setUnits(data || []);
		} catch (error) {
			console.error("Error fetching units:", error);
			setError(error instanceof Error ? error : new Error(String(error)));
		} finally {
			setLoading(false);
		}
	};

	const fetchRecipes = async () => {
		try {
			setLoading(true);
			setError(null);

			console.log("🔍 Fetching recipes with tags...");

			// First, let's check if recipe_tags table has any data
			const { data: recipeTagsCheck, error: checkError } = await supabase
				.from("recipe_tags")
				.select("*")
				.limit(5);

			console.log("🔍 Recipe tags table check:", {
				recipeTagsCount: recipeTagsCheck?.length || 0,
				sampleRecipeTags: recipeTagsCheck?.slice(0, 3) || [],
				checkError: checkError?.message
			});

			const { data: recipesData, error } = await supabase
				.from("recipe")
				.select(
					`
					*,
					recipe_tags(
						tag_id
					)
				`,
				)
				.order("created_at", { ascending: false });

			if (error) {
				throw new Error(error.message);
			}

			console.log("🔍 Raw recipe data sample:", {
				totalRecipes: recipesData?.length || 0,
				sampleRecipe: recipesData?.[0] ? {
					name: recipesData[0].name,
					recipe_tags: recipesData[0].recipe_tags,
					recipe_tags_type: typeof recipesData[0].recipe_tags,
					recipe_tags_length: recipesData[0].recipe_tags?.length
				} : null
			});

			// Let's also try a different approach - direct join query
			const { data: alternativeData, error: altError } = await supabase
				.from("recipe")
				.select(`
					*,
					recipe_tags!inner(tag_id)
				`)
				.limit(3);

			console.log("🔍 Alternative query test:", {
				alternativeResults: alternativeData?.length || 0,
				sampleAlternative: alternativeData?.[0] || null,
				altError: altError?.message
			});

			// Transform the data to extract just the tag_ids
			const recipesWithTags: RecipeWithTags[] =
				recipesData?.map((recipe) => {
					const tagIds = recipe.recipe_tags?.map((rt: any) => rt.tag_id).filter(Boolean) || [];
					
					// Log transformation for first few recipes
					if (recipesData.indexOf(recipe) < 3) {
						console.log(`🔍 Transforming recipe "${recipe.name}":`, {
							rawRecipeTags: recipe.recipe_tags,
							extractedTagIds: tagIds
						});
					}
					
					return {
						...recipe,
						tagIds: tagIds,
					};
				}) || [];

			console.log("📊 Recipes fetched:", {
				totalRecipes: recipesWithTags.length,
				recipesWithTags: recipesWithTags.filter(r => r.tagIds.length > 0).length,
				recipesWithoutTags: recipesWithTags.filter(r => r.tagIds.length === 0).length,
				sampleRecipeWithTags: recipesWithTags.find(r => r.tagIds.length > 0) ? {
					name: recipesWithTags.find(r => r.tagIds.length > 0)!.name,
					tagCount: recipesWithTags.find(r => r.tagIds.length > 0)!.tagIds.length,
					tagIds: recipesWithTags.find(r => r.tagIds.length > 0)!.tagIds
				} : "No recipes with tags found",
				sampleRecipeWithoutTags: recipesWithTags.find(r => r.tagIds.length === 0) ? {
					name: recipesWithTags.find(r => r.tagIds.length === 0)!.name,
					tagCount: recipesWithTags.find(r => r.tagIds.length === 0)!.tagIds.length,
					tagIds: recipesWithTags.find(r => r.tagIds.length === 0)!.tagIds
				} : null
			});

			setRecipes(recipesWithTags);
			filterRecipesByPreferences(recipesWithTags);
		} catch (error) {
			console.error("Error fetching recipes:", error);
			setError(error instanceof Error ? error : new Error(String(error)));
		} finally {
			setLoading(false);
		}
	};

	const fetchWeeks = async () => {
		try {
			setLoading(true);
			setError(null);

			// Get current date for calculations
			const today = new Date();
			const todayStr = today.toISOString().split("T")[0];

			// Fetch weeks around current date (e.g., 4 weeks back, 8 weeks forward)
			const { data, error } = await supabase
				.from("weeks")
				.select("*")
				.gte(
					"end_date",
					new Date(today.getTime() - 28 * 24 * 60 * 60 * 1000)
						.toISOString()
						.split("T")[0],
				) // 4 weeks ago
				.lte(
					"start_date",
					new Date(today.getTime() + 56 * 24 * 60 * 60 * 1000)
						.toISOString()
						.split("T")[0],
				) // 8 weeks ahead
				.order("start_date", { ascending: true });

			if (error) {
				throw new Error(error.message);
			}

			const processedWeeks: WeekWithComputed[] = (data || []).map((week) => {
				const currentWeekData = data?.find((w) => w.is_current_week);
				let weekOffset = 0;

				if (currentWeekData) {
					const currentStart = new Date(currentWeekData.start_date);
					const thisStart = new Date(week.start_date);
					weekOffset = Math.round(
						(thisStart.getTime() - currentStart.getTime()) /
							(7 * 24 * 60 * 60 * 1000),
					);
				}

				let displayTitle = week.display_title || "";
				if (!displayTitle) {
					if (week.is_current_week) {
						displayTitle = "This week";
					} else if (weekOffset === 1) {
						displayTitle = "Next week";
					} else if (weekOffset === -1) {
						displayTitle = "Last week";
					} else if (weekOffset > 1) {
						displayTitle = `In ${weekOffset} weeks`;
					} else if (weekOffset < -1) {
						displayTitle = `${Math.abs(weekOffset)} weeks ago`;
					}
				}

				// Determine status
				let status: "past" | "current" | "future" = "future";
				if (week.is_current_week) {
					status = "current";
				} else if (new Date(week.end_date) < today) {
					status = "past";
				}

				return {
					...week,
					displayTitle,
					weekOffset,
					status,
				};
			});

			setWeeks(processedWeeks);

			const current = processedWeeks.find((w) => w.is_current_week);
			setCurrentWeek(current || null);
		} catch (error) {
			console.error("Error fetching weeks:", error);
			setError(error instanceof Error ? error : new Error(String(error)));
		} finally {
			setLoading(false);
		}
	};

	const fetchUserPreferences = async () => {
		try {
			setLoading(true);
			setError(null);

			const { data: prefData, error: prefError } = await supabase
				.from("user_preferences")
				.select("*")
				.eq("user_id", session?.user?.id!)
				.single();

			if (prefError) {
				if (prefError.code === "PGRST116") {
					setUserPreferences({
						id: "",
						user_id: session?.user?.id || "",
						meals_per_week: 1,
						serves_per_meal: 1,
						user_goals: [],
						user_preference_tags: [],
						created_at: "",
					});
					return;
				}
				throw new Error(prefError.message);
			}

			if (prefData) {
				const { data: tagData, error: tagError } = await supabase
					.from("user_preference_tags")
					.select("tag_id")
					.eq("user_preference_id", prefData.id);

				if (tagError) {
					throw new Error(tagError.message);
				}

				// Combine the data
				const updatedPreferences = {
					...prefData,
					user_preference_tags:
						tagData?.map((tag) => ({ tag_id: tag.tag_id, priority: null })) ||
						[],
				};

				console.log("👤 User preferences loaded:", {
					mealsPerWeek: updatedPreferences.meals_per_week,
					servesPerMeal: updatedPreferences.serves_per_meal,
					goals: updatedPreferences.user_goals,
					preferenceTagCount: updatedPreferences.user_preference_tags.length,
					preferenceTagIds: updatedPreferences.user_preference_tags.map(t => t.tag_id)
				});

				setUserPreferences(updatedPreferences);

				filterRecipesByPreferences(recipes);
			} else {
				setUserPreferences({
					id: "",
					user_id: session?.user?.id || "",
					meals_per_week: 1,
					serves_per_meal: 1,
					user_goals: [],
					user_preference_tags: [],
					created_at: "",
				});
			}
		} catch (error) {
			console.error("Error fetching user preferences:", error);
			setError(error instanceof Error ? error : new Error(String(error)));
		} finally {
			setLoading(false);
		}
	};

	const filterRecipesByPreferences = (
		recipesToFilter: RecipeWithTags[] = recipes,
	) => {
		const userPrefTags = (userPreferences.user_preference_tags?.length ?? 0) > 0;
		const userGoals = (userPreferences.user_goals?.length ?? 0) > 0;

		console.log("🔍 Starting recipe filtering:", {
			totalRecipes: recipesToFilter.length,
			hasPreferenceTags: userPrefTags,
			hasGoals: userGoals,
			preferenceTagIds: userPreferences.user_preference_tags?.map(t => t.tag_id) || [],
			goals: userPreferences.user_goals || [],
			sampleRecipeTagIds: recipesToFilter[0]?.tagIds || [],
			recipesWithTagsCount: recipesToFilter.filter(r => r.tagIds && r.tagIds.length > 0).length
		});

		// Debug: Check if recipes actually have tags
		const recipesWithTags = recipesToFilter.filter(r => r.tagIds && r.tagIds.length > 0);
		if (recipesWithTags.length === 0) {
			console.log("⚠️ WARNING: No recipes have tags! All recipes will be returned.");
		}

		// If no preferences or goals, return all recipes
		if (!userPrefTags && !userGoals) {
			console.log("🔍 No preferences found, returning all recipes");
			setFilteredRecipes(recipesToFilter);
			return;
		}

		// If user has preferences but no recipes have tags, return all recipes to avoid empty state
		if (userPrefTags && recipesWithTags.length === 0) {
			console.log("🔍 User has preferences but no recipes have tags, returning all recipes");
			setFilteredRecipes(recipesToFilter);
			return;
		}

		const filtered = recipesToFilter.filter((recipe) => {
			// If recipe has no tags, include it if user has no specific preferences
			if (!recipe.tagIds || recipe.tagIds.length === 0) {
				console.log("⚠️ Recipe has no tags:", recipe.name);
				return false; // Skip recipes without tags when filtering by preferences
			}

			const hasMatchingTags = recipe.tagIds.some((tagId) =>
				userPreferences.user_preference_tags?.find(
					(tag) => tag.tag_id === tagId,
				),
			);
			
			if (hasMatchingTags) {
				console.log("✅ Recipe matches preferences:", {
					recipeName: recipe.name,
					recipeTagIds: recipe.tagIds,
					matchingTags: recipe.tagIds.filter(tagId => 
						userPreferences.user_preference_tags?.find(tag => tag.tag_id === tagId)
					)
				});
			} else {
				console.log("❌ Recipe doesn't match preferences:", {
					recipeName: recipe.name,
					recipeTagIds: recipe.tagIds,
					userPreferenceTagIds: userPreferences.user_preference_tags?.map(t => t.tag_id) || []
				});
			}
			
			return hasMatchingTags;
		});

		console.log("🔍 Filtering complete:", {
			originalCount: recipesToFilter.length,
			filteredCount: filtered.length,
			filteredRecipeNames: filtered.map(r => r.name)
		});

		setFilteredRecipes(filtered);
	};

	const generateInitialMealPlan = async (
		recipesToUse: RecipeWithTags[] = filteredRecipes,
	) => {
		console.log("🍽️ Starting meal plan generation:", {
			availableRecipes: recipesToUse.length,
			targetMealsPerWeek: userPreferences.meals_per_week,
			servesPerMeal: userPreferences.serves_per_meal,
			hasGoals: (userPreferences.user_goals?.length ?? 0) > 0,
			hasPreferenceTags: (userPreferences.user_preference_tags?.length ?? 0) > 0
		});

		if (!recipesToUse.length) {
			console.log("⚠️ No recipes available for meal plan generation");
			setCurrentMealPlan([]);
			return;
		}

		let scoredRecipes = recipesToUse;

		// Score recipes based on user goals and preferences
		if (
			userPreferences.user_goals?.length ||
			userPreferences.user_preference_tags?.length
		) {
			console.log("🎯 Scoring recipes based on preferences and goals...");
			
			scoredRecipes = recipesToUse.map((recipe) => {
				let score = 0;
				let scoreDetails = {
					preferenceTags: 0,
					goalMatches: 0,
					totalScore: 0
				};

				// Score based on matching preference tags
				const matchingPreferenceTags =
					recipe.tagIds?.filter((tagId) =>
						userPreferences.user_preference_tags?.find(
							(tag) => tag.tag_id === tagId,
						),
					) ?? [];
				score += matchingPreferenceTags.length;
				scoreDetails.preferenceTags = matchingPreferenceTags.length;

				// Bonus scoring based on user goals
				if (userPreferences.user_goals?.length && recipe.tagIds) {
					// Get all tags for this recipe to check their types
					const recipeTags = tags.filter((tag) =>
						recipe.tagIds?.includes(tag.id),
					);

					// Score based on goal priority
					userPreferences.user_goals.forEach((goalType, index) => {
						const priority = userPreferences.user_goals!.length - index; // Higher priority for earlier goals
						const hasGoalTypeTags = recipeTags.some(
							(tag) => tag.type === goalType,
						);

						if (hasGoalTypeTags) {
							const goalScore = priority * 2;
							score += goalScore;
							scoreDetails.goalMatches += goalScore;
							
							console.log(`🎯 Goal match for "${recipe.name}":`, {
								goalType,
								priority,
								goalScore,
								matchingTags: recipeTags.filter(tag => tag.type === goalType).map(t => t.name)
							});
						}
					});
				}

				scoreDetails.totalScore = score;

				if (score > 0) {
					console.log(`📊 Recipe scored: "${recipe.name}"`, {
						score,
						details: scoreDetails,
						matchingPreferenceTags: matchingPreferenceTags,
						recipeTagIds: recipe.tagIds
					});
				}

				return {
					...recipe,
					score,
					matchingTags: matchingPreferenceTags,
				};
			});

			// Sort by score (highest first) with randomization for ties
			scoredRecipes = scoredRecipes.sort((a, b) => {
				const scoreA = a.score ?? 0;
				const scoreB = b.score ?? 0;
				if (scoreA === scoreB) {
					return Math.random() - 0.5;
				}
				return scoreB - scoreA;
			});

			console.log("📈 Recipe scoring complete:", {
				topScoredRecipes: scoredRecipes.slice(0, 5).map(r => ({
					name: r.name,
					score: r.score,
					matchingTags: r.matchingTags?.length || 0
				}))
			});

		} else {
			// Random selection if no preferences
			console.log("🎲 No scoring criteria, using random selection");
			scoredRecipes = [...recipesToUse].sort(() => 0.5 - Math.random());
		}

		const mealsToSelect = userPreferences.meals_per_week ?? 4;
		const selectedRecipes = scoredRecipes.slice(0, mealsToSelect);

		console.log("✅ Meal plan selection complete:", {
			requestedMeals: mealsToSelect,
			selectedMeals: selectedRecipes.length,
			selectedRecipes: selectedRecipes.map(r => ({
				name: r.name,
				score: r.score || 0,
				servings: userPreferences.serves_per_meal || r.default_servings || 1
			}))
		});

		const mealPlanItems: MealPlanItem[] = selectedRecipes.map((recipe) => ({
			id: generateMealId(),
			recipe,
			servings: userPreferences.serves_per_meal || recipe.default_servings || 1,
		}));

		setCurrentMealPlan(mealPlanItems);
	};

	const updateMealServings = (mealId: string, servings: number) => {
		console.log("🍽️ Updating meal servings:", { mealId, servings });
		setCurrentMealPlan((prev) =>
			prev.map((meal) => (meal.id === mealId ? { ...meal, servings } : meal)),
		);
	};

	const addMealToPlan = (recipe: RecipeWithTags, servings?: number) => {
		const existingMeal = currentMealPlan.find(
			(meal) => meal.recipe.id === recipe.id,
		);
		if (existingMeal) {
			console.log("⚠️ Recipe already in meal plan:", recipe.name);
			return;
		}

		const newServings = servings ||
			userPreferences.serves_per_meal ||
			recipe.default_servings ||
			1;

		console.log("➕ Adding meal to plan:", {
			recipeName: recipe.name,
			servings: newServings
		});

		const newMeal: MealPlanItem = {
			id: generateMealId(),
			recipe,
			servings: newServings,
		};

		setCurrentMealPlan((prev) => [...prev, newMeal]);
	};

	const removeMealFromPlan = (mealId: string) => {
		const mealToRemove = currentMealPlan.find(meal => meal.id === mealId);
		console.log("➖ Removing meal from plan:", {
			mealId,
			recipeName: mealToRemove?.recipe.name
		});
		setCurrentMealPlan((prev) => prev.filter((meal) => meal.id !== mealId));
	};

	const getAvailableRecipes = (): RecipeWithTags[] => {
		const available = filteredRecipes.filter(
			(recipe) => !currentMealPlan.some((meal) => meal.recipe.id === recipe.id),
		);
		
		console.log("📋 Available recipes (not in current plan):", {
			total: available.length,
			inCurrentPlan: currentMealPlan.length,
			availableRecipes: available.map(r => r.name)
		});
		
		return available;
	};

	const saveMealPlanForWeek = async (
		weekId: string,
		meals: MealPlanItem[],
		status: "draft" | "confirmed" | "completed" = "draft",
	) => {
		try {
			setLoading(true);
			setError(null);

			console.log("💾 Saving meal plan for week:", {
				weekId,
				mealCount: meals.length,
				status,
				meals: meals.map(m => ({
					recipeName: m.recipe.name,
					servings: m.servings
				}))
			});

			// Use the replace_week_meal_plan RPC function for atomic operation
			const mealsData = meals.map((meal, index) => ({
				recipe_id: meal.recipe.id,
				servings: meal.servings,
				sort_order: index,
				status: status,
			}));

			const { data, error } = await supabase.rpc("replace_week_meal_plan", {
				p_week_id: weekId,
				p_meals: mealsData,
				p_user_id: session?.user?.id,
			});

			if (error) {
				throw new Error(error.message);
			}

			console.log("✅ Meal plan saved successfully for week:", weekId);
		} catch (error) {
			console.error("❌ Error saving meal plan:", error);
			setError(error instanceof Error ? error : new Error(String(error)));
			throw error; // Re-throw to handle in the calling component
		} finally {
			setLoading(false);
		}
	};

	const updateMealPlanStatus = async (
		weekId: string,
		status: "draft" | "confirmed" | "completed",
	) => {
		try {
			setLoading(true);
			setError(null);

			console.log("📝 Updating meal plan status:", { weekId, status });

			const { data, error } = await supabase.rpc(
				"update_week_meal_plan_status",
				{
					p_week_id: weekId,
					p_status: status,
					p_user_id: session?.user?.id,
				},
			);

			if (error) {
				throw new Error(error.message);
			}

			console.log(`✅ Meal plan status updated to ${status} for week:`, weekId);
		} catch (error) {
			console.error("❌ Error updating meal plan status:", error);
			setError(error instanceof Error ? error : new Error(String(error)));
			throw error;
		} finally {
			setLoading(false);
		}
	};

	const getMealPlanForWeek = async (
		weekId: string,
	): Promise<MealPlanItem[]> => {
		try {
			console.log("📖 Loading meal plan for week:", weekId);

			const { data, error } = await supabase.rpc(
				"get_week_meal_plan_with_recipes",
				{
					p_week_id: weekId,
					p_user_id: session?.user?.id,
				},
			);

			if (error) {
				throw new Error(error.message);
			}

			if (!data || data.length === 0) {
				console.log("📖 No saved meal plan found for week:", weekId);
				return [];
			}

			console.log("📖 Loaded meal plan:", {
				weekId,
				mealCount: data.length,
				meals: data.map(item => ({
					recipeName: item.recipe_name,
					servings: item.servings,
					status: item.status
				}))
			});

			const mealPlanItems: MealPlanItem[] = data.map((item) => {
				const fullRecipe = recipes.find((r) => r.id === item.recipe_id);

				const recipe: RecipeWithTags = fullRecipe || {
					id: item.recipe_id,
					name: item.recipe_name,
					image_url: item.recipe_image_url,
					total_time: item.recipe_total_time,
					tagIds: [],
					description: "",
					prep_time: 0,
					cook_time: 0,
					default_servings: 1,
					created_at: "",
				};

				return {
					id: `saved_${item.id}`,
					recipe: recipe,
					servings: item.servings,
					status: item.status as "draft" | "confirmed" | "completed",
					week_id: item.week_id,
					user_id: item.user_id,
					created_at: item.created_at,
					updated_at: item.updated_at,
				};
			});

			return mealPlanItems;
		} catch (error) {
			console.error("❌ Error fetching meal plan:", error);
			return [];
		}
	};

	const loadMealPlanForWeek = async (weekId: string) => {
		try {
			console.log("🔄 Loading meal plan for week:", weekId);
			const savedMeals = await getMealPlanForWeek(weekId);
			if (savedMeals.length > 0) {
				console.log("✅ Loaded existing meal plan, setting as current");
				setCurrentMealPlan(savedMeals);
			} else {
				console.log("🎲 No saved meal plan, generating initial plan");
				// Generate initial plan if no saved plan exists
				await generateInitialMealPlan();
			}
		} catch (error) {
			console.error("❌ Error loading meal plan for week:", error);
			console.log("🎲 Falling back to generating initial plan");
			await generateInitialMealPlan();
		}
	};

	// Public methods
	const refreshTags = async () => {
		await fetchTags();
	};

	const refreshIngredients = async () => {
		await fetchIngredients();
	};

	const refreshEquipment = async () => {
		await fetchEquipment();
	};

	const refreshUnits = async () => {
		await fetchUnits();
	};

	const refreshRecipes = async () => {
		await fetchRecipes();
	};

	const refreshWeeks = async () => {
		await fetchWeeks();
	};

	const refreshUserPreferences = async () => {
		await fetchUserPreferences();
	};

	const refreshFilteredRecipes = () => {
		console.log("🔄 Refreshing filtered recipes");
		filterRecipesByPreferences();
	};

	const getCurrentMealPlan = (limit?: number): MealPlanItem[] => {
		const plan = limit ? currentMealPlan.slice(0, limit) : currentMealPlan;
		console.log("📋 Getting current meal plan:", {
			totalMeals: currentMealPlan.length,
			requestedLimit: limit,
			returnedMeals: plan.length
		});
		return plan;
	};

	const getWeekById = (weekId: string): WeekWithComputed | undefined => {
		const week = weeks.find((w) => w.id === weekId);
		console.log("📅 Getting week by ID:", {
			weekId,
			found: !!week,
			weekTitle: week?.displayTitle
		});
		return week;
	};

	const getWeeksRange = (
		startOffset: number,
		endOffset: number,
	): WeekWithComputed[] => {
		const rangeWeeks = weeks.filter(
			(w) => w.weekOffset >= startOffset && w.weekOffset <= endOffset,
		);
		console.log("📅 Getting weeks range:", {
			startOffset,
			endOffset,
			totalWeeks: weeks.length,
			rangeWeeks: rangeWeeks.length,
			weekTitles: rangeWeeks.map(w => w.displayTitle)
		});
		return rangeWeeks;
	};

	const getUpcomingWeeks = (count: number): WeekWithComputed[] => {
		const upcoming = weeks
			.filter((w) => w.status === "current" || w.status === "future")
			.slice(0, count);
		console.log("📅 Getting upcoming weeks:", {
			requestedCount: count,
			foundCount: upcoming.length,
			weekTitles: upcoming.map(w => w.displayTitle)
		});
		return upcoming;
	};

	const refreshAll = async () => {
		try {
			setLoading(true);
			setError(null);

			console.log("🔄 Starting full data refresh...");

			await Promise.all([
				fetchTags(),
				fetchIngredients(),
				fetchEquipment(),
				fetchUnits(),
				fetchRecipes(),
				fetchWeeks(),
				fetchUserPreferences(),
			]);

			console.log("✅ Full data refresh complete");
		} catch (error) {
			console.error("❌ Error refreshing all data:", error);
			setError(error instanceof Error ? error : new Error(String(error)));
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		if (session?.user?.id) {
			console.log("🔑 User session detected, starting data refresh");
			refreshAll();
		}
	}, [session?.user?.id]);

	useEffect(() => {
		if (recipes.length && userPreferences.id) {
			console.log("🔄 Recipes or preferences changed, filtering recipes");
			filterRecipesByPreferences();
		}
	}, [recipes, userPreferences]);

	useEffect(() => {
		if (filteredRecipes.length && userPreferences.id) {
			console.log("🔄 Filtered recipes changed, generating new meal plan");
			generateInitialMealPlan();
		}
	}, [filteredRecipes, userPreferences]);

	return (
		<AppDataContext.Provider
			value={{
				tags,
				ingredients,
				equipment,
				units,
				recipes,
				filteredRecipes,
				currentMealPlan,
				weeks,
				currentWeek,
				userPreferences,
				loading,
				error,
				refreshTags,
				refreshIngredients,
				refreshEquipment,
				refreshUnits,
				refreshRecipes,
				refreshUserPreferences,
				refreshWeeks,
				refreshAll,
				getCurrentMealPlan,
				generateInitialMealPlan,
				updateMealServings,
				addMealToPlan,
				removeMealFromPlan,
				getAvailableRecipes,
				refreshFilteredRecipes,
				getWeekById,
				getWeeksRange,
				getUpcomingWeeks,
				saveMealPlanForWeek,
				getMealPlanForWeek,
				loadMealPlanForWeek,
				updateMealPlanStatus,
			}}
		>
			{children}
		</AppDataContext.Provider>
	);
}