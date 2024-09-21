import * as React from "react";
import {
	Controller,
	ControllerProps,
	FieldPath,
	FieldValues,
	FormProvider,
	Noop,
	useFormContext,
} from "react-hook-form";
import { View } from "react-native";
import Animated, { FadeInDown, FadeOut } from "react-native-reanimated";

import { Input } from "./input";
import { Label } from "./label";
import { Text } from "./text";

import { cn } from "@/lib/utils";

const Form = FormProvider;

type FormFieldContextValue<
	TFieldValues extends FieldValues = FieldValues,
	TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> = {
	name: TName;
};

const FormFieldContext = React.createContext<FormFieldContextValue>(
	{} as FormFieldContextValue,
);

const FormField = <
	TFieldValues extends FieldValues = FieldValues,
	TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
	...props
}: ControllerProps<TFieldValues, TName>) => {
	return (
		<FormFieldContext.Provider value={{ name: props.name }}>
			<Controller {...props} />
		</FormFieldContext.Provider>
	);
};

const useFormField = () => {
	const fieldContext = React.useContext(FormFieldContext);
	const itemContext = React.useContext(FormItemContext);
	const { getFieldState, formState, handleSubmit } = useFormContext();

	const fieldState = getFieldState(fieldContext.name, formState);

	if (!fieldContext) {
		throw new Error("useFormField should be used within <FormField>");
	}

	const { nativeID } = itemContext;

	return {
		nativeID,
		name: fieldContext.name,
		formItemNativeID: `${nativeID}-form-item`,
		formDescriptionNativeID: `${nativeID}-form-item-description`,
		formMessageNativeID: `${nativeID}-form-item-message`,
		handleSubmit,
		...fieldState,
	};
};

type FormItemContextValue = {
	nativeID: string;
};

const FormItemContext = React.createContext<FormItemContextValue>(
	{} as FormItemContextValue,
);

const FormItem = React.forwardRef<
	React.ElementRef<typeof View>,
	React.ComponentPropsWithoutRef<typeof View>
>(({ className, ...props }, ref) => {
	const nativeID = React.useId();

	return (
		<FormItemContext.Provider value={{ nativeID }}>
			<View ref={ref} className={cn("space-y-2", className)} {...props} />
		</FormItemContext.Provider>
	);
});
FormItem.displayName = "FormItem";

const FormLabel = React.forwardRef<
	React.ElementRef<typeof Label>,
	Omit<React.ComponentPropsWithoutRef<typeof Label>, "children"> & {
		children: string;
	}
>(({ className, nativeID: _nativeID, ...props }, ref) => {
	const { error, formItemNativeID } = useFormField();

	return (
		<Label
			ref={ref}
			className={cn(
				"pb-1 native:pb-2 px-px",
				error && "text-destructive",
				className,
			)}
			nativeID={formItemNativeID}
			{...props}
		/>
	);
});
FormLabel.displayName = "FormLabel";

const FormDescription = React.forwardRef<
	React.ElementRef<typeof Text>,
	React.ComponentPropsWithoutRef<typeof Text>
>(({ className, ...props }, ref) => {
	const { formDescriptionNativeID } = useFormField();

	return (
		<Text
			ref={ref}
			nativeID={formDescriptionNativeID}
			className={cn("text-sm text-muted-foreground pt-1", className)}
			{...props}
		/>
	);
});
FormDescription.displayName = "FormDescription";

const FormMessage = React.forwardRef<
	React.ElementRef<typeof Animated.Text>,
	React.ComponentPropsWithoutRef<typeof Animated.Text>
>(({ className, children, ...props }, ref) => {
	const { error, formMessageNativeID } = useFormField();
	const body = error ? String(error?.message) : children;

	if (!body) {
		return null;
	}

	return (
		<Animated.Text
			entering={FadeInDown}
			exiting={FadeOut.duration(275)}
			ref={ref}
			nativeID={formMessageNativeID}
			className={cn("text-sm font-medium text-destructive", className)}
			{...props}
		>
			{body}
		</Animated.Text>
	);
});
FormMessage.displayName = "FormMessage";

type Override<T, U> = Omit<T, keyof U> & U;

interface FormFieldFieldProps<T> {
	name: string;
	onBlur: Noop;
	onChange: (val: T) => void;
	value: T;
	disabled?: boolean;
}

type FormItemProps<T extends React.ElementType<any>, U> = Override<
	React.ComponentPropsWithoutRef<T>,
	FormFieldFieldProps<U>
> & {
	label?: string;
	description?: string;
};

const FormInput = React.forwardRef<
	React.ElementRef<typeof Input>,
	FormItemProps<typeof Input, string>
>(({ label, description, onChange, ...props }, ref) => {
	const inputRef = React.useRef<React.ComponentRef<typeof Input>>(null);
	const {
		error,
		formItemNativeID,
		formDescriptionNativeID,
		formMessageNativeID,
	} = useFormField();

	React.useImperativeHandle(ref, () => {
		if (!inputRef.current) {
			return {} as React.ComponentRef<typeof Input>;
		}
		return inputRef.current;
	}, [inputRef.current]);

	function handleOnLabelPress() {
		if (!inputRef.current) {
			return;
		}
		if (inputRef.current.isFocused()) {
			inputRef.current?.blur();
		} else {
			inputRef.current?.focus();
		}
	}

	return (
		<FormItem>
			{!!label && (
				<FormLabel nativeID={formItemNativeID} onPress={handleOnLabelPress}>
					{label}
				</FormLabel>
			)}

			<Input
				ref={inputRef}
				aria-labelledby={formItemNativeID}
				aria-describedby={
					!error
						? `${formDescriptionNativeID}`
						: `${formDescriptionNativeID} ${formMessageNativeID}`
				}
				aria-invalid={!!error}
				onChangeText={onChange}
				{...props}
			/>
			{!!description && <FormDescription>{description}</FormDescription>}
			<FormMessage />
		</FormItem>
	);
});

FormInput.displayName = "FormInput";

export {
	Form,
	FormDescription,
	FormField,
	FormInput,
	FormItem,
	FormLabel,
	FormMessage,
	useFormField,
};
