import React from "react";
import { TextInput } from "react-native";

import { cn } from "@/lib/utils";

const Input = React.forwardRef<
	React.ElementRef<typeof TextInput>,
	React.ComponentPropsWithoutRef<typeof TextInput>
>(({ className, placeholderClassName, ...props }, ref) => {
	return (
		<TextInput
			ref={ref}
			className={cn(
				"flex h-10 w-full items-center rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground leading-[0px]",
				className,
			)}
			placeholderClassName={cn("text-muted-foreground", placeholderClassName)}
			{...props}
		/>
	);
});

Input.displayName = "Input";

export { Input };
