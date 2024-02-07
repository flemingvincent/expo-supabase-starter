import { Text, View } from "react-native";

import { Button } from "@/components/ui";
import { useSupabase } from "@/hooks/useSupabase";

export default function TabTwoScreen() {
	const { signOut } = useSupabase();

	return (
		<View className="flex-1 items-center justify-center bg-background p-4 gap-y-4">
			<Text className="text-4xl text-foreground font-extrabold tracking-tight lg:text-5xl">
				Sign Out
			</Text>
			<Text className="text-sm text-muted-foreground text-center">
				Sign out and return to the welcome screen.
			</Text>
			<Button
				className="w-full"
				size="default"
				variant="default"
				onPress={() => {
					signOut();
				}}
			>
				Sign out
			</Button>
		</View>
	);
}
