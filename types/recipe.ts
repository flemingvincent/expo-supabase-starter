export interface Recipe {
	id: string;
	name: string;
	description?: string;
	prep_time?: number;
	cook_time?: number;
	total_time?: number;
	default_servings?: number;
	created_at?: string;
	image_url?: string;
	difficulty?: string;
}

export interface Instruction {
    id: string;
    recipe_id: string;
    step_number: number;
    step_title?: string;
    instruction: string;
    image_url?: string;
}

export interface RecipeIngredient {
	id: string;
	recipe_id: string;
	ingredient_id: string;
	unit_id?: string;
	quantity_per_serving?: number;
}