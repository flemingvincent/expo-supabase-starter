import { Text, TextProps } from "react-native";

import tw from "@/lib/tailwind";

export interface ILabelProps extends React.ComponentProps<typeof Text> {
	children?: React.ReactNode;
	style?: TextProps["style"];
}

export const Label = ({ children, style }: ILabelProps) => {
	return (
		<Text
			style={[
				tw`text-sm text-primary dark:text-dark-primary font-medium leading-none`,
				style,
			]}
		>
			{children}
		</Text>
	);
};
