import {
	createContext,
	PropsWithChildren,
	useContext,
	useEffect,
	useState,
} from "react";
import { supabase } from "@/config/supabase";
import { useAuth } from "./supabase-provider";

export interface Tag {
	id: string;
	name: string;
	type: string;
	created_at?: string;
}

export interface UserPreferences {
    id: string;
    user_id: string;
    goal_tag_id: string;
    meals_per_week: number;
    serves_per_meal: number;
    user_preference_tags?: string[];
    created_at?: string;
}

interface AppDataState {
	tags: Tag[];
    userPreferences: UserPreferences;
    loading: boolean;
    error: Error | null;
	refreshTags: () => Promise<void>;
    refreshUserPreferences: () => Promise<void>;
}

const AppDataContext = createContext<AppDataState>({
	tags: [],
    userPreferences: {
        id: "",
        user_id: "",
        goal_tag_id: "",
        meals_per_week: 1,
        serves_per_meal: 1,
    },
    loading: false,
    error: null,
	refreshTags: async () => {},
    refreshUserPreferences: async () => {},
});

export const useAppData = () => useContext(AppDataContext);

export function AppDataProvider({ children }: PropsWithChildren) {
	const [tags, setTags] = useState<Tag[]>([]);
    const [userPreferences, setUserPreferences] = useState<UserPreferences>({
        id: "",
        user_id: "",
        goal_tag_id: "",
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

	const refreshTags = async () => {
		await fetchTags();
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
    }

	useEffect(() => {
		fetchTags();
        fetchUserPreferences();
	}, []);

	return (
		<AppDataContext.Provider
			value={{
				tags,
                userPreferences,
				loading,
				error,
				refreshTags,
                refreshUserPreferences,
			}}
		>
			{children}
		</AppDataContext.Provider>
	);
}
