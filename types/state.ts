export interface Tag {
    id: string;
    name: string;
    type: string;
    created_at?: string;
}

export interface Ingredient {
    id: string;
    name: string;
    unit_id?: string;
    created_at?: string;
}

export interface Equipment {
    id: string;
    name: string;
    created_at?: string;
}

export interface Unit {
    id: string;
    name: string;
    abbreviation?: string;
    category?: string;
    to_base?: number;
    created_at?: string;
}

export interface UserPreferences {
    id: string;
    user_id: string;
    goal_tag_id: string;
    meals_per_week: number;
    serves_per_meal: number;
    meal_types: string[];
    user_preference_tags?: string[];
    created_at?: string;
}