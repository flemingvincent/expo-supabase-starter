import { Slot, useRouter, useSegments } from "expo-router";
import { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { useDeviceContext } from "twrnc";

import { SupabaseProvider } from "@/context/SupabaseProvider";
import { useSupabase } from "@/hooks/useSupabase";
import tw from "@/lib/tailwind";

const InitialLayout = () => {
	const { session, initialized } = useSupabase();
	const segments = useSegments();
	const router = useRouter();

	useEffect(() => {
		if (!initialized) return;

		// Check if the path/url is in the (auth) group
		const inAuthGroup = segments[0] === "(auth)";

		if (session && !inAuthGroup) {
			// Redirect authenticated users to the home page
			router.replace("/home");
		} else if (!session) {
			// Redirect unauthenticated users to the sign up page
			router.replace("/");
		}
	}, [session, initialized]);

	return <Slot />;
};

export default function Root() {
	useDeviceContext(tw);

	return (
		<SupabaseProvider>
			<GestureHandlerRootView style={tw`flex-1`}>
				<SafeAreaProvider>
					<InitialLayout />
				</SafeAreaProvider>
			</GestureHandlerRootView>
		</SupabaseProvider>
	);
}
