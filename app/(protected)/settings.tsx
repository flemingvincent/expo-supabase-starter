import { View } from "react-native";

import { Button, H1, Muted, P } from "@/components/ui";
import { useSupabase } from "@/context/supabase-provider";

export default function TabTwoScreen() {
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
				onPress={() => {
					signOut();
				}}
			>
				<P>Sign out</P>
			</Button>
		</View>
	);
}
