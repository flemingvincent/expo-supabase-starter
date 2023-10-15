import { useCallback, forwardRef, useState, useImperativeHandle } from "react";
import { Text } from "react-native";
import { PanGestureHandler } from "react-native-gesture-handler";
import Animated, {
	useSharedValue,
	withDelay,
	withSequence,
	withTiming,
	runOnJS,
	useAnimatedStyle,
	useAnimatedGestureHandler,
	withSpring,
} from "react-native-reanimated";

import tw from "@/lib/tailwind";

export type AlertVariants = "default" | "destructive";

export interface IAlertProps {
	variant?: AlertVariants;
	title?: string;
	message?: string;
	duration?: number;
}

// eslint-disable-next-line no-empty-pattern
export const Alert = forwardRef(({}, ref) => {
	const translateY = useSharedValue<number>(-100);
	const [isShown, setIsShown] = useState<boolean>(false);
	const [variant, setVariant] = useState<AlertVariants>("default");
	const [title, setTitle] = useState<string>("");
	const [message, setMessage] = useState<string>("");
	const [duration, setDuration] = useState<number>(3000);

	const showAlert = useCallback(
		({ variant, title, message, duration }: IAlertProps) => {
			setVariant(variant ? variant : "default");
			setTitle(title ? title : "");
			setMessage(message ? message : "");
			setDuration(duration ? duration : 3000);
			setIsShown(true);
			translateY.value = withSequence(
				withTiming(60),
				withDelay(
					duration ? duration : 3000,
					withTiming(-100, undefined, (finish) => {
						if (finish) {
							runOnJS(setIsShown)(false);
						}
					}),
				),
			);
		},
		[translateY],
	);

	useImperativeHandle(
		ref,
		() => ({
			showAlert,
		}),
		[showAlert],
	);

	const animatedStyle = useAnimatedStyle(() => {
		return {
			top: translateY.value,
		};
	});

	const gestureHandler = useAnimatedGestureHandler({
		onStart: (_, ctx: any) => {
			ctx.startY = translateY.value;
		},
		onActive: (event, ctx) => {
			if (event.translationY < 100) {
				translateY.value = withSpring(ctx.startY + event.translationY, {
					damping: 600,
					stiffness: 100,
				});
			}
		},
		onEnd: (event) => {
			if (event.translationY < 0) {
				translateY.value = withTiming(-100, undefined, (finish) => {
					if (finish) {
						runOnJS(setIsShown)(false);
					}
				});
			} else if (event.translationY > 0) {
				translateY.value = withSequence(
					withTiming(60),
					withDelay(
						duration,
						withTiming(-100, undefined, (finish) => {
							if (finish) {
								runOnJS(setIsShown)(false);
							}
						}),
					),
				);
			}
		},
	});

	return (
		<>
			{isShown && (
				<PanGestureHandler onGestureEvent={gestureHandler}>
					<Animated.View
						style={[
							tw`absolute w-full rounded-lg border border-border dark:border-dark-border p-4 z-10`,
							variant === "default" &&
								tw`bg-background dark:bg-dark-background`,
							variant === "destructive" &&
								tw`border-destructive dark:border-dark-destructive bg-background dark:bg-dark-background`,
							animatedStyle,
						]}
					>
						<Text
							style={[
								tw`text-base text-foreground dark:text-dark-foreground font-medium leading-[0px] tracking-tight mb-1`,
								variant === "destructive" &&
									tw`text-destructive dark:text-dark-destructive`,
							]}
						>
							{title}
						</Text>
						<Text
							style={[
								tw`text-sm text-foreground dark:text-dark-foreground`,
								variant === "destructive" &&
									tw`text-destructive dark:text-dark-destructive`,
							]}
						>
							{message}
						</Text>
					</Animated.View>
				</PanGestureHandler>
			)}
		</>
	);
});
