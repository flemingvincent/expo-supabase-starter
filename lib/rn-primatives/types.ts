import { Text, ViewStyle } from "react-native";

type ComponentPropsWithAsChild<T extends React.ElementType<any>> =
	React.ComponentPropsWithoutRef<T> & { asChild?: boolean };

type TextRef = React.ElementRef<typeof Text>;

type SlottableTextProps = ComponentPropsWithAsChild<typeof Text>;

interface LabelRootProps {
	children: React.ReactNode;
	style?: ViewStyle;
}

interface LabelTextProps {
	/**
	 * Equivalent to `id` so that the same value can be passed as `aria-labelledby` to the input element.
	 */
	nativeID: string;
}

export type {
	ComponentPropsWithAsChild,
	TextRef,
	SlottableTextProps,
	LabelRootProps,
	LabelTextProps,
};
