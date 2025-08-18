import {
	createContext,
	PropsWithChildren,
	useContext,
	useEffect,
	useState,
} from "react";
import { supabase } from "@/config/supabase";
import { useAuth } from "./supabase-provider";
import { Tag, Ingredient, Equipment, Unit, UserPreferences } from "@/types/state";
import { RecipeWithTags } from "@/types/recipe";
import { WeekWithComputed } from "@/types/week";

interface AppDataState {
	tags: Tag[];
	ingredients: Ingredient[];
	equipment: Equipment[];
	units: Unit[];
	recipes: RecipeWithTags[];
	recommendedMeals: RecipeWithTags[];
	weeks: WeekWithComputed[]; // Add weeks
	currentWeek: WeekWithComputed | null; // Quick access to current week
	userPreferences: UserPreferences;
	loading: boolean;
	error: Error | null;
	refreshTags: () => Promise<void>;
	refreshIngredients: () => Promise<void>;
	refreshEquipment: () => Promise<void>;
	refreshUnits: () => Promise<void>;
	refreshRecipes: () => Promise<void>;
	refreshUserPreferences: () => Promise<void>;
	refreshWeeks: () => Promise<void>; // Add weeks refresh
	refreshAll: () => Promise<void>;
	// Helper methods for meal recommendations
	getRecommendedMeals: (limit?: number) => RecipeWithTags[];
	refreshRecommendations: () => Promise<void>;
	// Helper methods for weeks
	getWeekById: (weekId: string) => WeekWithComputed | undefined;
	getWeeksRange: (startOffset: number, endOffset: number) => WeekWithComputed[];
	getUpcomingWeeks: (count: number) => WeekWithComputed[];
}

const AppDataContext = createContext<AppDataState>({
	tags: [],
	ingredients: [],
	equipment: [],
	units: [],
	recipes: [],
	recommendedMeals: [],
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
	getRecommendedMeals: () => [],
	refreshRecommendations: async () => {},
	getWeekById: () => undefined,
	getWeeksRange: () => [],
	getUpcomingWeeks: () => [],
});

export const useAppData = () => useContext(AppDataContext);

export function AppDataProvider({ children }: PropsWithChildren) {
	const [tags, setTags] = useState<Tag[]>([]);
	const [ingredients, setIngredients] = useState<Ingredient[]>([]);
	const [equipment, setEquipment] = useState<Equipment[]>([]);
	const [units, setUnits] = useState<Unit[]>([]);
	const [recipes, setRecipes] = useState<RecipeWithTags[]>([]);
	const [recommendedMeals, setRecommendedMeals] = useState<RecipeWithTags[]>([]);
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

			// Fetch all recipes with their associated tag_ids from the junction table
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
			
			// Auto-refresh recommendations when recipes change
			generateRecommendations(recipesWithTags);

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

			// Process weeks to add computed properties
			const processedWeeks: WeekWithComputed[] = (data || []).map(week => {
				// Calculate week offset from current week
				const currentWeekData = data?.find(w => w.is_current_week);
				let weekOffset = 0;
				
				if (currentWeekData) {
					const currentStart = new Date(currentWeekData.start_date);
					const thisStart = new Date(week.start_date);
					weekOffset = Math.round((thisStart.getTime() - currentStart.getTime()) / (7 * 24 * 60 * 60 * 1000));
				}

				// Determine display title
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
			
			// Set current week for quick access
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

			// First get the user's preferences
			const { data: prefData, error: prefError } = await supabase
				.from("user_preferences")
				.select("*")
				.eq("user_id", session?.user?.id)
				.single();

			if (prefError) {
				// If no preferences exist yet, this is not an error for a new user
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
				// Then get associated tags from the junction table
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
				
				// Refresh recommendations when preferences change
				generateRecommendations(recipes);
			} else {
				// Default empty preferences
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

	// Generate meal recommendations based on user preferences and available recipes
	const generateRecommendations = (recipesToFilter: RecipeWithTags[] = recipes) => {
		if (!recipesToFilter.length || !userPreferences.user_preference_tags?.length) {
			// If no preferences set, just return a random selection
			const shuffled = [...recipesToFilter].sort(() => 0.5 - Math.random());
			setRecommendedMeals(shuffled.slice(0, Math.max(userPreferences.meals_per_week || 3, 20)));
			return;
		}

		// Score recipes based on tag matches
		const scoredRecipes = recipesToFilter.map(recipe => {
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

		// Sort by score (highest first) and add some randomness for variety
		const sortedRecipes = scoredRecipes
			.sort((a, b) => {
				if (a.score === b.score) {
					return Math.random() - 0.5; // Random for same score
				}
				return b.score - a.score;
			})
			.slice(0, userPreferences.meals_per_week ?? 4);

		setRecommendedMeals(sortedRecipes);
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

	const refreshRecommendations = async () => {
		generateRecommendations();
	};

	const getRecommendedMeals = (limit?: number): RecipeWithTags[] => {
		if (limit) {
			return recommendedMeals.slice(0, limit);
		}
		return recommendedMeals;
	};

	// Week helper methods
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

	// Convenience method to refresh all reference data at once
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
				fetchWeeks(), // Include weeks in the full refresh
				fetchUserPreferences(),
			]);
		} catch (error) {
			console.error("Error refreshing all data:", error);
			setError(error instanceof Error ? error : new Error(String(error)));
		} finally {
			setLoading(false);
		}
	};

	// Initialize data when session is available
	useEffect(() => {
		if (session?.user?.id) {
			refreshAll();
		}
	}, [session?.user?.id]);

	// Regenerate recommendations when user preferences or recipes change
	useEffect(() => {
		if (recipes.length && userPreferences.id) {
			generateRecommendations();
		}
	}, [recipes, userPreferences]);

	return (
		<AppDataContext.Provider
			value={{
				tags,
				ingredients,
				equipment,
				units,
				recipes,
				recommendedMeals,
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
				getRecommendedMeals,
				refreshRecommendations,
				getWeekById,
				getWeeksRange,
				getUpcomingWeeks,
			}}
		>
			{children}
		</AppDataContext.Provider>
	);
}