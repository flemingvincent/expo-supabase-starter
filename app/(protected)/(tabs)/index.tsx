import { Button, ScrollView } from "react-native";

import { useSupabase } from "@/hooks/useSupabase";

export default function Page() {
  const { signOut } = useSupabase();

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (err) {
      console.error(JSON.stringify(err, null, 2));
    }
  };

  return (
    <ScrollView
      automaticallyAdjustsScrollIndicatorInsets
      contentInsetAdjustmentBehavior="automatic"
      contentInset={{ top: 39 }}
    >
      <Button title="Sign Out" onPress={handleSignOut} />
    </ScrollView>
  );
}
