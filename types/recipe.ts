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