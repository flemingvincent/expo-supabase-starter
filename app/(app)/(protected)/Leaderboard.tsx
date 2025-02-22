import React, { useState, useMemo } from "react"; // Ensure useState and useMemo are imported
import { View, Text, FlatList, ScrollView, StyleSheet } from "react-native";
import { Button } from "@/components/ui/button"; // Import your custom Button
import { H1, Muted } from "@/components/ui/typography";
import { useSupabase } from "@/context/supabase-provider";
import { SelectList } from "react-native-dropdown-select-list"; 
import { useNavigation } from "expo-router"; // Import useNavigation

const leaderboardTypes = [
  { key: "global", value: "Global" },
  { key: "friends", value: "Friends" },
  { key: "weekly", value: "Weekly" },
];

export default function Leaderboard() {
  const navigation = useNavigation(); // Get navigation object
  const { signOut } = useSupabase();
  const [selectedType, setSelectedType] = useState("global");

  const leaderboardData = useMemo(() =>
    Array.from({ length: 20 }, (_, i) => ({
      rank: i + 1,
      name: `Player ${i + 1}`,
      score: Math.floor(Math.random() * 10000),
    })), []
  );

  const filteredData = useMemo(() => {
    switch (selectedType) {
      case "friends":
        return leaderboardData.slice(0, 10); 
      case "weekly":
        return leaderboardData.filter(player => player.rank % 2 === 0); 
      default:
        return leaderboardData;
    }
  }, [selectedType, leaderboardData]);

  return (
    <ScrollView className="flex-1 bg-background p-4">
      <H1 className="text-center">🏆 Leaderboard</H1>
      <Muted className="text-center mb-4">Here are the top scores:</Muted>

      <SelectList
        setSelected={setSelectedType}
        data={leaderboardTypes}
        save="key"
        placeholder="Select Leaderboard Type"
        dropdownStyles={styles.dropdown}
      />

      <FlatList
        data={filteredData}
        keyExtractor={(item) => item.rank.toString()}
        renderItem={({ item }) => (
          <View style={styles.listItem}>
            <Text style={styles.rank}>{item.rank}. {item.name}</Text>
            <Text style={styles.score}>{item.score}</Text>
          </View>
        )}
      />


      <Button
        className="w-full"
        size="default"
        variant="default"

      >
        <Text>Edit Profile</Text>
      </Button>

      {/* Sign Out Button */}
      <Button
        className="w-full"
        size="default"
        variant="default"
        onPress={signOut}
      >
        <Text>Sign Out</Text>
      </Button>
    </ScrollView>
  );
}

// Styles
const styles = StyleSheet.create({
  dropdown: {
    marginBottom: 12,
  },
  listItem: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  rank: {
    fontSize: 18,
  },
  score: {
    fontSize: 18,
    fontWeight: "bold",
  },
});
