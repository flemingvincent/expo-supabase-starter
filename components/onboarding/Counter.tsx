import React from "react";
import { View, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Text } from "@/components/ui/text";

interface CounterProps {
    value: number;
    onIncrement: () => void;
    onDecrement: () => void;
    label: string;
    min?: number;
    max?: number;
}

const Counter = ({
    value,
    onIncrement,
    onDecrement,
    label,
    min = 1,
    max = 20,
}: CounterProps) => {
    return (
        <View className="mb-8 flex-row items-center justify-between">
            <Text className="text-gray-900 text-xl font-montserrat-semibold flex-1">
                {label}:
            </Text>

            <View className="flex-row items-center border border-gray-300 rounded-full">
                <TouchableOpacity
                    onPress={onDecrement}
                    disabled={value <= min}
                    className={`h-10 w-10 rounded-l-full items-center justify-center ${
                        value <= min ? "bg-gray-200" : "bg-white"
                    }`}
                >
                    <Ionicons
                        name="remove"
                        size={20}
                        color={value <= min ? "#9CA3AF" : "#25551B"}
                    />
                </TouchableOpacity>

                <View className="h-10 min-w-12 px-2 bg-white border-l border-r border-gray-300 items-center justify-center">
                    <Text className="text-lg font-montserrat-semibold text-gray-800">
                        {value}
                    </Text>
                </View>

                <TouchableOpacity
                    onPress={onIncrement}
                    disabled={value >= max}
                    className={`h-10 w-10 rounded-r-full items-center justify-center ${
                        value >= max ? "bg-gray-200" : "bg-white"
                    }`}
                >
                    <Ionicons
                        name="add"
                        size={20}
                        color={value >= max ? "#9CA3AF" : "#25551B"}
                    />
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default Counter;