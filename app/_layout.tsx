import { Slot } from "expo-router";
import { useDeviceContext } from "twrnc";

import { SafeAreaProvider } from "react-native-safe-area-context";
import tw from "@/lib/tailwind";
import { SupabaseProvider } from "@/context/SupabaseProvider";

export default function Root() {
	useDeviceContext(tw);
	return (
		<SupabaseProvider>
			<SafeAreaProvider>
				<Slot />
			</SafeAreaProvider>
		</SupabaseProvider>
	);
}
