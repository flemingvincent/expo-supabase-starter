export interface FormData {
    name: string;
    country: string;
    city: string;
    postcode: number;
    mealsPerWeek: number;
    servesPerMeal: number;
    goalId: string | null;
    user_preference_tags: string[];
}