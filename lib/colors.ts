import { Tag } from "@/types/state";

export interface ColorScheme {
	text: string;
	background: string;
}

export const RECIPE_COLOR_SCHEMES: Record<string, ColorScheme> = {
	beef: {
		text: "#FF6525", // Orange
		background: "#FFE0D1",
	},
	chicken: {
		text: "#FFB524", // Yellow/Golden
		background: "#FFF2D6",
	},
	fish: {
		text: "#54CDC3", // Blue/Teal
		background: "#E8F9F7",
	},
	lamb: {
		text: "#F88675", // Pink/Coral
		background: "#FFE5E1",
	},
	pork: {
		text: "#FF6F61", // Salmon Pink
		background: "#FFE6E2",
	},
	vegan: {
		text: "#6B8E23", // Lime Green/Olive
		background: "#EBF3E7",
	},
	vegetarian: {
		text: "#7CB342", // Brighter Green
		background: "#E8F5E8",
	},
	// Default fallback
	default: {
		text: "#FF6F61", // Salmon Pink
		background: "#FFE6E2",
	},
};

/**
 * Get color scheme for a recipe based on its tags
 * @param tagIds - Array of tag IDs from the recipe
 * @param allTags - Array of all available tags from app state
 * @returns ColorScheme object with text and background colors
 */
export const getRecipeColorScheme = (
	tagIds: string[] | undefined,
	allTags: Tag[]
): ColorScheme => {
	// Return default if no tags
	if (!tagIds || tagIds.length === 0) {
		return RECIPE_COLOR_SCHEMES.default;
	}

	// Priority order for color selection (most specific to least specific)
	const colorPriority = [
		'vegan',
		'vegetarian', 
		'beef',
		'chicken',
		'fish',
		'lamb',
		'pork'
	];

	// Find the tags that match the recipe's tag IDs
	const recipeTags = tagIds
		.map(tagId => allTags.find(tag => tag.id === tagId))
		.filter(Boolean) as Tag[];

	// Get tag names in lowercase for matching
	const recipeTagNames = recipeTags.map(tag => tag.name.toLowerCase());

	// Find the highest priority color scheme that matches
	for (const colorKey of colorPriority) {
		if (recipeTagNames.includes(colorKey)) {
			return RECIPE_COLOR_SCHEMES[colorKey];
		}
	}

	// Fallback to default if no matching color scheme found
	return RECIPE_COLOR_SCHEMES.default;
};

/**
 * Get multiple color schemes for a list of recipes
 * Useful for creating diverse color schemes when displaying multiple recipes
 * @param recipes - Array of recipes with tagIds
 * @param allTags - Array of all available tags from app state
 * @returns Array of ColorScheme objects
 */
export const getRecipeColorSchemes = (
	recipes: Array<{ tagIds?: string[] }>,
	allTags: Tag[]
): ColorScheme[] => {
	return recipes.map(recipe => getRecipeColorScheme(recipe.tagIds, allTags));
};