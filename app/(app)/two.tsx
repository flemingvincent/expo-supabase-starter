import { Text, View } from "react-native";

import { Button } from "@/components/ui";
import { useSupabase } from "@/hooks/useSupabase";
import tw from "@/lib/tailwind";

export default function TabTwoScreen() {
	const { signOut } = useSupabase();

	return (
		<View
			style={tw`flex-1 items-center justify-center bg-background dark:bg-dark-background p-4 gap-y-4`}
		>
			<Text style={tw`h1`}>Sign Out</Text>
			<Text style={tw`muted text-center`}>
				Sign out and return to the welcome screen.
			</Text>
			<Button
				style={tw`w-full`}
				label="Sign out"
				onPress={() => {
					signOut();
				}}
			/>
		</View>
	);
}
