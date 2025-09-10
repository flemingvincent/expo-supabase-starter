import { useState } from "react";
import { Text, TextInput, Button, View, ScrollView } from "react-native";

import { router } from "expo-router";

import { useSignIn } from "@/hooks/useSignIn";

export default function Page() {
  const { signInWithPassword, isLoaded } = useSignIn();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const onSignInPress = async () => {
    if (!isLoaded) return;

    try {
      await signInWithPassword({
        email,
        password,
      });
    } catch (err) {
      console.error(JSON.stringify(err, null, 2));
    }
  };

  return (
    <ScrollView
      automaticallyAdjustsScrollIndicatorInsets
      contentInsetAdjustmentBehavior="automatic"
      contentContainerStyle={{ padding: 16, gap: 8 }}
    >
      <Text>Email Address:</Text>
      <TextInput
        autoCapitalize="none"
        value={email}
        placeholder="Enter email"
        onChangeText={(email) => setEmail(email)}
      />
      <Text>Password:</Text>
      <TextInput
        value={password}
        placeholder="Enter password"
        secureTextEntry={true}
        onChangeText={(password) => setPassword(password)}
      />
      <Button
        title="Continue"
        onPress={onSignInPress}
        disabled={!email || !password}
      />
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
        }}
      >
        <Text>Don&apos;t have an account? </Text>
        <Text onPress={() => router.replace("/sign-up")}>Sign up</Text>
      </View>
    </ScrollView>
  );
}
