import {
	createContext,
	PropsWithChildren,
	useContext,
	useEffect,
	useState,
} from "react";
import { supabase } from "@/config/supabase";
import { useAuth } from "./supabase-provider";
import { Tag, Ingredient, Equipment, Unit, UserPreferences, MealPlanItem } from "@/types/state";
import { RecipeWithTags } from "@/types/recipe";
import { WeekWithComputed } from "@/types/week";

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
	userPreferences: UserPreferences;
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
	saveMealPlanForWeek: (weekId: string, meals: MealPlanItem[]) => Promise<void>;
	getMealPlanForWeek: (weekId: string) => Promise<MealPlanItem[]>;
	loadMealPlanForWeek: (weekId: string) => Promise<void>;
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
	const [userPreferences, setUserPreferences] = useState<UserPreferences>({
		id: "",
		user_id: "",
		meals_per_week: 1,
		serves_per_meal: 1,
		user_preference_tags: [],
		created_at: "",
	});
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<Error | null>(null);
	const { session } = useAuth();

	// Generate a unique ID for meal plan items
	const generateMealId = () => `meal_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

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

			const { data: recipesData, error } = await supabase
				.from("recipe")
				.select(`
					*,
					recipe_tags(
						tag_id
					)
				`)
				.order("created_at", { ascending: false });

			if (error) {
				throw new Error(error.message);
			}

			// Transform the data to extract just the tag_ids
			const recipesWithTags: RecipeWithTags[] = recipesData?.map((recipe) => ({
				...recipe,
				tagIds: recipe.recipe_tags?.map((rt: any) => rt.tag_id).filter(Boolean) || [],
			})) || [];

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
			const todayStr = today.toISOString().split('T')[0];

			// Fetch weeks around current date (e.g., 4 weeks back, 8 weeks forward)
			const { data, error } = await supabase
				.from("weeks")
				.select("*")
				.gte("end_date", new Date(today.getTime() - 28 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]) // 4 weeks ago
				.lte("start_date", new Date(today.getTime() + 56 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]) // 8 weeks ahead
				.order("start_date", { ascending: true });

			if (error) {
				throw new Error(error.message);
			}

			const processedWeeks: WeekWithComputed[] = (data || []).map(week => {
				const currentWeekData = data?.find(w => w.is_current_week);
				let weekOffset = 0;
				
				if (currentWeekData) {
					const currentStart = new Date(currentWeekData.start_date);
					const thisStart = new Date(week.start_date);
					weekOffset = Math.round((thisStart.getTime() - currentStart.getTime()) / (7 * 24 * 60 * 60 * 1000));
				}

				let displayTitle = week.display_title || '';
				if (!displayTitle) {
					if (week.is_current_week) {
						displayTitle = 'This week';
					} else if (weekOffset === 1) {
						displayTitle = 'Next week';
					} else if (weekOffset === -1) {
						displayTitle = 'Last week';
					} else if (weekOffset > 1) {
						displayTitle = `In ${weekOffset} weeks`;
					} else if (weekOffset < -1) {
						displayTitle = `${Math.abs(weekOffset)} weeks ago`;
					}
				}

				// Determine status
				let status: 'past' | 'current' | 'future' = 'future';
				if (week.is_current_week) {
					status = 'current';
				} else if (new Date(week.end_date) < today) {
					status = 'past';
				}

				return {
					...week,
					displayTitle,
					weekOffset,
					status
				};
			});

			setWeeks(processedWeeks);
			
			const current = processedWeeks.find(w => w.is_current_week);
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
				.eq("user_id", session?.user?.id)
				.single();

			if (prefError) {
				if (prefError.code === 'PGRST116') {
					setUserPreferences({
						id: "",
						user_id: session?.user?.id || "",
						meals_per_week: 1,
						serves_per_meal: 1,
						user_preference_tags: [],
					});
					return;
				}
				throw new Error(prefError.message);
			}

			if (prefData) {
                const { data: tagData, error: tagError } = await supabase
                    .from("user_preference_tags")
                    .select("tag_id, priority")
                    .eq("user_preference_id", prefData.id);

				if (tagError) {
					throw new Error(tagError.message);
				}

				// Combine the data
				const updatedPreferences = {
					...prefData,
					user_preference_tags: tagData
				};

				setUserPreferences(updatedPreferences);
				filterRecipesByPreferences(recipes);
			} else {
				setUserPreferences({
					id: "",
					user_id: session?.user?.id || "",
					meals_per_week: 1,
					serves_per_meal: 1,
					user_preference_tags: [],
				});
			}
		} catch (error) {
			console.error("Error fetching user preferences:", error);
			setError(error instanceof Error ? error : new Error(String(error)));
		} finally {
			setLoading(false);
		}
	};

	const filterRecipesByPreferences = (recipesToFilter: RecipeWithTags[] = recipes) => {
		if (!userPreferences.user_preference_tags?.length) {
			setFilteredRecipes(recipesToFilter);
			return;
		}

		const filtered = recipesToFilter.filter(recipe => {
			const hasMatchingTags = recipe.tagIds?.some(tagId => 
				userPreferences.user_preference_tags?.find(tag => tag.tag_id === tagId)
			);
			return hasMatchingTags;
		});

		setFilteredRecipes(filtered);
	};

	const generateInitialMealPlan = async (recipesToUse: RecipeWithTags[] = filteredRecipes) => {
		if (!recipesToUse.length) {
			setCurrentMealPlan([]);
			return;
		}

		let scoredRecipes = recipesToUse;
		
		if (userPreferences.user_preference_tags?.length) {
			scoredRecipes = recipesToUse.map(recipe => {
				const matchingTags = recipe.tagIds?.filter(tagId => 
					userPreferences.user_preference_tags?.find(tag => tag.tag_id === tagId)
				) ?? [];
				
				const score = matchingTags.length;
				
				return {
					...recipe,
					score,
					matchingTags
				};
			});

			scoredRecipes = scoredRecipes.sort((a, b) => {
				const scoreA = a.score ?? 0;
				const scoreB = b.score ?? 0;
				if (scoreA === scoreB) {
					return Math.random() - 0.5;
				}
				return scoreB - scoreA;
			});
		} else {
			scoredRecipes = [...recipesToUse].sort(() => 0.5 - Math.random());
		}

		const selectedRecipes = scoredRecipes.slice(0, userPreferences.meals_per_week ?? 4);

		const mealPlanItems: MealPlanItem[] = selectedRecipes.map(recipe => ({
			id: generateMealId(),
			recipe,
			servings: userPreferences.serves_per_meal || recipe.default_servings || 1,
		}));

		setCurrentMealPlan(mealPlanItems);
	};

	const updateMealServings = (mealId: string, servings: number) => {
		setCurrentMealPlan(prev => 
			prev.map(meal => 
				meal.id === mealId 
					? { ...meal, servings }
					: meal
			)
		);
	};

	const addMealToPlan = (recipe: RecipeWithTags, servings?: number) => {
		const existingMeal = currentMealPlan.find(meal => meal.recipe.id === recipe.id);
		if (existingMeal) {
			return;
		}

		const newMeal: MealPlanItem = {
			id: generateMealId(),
			recipe,
			servings: servings || userPreferences.serves_per_meal || recipe.default_servings || 1,
		};

		setCurrentMealPlan(prev => [...prev, newMeal]);
	};

	const removeMealFromPlan = (mealId: string) => {
		setCurrentMealPlan(prev => prev.filter(meal => meal.id !== mealId));
	};

	const getAvailableRecipes = (): RecipeWithTags[] => {
		return filteredRecipes.filter(recipe => 
			!currentMealPlan.some(meal => meal.recipe.id === recipe.id)
		);
	};

	const saveMealPlanForWeek = async (weekId: string, meals: MealPlanItem[]) => {
		try {
			setLoading(true);
			setError(null);

			await supabase
				.from("user_meal_plans")
				.delete()
				.eq("user_id", session?.user?.id)
				.eq("week_id", weekId);

			const mealPlanData = meals.map(meal => ({
				user_id: session?.user?.id,
				week_id: weekId,
				recipe_id: meal.recipe.id,
				servings: meal.servings,
			}));

			const { error } = await supabase
				.from("user_meal_plans")
				.insert(mealPlanData);

			if (error) {
				throw new Error(error.message);
			}

			console.log("Meal plan saved successfully for week:", weekId);
		} catch (error) {
			console.error("Error saving meal plan:", error);
			setError(error instanceof Error ? error : new Error(String(error)));
		} finally {
			setLoading(false);
		}
	};

	const getMealPlanForWeek = async (weekId: string): Promise<MealPlanItem[]> => {
		try {
			const { data, error } = await supabase
				.from("user_meal_plans")
				.select(`
					*,
					recipe:recipe_id (
						*,
						recipe_tags(tag_id)
					)
				`)
				.eq("user_id", session?.user?.id)
				.eq("week_id", weekId);

			if (error) {
				throw new Error(error.message);
			}

			const mealPlanItems: MealPlanItem[] = (data || []).map(item => ({
				id: `saved_${item.id}`,
				recipe: {
					...item.recipe,
					tagIds: item.recipe.recipe_tags?.map((rt: any) => rt.tag_id) || [],
				},
				servings: item.servings,
				week_id: item.week_id,
				user_id: item.user_id,
				created_at: item.created_at,
			}));

			return mealPlanItems;
		} catch (error) {
			console.error("Error fetching meal plan:", error);
			return [];
		}
	};

	const loadMealPlanForWeek = async (weekId: string) => {
		try {
			const savedMeals = await getMealPlanForWeek(weekId);
			if (savedMeals.length > 0) {
				setCurrentMealPlan(savedMeals);
			} else {
				generateInitialMealPlan();
			}
		} catch (error) {
			console.error("Error loading meal plan for week:", error);
			generateInitialMealPlan();
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
		filterRecipesByPreferences();
	};

	const getCurrentMealPlan = (limit?: number): MealPlanItem[] => {
		if (limit) {
			return currentMealPlan.slice(0, limit);
		}
		return currentMealPlan;
	};

	const getWeekById = (weekId: string): WeekWithComputed | undefined => {
		return weeks.find(w => w.id === weekId);
	};

	const getWeeksRange = (startOffset: number, endOffset: number): WeekWithComputed[] => {
		return weeks.filter(w => w.weekOffset >= startOffset && w.weekOffset <= endOffset);
	};

	const getUpcomingWeeks = (count: number): WeekWithComputed[] => {
		return weeks
			.filter(w => w.status === 'current' || w.status === 'future')
			.slice(0, count);
	};

	const refreshAll = async () => {
		try {
			setLoading(true);
			setError(null);
			
			await Promise.all([
				fetchTags(),
				fetchIngredients(),
				fetchEquipment(),
				fetchUnits(),
				fetchRecipes(),
				fetchWeeks(),
				fetchUserPreferences(),
			]);
		} catch (error) {
			console.error("Error refreshing all data:", error);
			setError(error instanceof Error ? error : new Error(String(error)));
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		if (session?.user?.id) {
			refreshAll();
		}
	}, [session?.user?.id]);

	useEffect(() => {
		if (recipes.length && userPreferences.id) {
			filterRecipesByPreferences();
		}
	}, [recipes, userPreferences]);

	useEffect(() => {
		if (filteredRecipes.length && userPreferences.id) {
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
			}}
		>
			{children}
		</AppDataContext.Provider>
	);
}