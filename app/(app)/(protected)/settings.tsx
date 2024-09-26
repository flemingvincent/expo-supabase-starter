import { View } from "react-native";

import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { H1, Muted } from "@/components/ui/typography";
import { useSupabase } from "@/context/supabase-provider";

export default function Settings() {
	const { signOut } = useSupabase();

	return (
		<View className="flex-1 items-center justify-center bg-background p-4 gap-y-4">
			<H1 className="text-center">Sign Out</H1>
			<Muted className="text-center">
				Sign out and return to the welcome screen.
			</Muted>
			<Button
				className="w-full"
				size="default"
				variant="default"
				onPress={signOut}
			>
				<Text>Sign Out</Text>
			</Button>
		</View>
	);
}
