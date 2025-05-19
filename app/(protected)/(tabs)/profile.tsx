import { View, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { H1, H2, H3, Muted } from "@/components/ui/typography";
import { useAuth } from "@/context/supabase-provider";
import { router } from "expo-router";

export default function Profile() {
	const { session, profile, updateProfile, signOut } = useAuth();

	const user = session?.user;

	const formatDate = (dateString: string) => {
		return new Date(dateString).toLocaleDateString("en-US", {
			year: "numeric",
			month: "long",
			day: "numeric",
			hour: "2-digit",
			minute: "2-digit",
		});
	};

	const handleSignOut = async () => {
		await signOut();
	};

	const handleOnboarding = () => {
		router.push("/onboarding");
	}

	return (
		<ScrollView className="flex-1 bg-background">
			<View className="p-4 gap-y-6">
				<H1 className="text-center text-primary">Account Settings</H1>

				{/* Profile Header */}
				<View className="bg-card rounded-2xl p-6 border border-border shadow-sm">
					<View className="items-center mb-4">
						<View className="w-20 h-20 bg-primary/10 rounded-full items-center justify-center mb-3">
							<Ionicons name="person" size={32} color="#25551b" />
						</View>
						<H2 className="text-primary">{user?.email}</H2>
						<Text className="text-muted-foreground text-sm">
							Member since{" "}
							{user?.created_at ? formatDate(user.created_at) : "N/A"}
						</Text>
					</View>
				</View>

				{/* Account Information */}
				<View className="bg-card rounded-2xl p-6 border border-border shadow-sm">
					<H3 className="text-primary mb-4">Account Information</H3>

					<View>
						<Text>Email: {session?.user?.email}</Text>
						<Text>Is Admin: {profile?.admin ? "Yes" : "No"}</Text>
						<Text>Display name: {profile?.display_name}</Text>
						<Text>Country: {profile?.country}</Text>
						<Text>City: {profile?.city}</Text>
						<Text>Post code: {profile?.post_code}</Text>
						<Text>
							Onboarding Complete:{" "}
							{profile?.onboarding_completed ? "Yes" : "No"}
						</Text>
					</View>

					<View className="gap-y-4">
						<View className="flex-row items-center gap-3">
							<Ionicons name="mail" size={20} color="#25551b" />
							<View className="flex-1">
								<Text className="text-muted-foreground text-sm">Email</Text>
								<Text className="text-foreground">{user?.email}</Text>
							</View>
						</View>

						<View className="flex-row items-center gap-3">
							<Ionicons name="id-card" size={20} color="#25551b" />
							<View className="flex-1">
								<Text className="text-muted-foreground text-sm">User ID</Text>
								<Text className="text-foreground text-xs font-mono">
									{user?.id}
								</Text>
							</View>
						</View>

						<View className="flex-row items-center gap-3">
							<Ionicons name="shield-checkmark" size={20} color="#25551b" />
							<View className="flex-1">
								<Text className="text-muted-foreground text-sm">
									Email Verified
								</Text>
								<Text
									className={`${user?.email_confirmed_at ? "text-green-600" : "text-red-600"}`}
								>
									{user?.email_confirmed_at ? "Verified" : "Not verified"}
								</Text>
							</View>
						</View>

						<View className="flex-row items-center gap-3">
							<Ionicons name="time" size={20} color="#25551b" />
							<View className="flex-1">
								<Text className="text-muted-foreground text-sm">
									Last Active
								</Text>
								<Text className="text-foreground">
									{user?.last_sign_in_at
										? formatDate(user.last_sign_in_at)
										: "N/A"}
								</Text>
							</View>
						</View>
					</View>
				</View>

				{/* App Metadata (if available) */}
				{user?.app_metadata && Object.keys(user.app_metadata).length > 0 && (
					<View className="bg-card rounded-2xl p-6 border border-border shadow-sm">
						<H3 className="text-primary mb-4">User preferences</H3>
						
						
					</View>
				)}

				{/* App Metadata (if available) */}
				{user?.app_metadata && Object.keys(user.app_metadata).length > 0 && (
					<View className="bg-card rounded-2xl p-6 border border-border shadow-sm">
						<H3 className="text-primary mb-4">App Metadata</H3>
						<Text className="text-muted-foreground text-xs font-mono">
							{JSON.stringify(user.app_metadata, null, 2)}
						</Text>
					</View>
				)}

				{/* User Metadata (if available) */}
				{user?.user_metadata && Object.keys(user.user_metadata).length > 0 && (
					<View className="bg-card rounded-2xl p-6 border border-border shadow-sm">
						<H3 className="text-primary mb-4">User Metadata</H3>
						<Text className="text-muted-foreground text-xs font-mono">
							{JSON.stringify(user.user_metadata, null, 2)}
						</Text>
					</View>
				)}

				{/* Sign Out */}
				<View className="bg-card rounded-2xl p-6 border border-border shadow-sm">
					<H3 className="text-primary mb-4">Sign Out</H3>
					<Muted className="text-center mb-4">
						Sign out and return to the welcome screen.
					</Muted>

					<Button
						className="w-full"
						size="default"
						variant="destructive"
						onPress={handleSignOut}
					>
						<View className="flex-row items-center justify-center">
							<Ionicons name="log-out" size={16} color="white" />
							<Text className="ml-2">Sign Out</Text>
						</View>
					</Button>
					
				</View>
				<View className="bg-card rounded-2xl p-6 border border-border shadow-sm">
					<H3 className="text-primary mb-4">Repeat onboarding</H3>

					<Button
						className="w-full"
						size="default"
						variant="secondary"
						onPress={handleOnboarding}
					>
						<View className="flex-row items-center justify-center">
							<Text className="ml-2">Onboard</Text>
						</View>
					</Button>
					
				</View>
			</View>
		</ScrollView>
	);
}
