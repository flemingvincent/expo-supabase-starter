import { View } from "react-native";
import { useAuth } from "@/context/supabase-provider";

import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { H1, Muted } from "@/components/ui/typography";
import { supabase } from "@/config/supabase";

export default function Home() {
	const { profile, profileLoading } = useAuth();

	if (profileLoading) {
		return (
			<View className="flex-1 items-center justify-center bg-background">
				<Text>Loading...</Text>
			</View>
		);
	}

	const testSupabaseConnection = async () => {
		console.log("=== Testing Supabase Connection ===");
		
		try {
		  // Test 1: Simple auth status check
		  console.log("Test 1: Checking auth status...");
		  const { data: session, error: sessionError } = await supabase.auth.getSession();
		  console.log("Auth session:", { session, error: sessionError });
		  
		  // Test 2: Test a simple table query
		  console.log("Test 2: Testing table query...");
		  const { data, error, status, statusText } = await supabase
			.from('profiles')
			.select('id')
			.limit(1);
		  
		  console.log("Query result:", { data, error, status, statusText });
		  
		  
		} catch (error) {
		  console.error("Connection test error:", error);
		}
	};

	return (
		<View className="flex-1 items-center justify-center bg-background p-4 gap-y-4">
			<H1 className="text-center">Home</H1>
			<Muted className="text-center">
				You are now authenticated and this session will persist even after
				closing the app.

				hot module xxxxww ww
			</Muted>

			<Button onPress={testSupabaseConnection}>
				<Text>Test Connection</Text>
			</Button>


			<Text className="text-xs text-muted-foreground">
				Onboarding: {profile?.onboarding_completed ? "Complete" : "Incomplete"}
			</Text>

			
		</View>
	);
}
