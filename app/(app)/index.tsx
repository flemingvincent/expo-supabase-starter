import { Text, View } from "react-native";

import tw from "@/lib/tailwind";

export default function TabOneScreen() {
	return (
		<View
			style={tw`flex-1 items-center justify-center bg-background dark:bg-dark-background p-4 gap-y-4`}
		>
			<Text style={tw`h1`}>Home</Text>
			<Text style={tw`muted text-center`}>
				You are now authenticated and this session will persist even after
				closing the app.
			</Text>
		</View>
	);
}
