import React, { useEffect, useRef, useState } from "react";
import { View, TextInput, TouchableOpacity } from "react-native";
import { cn } from "@/lib/utils";

interface OTPInputProps {
	length?: number;
	value: string;
	onChange: (value: string) => void;
	className?: string;
	autoFocus?: boolean;
}

export function OTPInput({
	length = 4,
	value,
	onChange,
	className,
	autoFocus = true,
}: OTPInputProps) {
	const [focusedIndex, setFocusedIndex] = useState(0);
	const inputRefs = useRef<(TextInput | null)[]>([]);

	useEffect(() => {
		if (autoFocus && inputRefs.current[0]) {
			inputRefs.current[0].focus();
		}
	}, [autoFocus]);

	const handleChange = (text: string, index: number) => {
		const newValue = value.split("");
		newValue[index] = text;
		const updatedValue = newValue.join("").slice(0, length);
		onChange(updatedValue);

		if (text && index < length - 1) {
			inputRefs.current[index + 1]?.focus();
			setFocusedIndex(index + 1);
		}
	};

	const handleKeyPress = (e: any, index: number) => {
		if (e.nativeEvent.key === "Backspace" && !value[index] && index > 0) {
			inputRefs.current[index - 1]?.focus();
			setFocusedIndex(index - 1);
			const newValue = value.split("");
			newValue[index - 1] = "";
			onChange(newValue.join(""));
		}
	};

	const handleFocus = (index: number) => {
		setFocusedIndex(index);
	};

	return (
		<View className={cn("flex-row justify-center gap-3", className)}>
			{Array.from({ length }, (_, index) => (
				<TextInput
					key={index}
					ref={(ref) => (inputRefs.current[index] = ref)}
					className={cn(
						"w-16 h-16 text-center text-2xl font-bold rounded-lg border-2",
						focusedIndex === index
							? "border-green-500 bg-green-50"
							: value[index]
								? "border-gray-400 bg-white"
								: "border-gray-300 bg-white",
					)}
					maxLength={1}
					keyboardType="number-pad"
					value={value[index] || ""}
					onChangeText={(text) => handleChange(text, index)}
					onKeyPress={(e) => handleKeyPress(e, index)}
					onFocus={() => handleFocus(index)}
					selectTextOnFocus
				/>
			))}
		</View>
	);
}
