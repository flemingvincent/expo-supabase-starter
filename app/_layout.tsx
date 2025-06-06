import "../global.css";
import { Stack } from "expo-router";

import { AuthProvider } from "@/context/supabase-provider";
import { AppDataProvider } from "@/context/app-data-provider";


export default function AppLayout() {

	return (
		<AuthProvider>
			<AppDataProvider>
				<Stack screenOptions={{ headerShown: false, gestureEnabled: false }}>
					<Stack.Screen name="(protected)" />
					<Stack.Screen name="welcome" />
					<Stack.Screen
						name="sign-up"
						options={{
							presentation: "card",
							headerShown: false,
							gestureEnabled: true,
						}}
					/>
					<Stack.Screen
						name="sign-in"
						options={{
							presentation: "card",
							headerShown: false,
							gestureEnabled: true,
						}}
					/>
				</Stack>
			</AppDataProvider>
		</AuthProvider>
	);
}
