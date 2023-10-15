import { Label } from "../Label";

import tw from "@/lib/tailwind";

export interface IFormLabelProps {
	children?: React.ReactNode;
	style?: React.ComponentProps<typeof Label>["style"];
	errors?: string | any;
}

export const FormLabel = ({ children, style, errors }: IFormLabelProps) => {
	return (
		<Label
			style={[errors && tw`text-destructive dark:text-dark-destructive`, style]}
		>
			{children}
		</Label>
	);
};
