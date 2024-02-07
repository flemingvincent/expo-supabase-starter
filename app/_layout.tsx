import "../global.css";
import { Stack, SplashScreen } from "expo-router";
import { useEffect } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { SupabaseProvider } from "@/context/SupabaseProvider";

export {
	// Catch any errors thrown by the Layout component.
	ErrorBoundary,
} from "expo-router";

export const unstable_settings = {
	initialRouteName: "(auth)",
};

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
	useEffect(() => {
		// HACK: Hide splash screen after 1 second to hide initial routing animation.
		setTimeout(() => {
			SplashScreen.hideAsync();
		}, 1000);
	}, []);

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
					<Stack.Screen name="(auth)" />
					<Stack.Screen name="(app)" />
				</Stack>
			</SafeAreaProvider>
		</SupabaseProvider>
	);
}
