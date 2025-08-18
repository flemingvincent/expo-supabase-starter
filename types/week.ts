// types/week.ts
export interface Week {
	id: string;
	week_number: number;
	year: number;
	start_date: string;
	end_date: string;
	display_range: string;
	display_title: string;
	is_current_week: boolean;
	created_at: string;
	updated_at: string;
}

// For client-side use with additional computed properties
export interface WeekWithMeals extends Week {
	has_meals?: boolean;
	meal_count?: number;
	user_meal_ids?: string[]; // User's selected meals for this week
}

export interface WeekWithComputed extends Week {
    displayTitle: string;
    weekOffset: number;
    status: 'past' | 'current' | 'future';
}
