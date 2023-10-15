import { Text, TextProps } from "react-native";

import tw from "@/lib/tailwind";

export interface IFormMessageProps {
	children?: React.ReactNode;
	style?: TextProps["style"];
}

export const FormMessage = ({ children, style }: IFormMessageProps) => {
	return (
		<Text
			style={[
				tw`text-sm font-medium text-destructive dark:text-dark-destructive`,
				style,
			]}
		>
			{children}
		</Text>
	);
};
