import "../global.css";
import { Stack } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { SupabaseProvider } from "@/context/supabase-provider";

export {
	// Catch any errors thrown by the Layout component.
	ErrorBoundary,
} from "expo-router";

export default function RootLayout() {
	return <RootLayoutNav />;
}

function RootLayoutNav() {
	return (
		<SupabaseProvider>
			<SafeAreaProvider>
				<Stack
					screenOptions={{
						headerShown: false,
					}}
				>
					<Stack.Screen name="welcome" />
					<Stack.Screen name="sign-up" />
					<Stack.Screen name="sign-in" />
					<Stack.Screen name="(app)" />
				</Stack>
			</SafeAreaProvider>
		</SupabaseProvider>
	);
}
