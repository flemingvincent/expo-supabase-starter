import { Button } from "react-native";

import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Page() {
  return (
    <SafeAreaView
      style={{ flex: 1, alignItems: "center", justifyContent: "flex-end" }}
    >
      <Button title="Sign Up" onPress={() => router.push("/sign-up")} />
      <Button title="Sign In" onPress={() => router.push("/sign-in")} />
    </SafeAreaView>
  );
}
