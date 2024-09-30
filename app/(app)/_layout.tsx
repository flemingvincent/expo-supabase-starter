import { Stack } from "expo-router";

export const unstable_settings = {
	initialRouteName: "(root)",
};

export default function AppLayout() {
	return (
		<Stack screenOptions={{ headerShown: false }}>
			<Stack.Screen name="(protected)" />
			<Stack.Screen name="welcome" />
			<Stack.Screen
				name="sign-up"
				options={{
					presentation: "modal",
					headerShown: true,
					headerTitle: "Sign Up",
				}}
			/>
			<Stack.Screen
				name="sign-in"
				options={{
					presentation: "modal",
					headerShown: true,
					headerTitle: "Sign In",
				}}
			/>
			<Stack.Screen
				name="modal"
				options={{
					presentation: "modal",
					headerShown: true,
					headerTitle: "Modal",
				}}
			/>
		</Stack>
	);
}
