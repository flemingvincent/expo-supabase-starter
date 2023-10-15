import { Text, TextProps } from "react-native";

import tw from "@/lib/tailwind";

export interface IFormDescriptionProps {
	children?: React.ReactNode;
	style?: TextProps["style"];
}

export const FormDescription = ({ children, style }: IFormDescriptionProps) => {
	return (
		<Text
			style={[
				tw`text-sm text-muted-foreground dark:text-dark-muted-foreground`,
				style,
			]}
		>
			{children}
		</Text>
	);
};
