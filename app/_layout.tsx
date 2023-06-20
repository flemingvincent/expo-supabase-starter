import { Slot } from "expo-router";
import { useDeviceContext } from "twrnc";

import { SafeAreaProvider } from "react-native-safe-area-context";
import tw from "@/lib/tailwind";
import { SupabaseProvider } from "@/context/SupabaseProvider";
import { GestureHandlerRootView } from "react-native-gesture-handler";

export default function Root() {
	useDeviceContext(tw);
	return (
		<SupabaseProvider>
			<GestureHandlerRootView style={tw`flex-1`}>
				<SafeAreaProvider>
					<Slot />
				</SafeAreaProvider>
			</GestureHandlerRootView>
		</SupabaseProvider>
	);
}
