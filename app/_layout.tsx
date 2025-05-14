import "../global.css";
import { Stack } from "expo-router";

import { AuthProvider } from "@/context/supabase-provider";


export default function AppLayout() {

	return (
		<AuthProvider>
			<Stack screenOptions={{ headerShown: false, gestureEnabled: false }}>
				<Stack.Screen name="(protected)" />
				<Stack.Screen name="welcome" />
				<Stack.Screen
					name="sign-up"
					options={{
						presentation: "fullScreenModal",
						headerShown: false,
						gestureEnabled: true,
					}}
				/>
				<Stack.Screen
					name="sign-in"
					options={{
						presentation: "fullScreenModal",
						headerShown: false,
						gestureEnabled: true,
					}}
				/>
			</Stack>
		</AuthProvider>
	);
}
