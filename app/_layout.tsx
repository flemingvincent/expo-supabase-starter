import "../global.css";

import { Slot } from "expo-router";
import { View } from "react-native";

import { SupabaseProvider, useSupabase } from "@/context/supabase-provider";

function RootLayoutNav() {
	const { onLayoutRootView } = useSupabase();

	return (
		<View style={{ flex: 1 }} onLayout={onLayoutRootView}>
			<Slot />
		</View>
	);
}

export default function AppLayout() {
	return (
		<SupabaseProvider>
			<RootLayoutNav />
		</SupabaseProvider>
	);
}
