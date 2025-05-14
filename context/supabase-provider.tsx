import {
	createContext,
	PropsWithChildren,
	useContext,
	useEffect,
	useState,
	useRef,
} from "react";
import { SplashScreen, useRouter } from "expo-router";
import { useFonts } from "expo-font";
import { Session } from "@supabase/supabase-js";
import { supabase } from "@/config/supabase";

SplashScreen.preventAutoHideAsync();

export interface UserProfile {
	id: string;
	display_name: string;
	onboarding_completed: boolean;
	admin: boolean;
	created_at?: string;
	updated_at?: string;
}

type AuthState = {
	initialized: boolean;
	session: Session | null;
	profile: UserProfile | null;
	profileLoading: boolean;
	signUp: (email: string, password: string) => Promise<void>;
	signIn: (email: string, password: string) => Promise<void>;
	signOut: () => Promise<void>;
	updateProfile: (updates: Partial<UserProfile>) => Promise<void>;
	refreshProfile: () => Promise<void>;
};

export const AuthContext = createContext<AuthState>({
	initialized: false,
	session: null,
	profile: null,
	profileLoading: false,
	signUp: async () => {},
	signIn: async () => {},
	signOut: async () => {},
	updateProfile: async () => {},
	refreshProfile: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }: PropsWithChildren) {
	const [initialized, setInitialized] = useState(false);
	const [session, setSession] = useState<Session | null>(null);
	const [profile, setProfile] = useState<UserProfile | null>(null);
	const [profileLoading, setProfileLoading] = useState(false);
	const router = useRouter();
	
	// Use refs to track ongoing operations and prevent race conditions
	const profileFetchRef = useRef<Promise<any> | null>(null);
	const initializationRef = useRef(false);

	const [fontsLoaded] = useFonts({
		MMDisplay: require("../assets/fonts/BNDimeDisplay.otf"),
	});

	const fetchProfile = async (userId: string) => {
		// If there's already a fetch in progress, wait for it
		if (profileFetchRef.current) {
			return profileFetchRef.current;
		}

		// Create new fetch promise
		profileFetchRef.current = (async () => {
			try {
				setProfileLoading(true);

				const { data, error } = await supabase
					.from("profiles")
					.select("*")
					.eq("id", userId)
					.single();

				if (error) {
					console.error("Error fetching profile:", error);
					setProfile(null);
					return null;
				}

				setProfile(data);
				return data;
			} catch (error) {
				console.error("Error fetching profile:", error);
				setProfile(null);
				return null;
			} finally {
				setProfileLoading(false);
				profileFetchRef.current = null;
			}
		})();

		return profileFetchRef.current;
	};

	const signUp = async (email: string, password: string) => {
		const { data, error } = await supabase.auth.signUp({
			email,
			password,
		});

		if (error) {
			throw error;
		}

		if (data.session) {
			setSession(data.session);
		}
	};

	const signIn = async (email: string, password: string) => {
		try {
			const { data, error } = await supabase.auth.signInWithPassword({
				email,
				password,
			});

			if (error) {
				throw error;
			}

			if (data.session && data.user) {
				setSession(data.session);
			}
		} catch (error) {
			console.error("Sign in error:", error);
			throw error;
		}
	};

	const signOut = async () => {
		try {
			const { error } = await supabase.auth.signOut();
			if (error) {
				throw error;
			}
		} catch (error) {
			console.error("Sign out error:", error);
			throw error;
		}
	};

	const updateProfile = async (updates: Partial<UserProfile>) => {
		if (!session?.user?.id || !profile) {
			throw new Error("No user or profile found");
		}

		try {
			setProfileLoading(true);

			const { data, error } = await supabase
				.from("profiles")
				.update(updates)
				.eq("id", session.user.id)
				.single();

			if (error) {
				console.error("Error updating profile:", error);
				throw error;
			}

			setProfile({ ...profile, ...updates });
			return data;
		} catch (error) {
			console.error("Error updating profile:", error);
			throw error;
		} finally {
			setProfileLoading(false);
		}
	};

	const refreshProfile = async () => {
		if (!session?.user?.id) {
			return;
		}
		await fetchProfile(session.user.id);
	};

	// Initialize auth and listen for changes
	useEffect(() => {
		// Prevent double initialization
		if (initializationRef.current) {
			return;
		}
		
		initializationRef.current = true;
		
		const initializeAuth = async () => {
			try {
				const { data: { session }, error } = await supabase.auth.getSession();
				
				if (error) {
					console.error("Error getting initial session:", error);
				}
				
				setSession(session);
			} catch (error) {
				console.error("Error initializing auth:", error);
			} finally {
				setInitialized(true);
			}
		};

		// Set up auth state listener
		const {
			data: { subscription },
		} = supabase.auth.onAuthStateChange(async (event, session) => {
			setSession(session);

			if (event === "SIGNED_OUT") {
				setProfile(null);
				setProfileLoading(false);
				profileFetchRef.current = null;
			}
		});

		initializeAuth();

		return () => {
			subscription.unsubscribe();
			initializationRef.current = false;
			profileFetchRef.current = null;
		};
	}, []);

	// Handle profile fetching when session changes
	useEffect(() => {
		if (session?.user?.id && initialized) {
			fetchProfile(session.user.id);
		} else if (!session && initialized) {
			setProfile(null);
			setProfileLoading(false);
			profileFetchRef.current = null;
		}
	}, [session?.user?.id, initialized]);

	// Handle navigation
	useEffect(() => {
		if (initialized && fontsLoaded) {
			SplashScreen.hideAsync();

			if (session) {
				router.replace("/");
			} else {
				router.replace("/welcome");
			}
		}
	}, [initialized, session, fontsLoaded]);

	if (!fontsLoaded || !initialized) {
		return null;
	}

	return (
		<AuthContext.Provider
			value={{
				initialized,
				session,
				profile,
				profileLoading,
				signUp,
				signIn,
				signOut,
				updateProfile,
				refreshProfile,
			}}
		>
			{children}
		</AuthContext.Provider>
	);
}