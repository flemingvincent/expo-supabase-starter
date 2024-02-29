import { cssInterop } from "nativewind";
import { SafeAreaView } from "react-native-safe-area-context";

const StyledSafeAreaView = cssInterop(SafeAreaView, {
	className: "style",
});

export { StyledSafeAreaView as SafeAreaView };
