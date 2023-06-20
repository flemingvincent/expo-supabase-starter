import * as React from "react";
import { TextInput, Text, View } from "react-native";

import { useAppColorScheme } from "twrnc";

import tw from "@/lib/tailwind";

export interface IInputProps extends React.ComponentProps<typeof TextInput> {
	label?: string;
	text?: string;
	errors?: string | any;
	isFocused?: boolean;
}

export const Input = ({
	label,
	text,
	errors,
	onBlur,
	...props
}: IInputProps) => {
	const [colorScheme] = useAppColorScheme(tw);
	const [isFocused, setIsFocused] = React.useState(false);

	const handleBlur = (event: any) => {
		setIsFocused(false);
		onBlur && onBlur(event);
	};

	return (
		<View>
			{label && (
				<Text
					style={tw`small text-foreground dark:text-dark-foreground self-start mb-1.5`}
				>
					{label}
				</Text>
			)}
			<TextInput
				style={[
					tw`flex h-10 w-full items-center rounded-md text-foreground dark:text-dark-foreground border border-input dark:border-dark-input bg-transparent px-3 py-2 text-sm leading-[0px]`,
					isFocused && tw`border-primary dark:border-dark-primary`,
					errors && tw`border-destructive dark:border-dark-destructive`,
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
			{text && <Text style={tw`muted self-start mt-1.5`}>{text}</Text>}
			{errors && (
				<Text
					style={tw`text-sm text-destructive dark:text-dark-destructive self-start mt-1.5`}
				>
					{errors}
				</Text>
			)}
		</View>
	);
};
