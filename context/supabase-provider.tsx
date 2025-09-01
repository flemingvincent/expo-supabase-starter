import {
	createContext,
	PropsWithChildren,
	useContext,
	useEffect,
	useState,
} from "react";

import { Session } from "@supabase/supabase-js";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { supabase } from "@/config/supabase";

type AuthState = {
	initialized: boolean;
	session: Session | null;
	signUp: (email: string, password: string) => Promise<void>;
	signIn: (email: string, password: string) => Promise<void>;
	signInWithPhone: (
		phone: string,
	) => Promise<{ success: boolean; error?: string }>;
	verifyOTP: (
		phone: string,
		otp: string,
	) => Promise<{ success: boolean; error?: string }>;
	signOut: () => Promise<void>;
};

export const AuthContext = createContext<AuthState>({
	initialized: false,
	session: null,
	signUp: async () => {},
	signIn: async () => {},
	signInWithPhone: async () => ({ success: false }),
	verifyOTP: async () => ({ success: false }),
	signOut: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }: PropsWithChildren) {
	const [initialized, setInitialized] = useState(false);
	const [session, setSession] = useState<Session | null>(null);

	const signUp = async (email: string, password: string) => {
		const { data, error } = await supabase.auth.signUp({
			email,
			password,
		});

		if (error) {
			console.error("Error signing up:", error);
			return;
		}

		if (data.session) {
			setSession(data.session);
			console.log("User signed up:", data.user);
		} else {
			console.log("No user returned from sign up");
		}
	};

	const signIn = async (email: string, password: string) => {
		const { data, error } = await supabase.auth.signInWithPassword({
			email,
			password,
		});

		if (error) {
			console.error("Error signing in:", error);
			return;
		}

		if (data.session) {
			setSession(data.session);
			console.log("User signed in:", data.user);
		} else {
			console.log("No user returned from sign in");
		}
	};


	const signInWithPhone = async (phone: string) => {
		try {
			// Use Supabase native phone auth
			const { data, error } = await supabase.auth.signInWithOtp({
				phone: phone.startsWith('+') ? phone : `+86${phone}`,
			});

			if (error) {
				console.error("Error sending OTP:", error);
				return { success: false, error: error.message };
			}

			console.log("OTP sent to:", phone);
			return { success: true };
		} catch (error: any) {
			console.error("Error in signInWithPhone:", error);
			return { success: false, error: error.message };
		}
	};

	const verifyOTP = async (phone: string, otp: string) => {
		try {
			// Use Supabase native phone auth
			const { data, error } = await supabase.auth.verifyOtp({
				phone: phone.startsWith('+') ? phone : `+86${phone}`,
				token: otp,
				type: 'sms',
			});

			if (error) {
				console.error("Error verifying OTP:", error);
				return { success: false, error: error.message };
			}

			if (data.session) {
				setSession(data.session);
				console.log("User verified:", data.user);
				return { success: true };
			}

			return { success: false, error: "验证失败" };
		} catch (error: any) {
			console.error("Error in verifyOTP:", error);
			return { success: false, error: error.message };
		}
	};

	const signOut = async () => {
		try {
			const { error } = await supabase.auth.signOut();
			
			if (error) {
				console.error("Error signing out:", error);
			} else {
				setSession(null);
				console.log("User signed out");
			}
		} catch (error) {
			console.error("Error signing out:", error);
		}
	};

	useEffect(() => {
		// Check Supabase session on app launch
		supabase.auth.getSession().then(({ data: { session } }) => {
			setSession(session);
			setInitialized(true);
		});

		// Listen to Supabase auth changes
		const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
			setSession(session);
		});

		return () => {
			authListener?.subscription.unsubscribe();
		};
	}, []);

	return (
		<AuthContext.Provider
			value={{
				initialized,
				session,
				signUp,
				signIn,
				signInWithPhone,
				verifyOTP,
				signOut,
			}}
		>
			{children}
		</AuthContext.Provider>
	);
}
