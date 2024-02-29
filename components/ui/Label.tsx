import * as React from "react";

import { cn } from "../../lib/utils";

import * as LabelPrimitive from "@/lib/rn-primatives/label";

const Label = React.forwardRef<
	React.ElementRef<typeof LabelPrimitive.Text>,
	React.ComponentPropsWithoutRef<typeof LabelPrimitive.Text>
>(
	(
		{ className, onPress, onLongPress, onPressIn, onPressOut, ...props },
		ref,
	) => (
		<LabelPrimitive.Root
			className=""
			onPress={onPress}
			onLongPress={onLongPress}
			onPressIn={onPressIn}
			onPressOut={onPressOut}
		>
			<LabelPrimitive.Text
				ref={ref}
				className={cn(
					"text-sm text-foreground native:text-base font-medium leading-none",
					className,
				)}
				{...props}
			/>
		</LabelPrimitive.Root>
	),
);
Label.displayName = LabelPrimitive.Root.displayName;

export { Label };
