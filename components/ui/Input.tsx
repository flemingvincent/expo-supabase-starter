import { useState } from "react";
import { TextInput, View } from "react-native";
import { useAppColorScheme } from "twrnc";

import tw from "@/lib/tailwind";

export interface IInputProps extends React.ComponentProps<typeof TextInput> {
	error?: string | any;
	isFocused?: boolean;
}

export const Input = ({ error, onBlur, ...props }: IInputProps) => {
	const [colorScheme] = useAppColorScheme(tw);
	const [isFocused, setIsFocused] = useState(false);

	const handleBlur = (event: any) => {
		setIsFocused(false);
		onBlur && onBlur(event);
	};

	return (
		<View>
			<TextInput
				style={[
					tw`flex h-10 w-full items-center rounded-md text-foreground dark:text-dark-foreground border border-input dark:border-dark-input bg-transparent px-3 py-2 text-sm leading-[0px]`,
					isFocused && tw`border-primary dark:border-dark-primary`,
					error && tw`border-destructive dark:border-dark-destructive`,
				]}
				placeholderTextColor={
					colorScheme === "dark"
						? tw.color("dark-muted-foreground")
						: tw.color("muted-foreground")
				}
				onFocus={() => setIsFocused(true)}
				onBlur={handleBlur}
				{...props}
			/>
		</View>
	);
};
