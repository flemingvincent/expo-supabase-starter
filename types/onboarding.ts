import { UserPreferenceTag } from "./state";

export interface FormData {
    name: string;
    country: string;
    city: string;
    postcode: number;
    mealsPerWeek: number;
    servesPerMeal: number;
    userPreferenceTags: UserPreferenceTag[];
}