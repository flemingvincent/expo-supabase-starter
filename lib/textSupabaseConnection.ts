import { supabase } from "@/config/supabase";

export const testSupabaseConnection = async () => {
	console.log("=== Testing Supabase Connection ===");

	try {
		// Test 1: Simple auth status check
		console.log("Test 1: Checking auth status...");
		const { data: session, error: sessionError } =
			await supabase.auth.getSession();
		console.log("Auth session:", { session, error: sessionError });

		// Test 2: Test a simple table query
		console.log("Test 2: Testing table query...");
		const { data, error, status, statusText } = await supabase
			.from("profiles")
			.select("id")
			.limit(1);

		console.log("Query result:", { data, error, status, statusText });
	} catch (error) {
		console.error("Connection test error:", error);
	}
};
