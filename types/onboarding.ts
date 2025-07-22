export interface FormData {
    name: string;
    country: string;
    city: string;
    postcode: number;
    mealsPerWeek: number;
    servesPerMeal: number;
    mealTypes: string[];
    goalId: string | null;
    userPreferenceTags: string[];
}