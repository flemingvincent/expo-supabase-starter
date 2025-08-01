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

interface AppDataState {
	tags: Tag[];
	ingredients: Ingredient[];
	equipment: Equipment[];
	units: Unit[];
    userPreferences: UserPreferences;
    loading: boolean;
    error: Error | null;
	refreshTags: () => Promise<void>;
	refreshIngredients: () => Promise<void>;
	refreshEquipment: () => Promise<void>;
	refreshUnits: () => Promise<void>;
    refreshUserPreferences: () => Promise<void>;
	refreshAll: () => Promise<void>;
}

const AppDataContext = createContext<AppDataState>({
	tags: [],
	ingredients: [],
	equipment: [],
	units: [],
    userPreferences: {
        id: "",
        user_id: "",
        goal_tag_id: "",
        meals_per_week: 1,
        serves_per_meal: 1,
        meal_types: [],
    },
    loading: false,
    error: null,
	refreshTags: async () => {},
	refreshIngredients: async () => {},
	refreshEquipment: async () => {},
	refreshUnits: async () => {},
    refreshUserPreferences: async () => {},
	refreshAll: async () => {},
});

export const useAppData = () => useContext(AppDataContext);

export function AppDataProvider({ children }: PropsWithChildren) {
	const [tags, setTags] = useState<Tag[]>([]);
	const [ingredients, setIngredients] = useState<Ingredient[]>([]);
	const [equipment, setEquipment] = useState<Equipment[]>([]);
	const [units, setUnits] = useState<Unit[]>([]);
    const [userPreferences, setUserPreferences] = useState<UserPreferences>({
        id: "",
        user_id: "",
        goal_tag_id: "",
        meals_per_week: 1,
        serves_per_meal: 1,
        user_preference_tags: [],
        meal_types: [],
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
                        goal_tag_id: "",
                        meals_per_week: 1,
                        serves_per_meal: 1,
                        user_preference_tags: [],
                        meal_types: [],
                    });
                    return;
                }
                throw new Error(prefError.message);
            }
    
            if (prefData) {
                // Then get associated tags from the junction table
                const { data: tagData, error: tagError } = await supabase
                    .from("user_preference_tags")
                    .select("tag_id")
                    .eq("user_preference_id", prefData.id);
    
                if (tagError) {
                    throw new Error(tagError.message);
                }
    
                // Extract tag_ids into a simple array
                const tagIds = tagData?.map(item => item.tag_id) || [];
    
                // Combine the data
                setUserPreferences({
                    ...prefData,
                    user_preference_tags: tagIds
                });
            } else {
                // Default empty preferences
                setUserPreferences({
                    id: "",
                    user_id: session?.user?.id || "",
                    goal_tag_id: "",
                    meals_per_week: 1,
                    serves_per_meal: 1,
                    user_preference_tags: [],
                    meal_types: [],
                });
            }
        } catch (error) {
            console.error("Error fetching user preferences:", error);
            setError(error instanceof Error ? error : new Error(String(error)));
        } finally {
            setLoading(false);
        }
    };

    const refreshUserPreferences = async () => {
        await fetchUserPreferences();
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
		refreshAll();
	}, []);

	return (
		<AppDataContext.Provider
			value={{
				tags,
				ingredients,
				equipment,
				units,
                userPreferences,
				loading,
				error,
				refreshTags,
				refreshIngredients,
				refreshEquipment,
				refreshUnits,
                refreshUserPreferences,
				refreshAll,
			}}
		>
			{children}
		</AppDataContext.Provider>
	);
}