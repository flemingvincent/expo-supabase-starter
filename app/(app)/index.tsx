import { View } from "react-native";

import { H1, Muted } from "@/components/ui";

export default function TabOneScreen() {
	return (
		<View className="flex-1 items-center justify-center bg-background p-4 gap-y-4">
			<H1 className="text-center">Home</H1>
			<Muted className="text-center">
				You are now authenticated and this session will persist even after
				closing the app.
			</Muted>
		</View>
	);
}
