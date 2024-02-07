import React from "react";
import { Text } from "react-native";

import { cn } from "@/lib/utils";

const Label = React.forwardRef<
	React.ElementRef<typeof Text>,
	React.ComponentPropsWithoutRef<typeof Text>
>(({ className, onPress, ...props }, ref) => (
	<Text
		ref={ref}
		className={cn("text-sm text-primary font-medium leading-none", className)}
		{...props}
	/>
));

Label.displayName = "Label";

export { Label };
