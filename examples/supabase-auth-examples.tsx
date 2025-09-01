/**
 * Supabase Authentication Examples
 * These examples show how to use Supabase's built-in authentication methods
 */

import { supabase } from "@/config/supabase";

// ============================================
// 1. EMAIL/PASSWORD AUTHENTICATION
// ============================================

export const emailPasswordAuth = {
	// Sign up new user
	signUp: async (email: string, password: string) => {
		const { data, error } = await supabase.auth.signUp({
			email,
			password,
			options: {
				data: {
					// Add custom user metadata
					display_name: email.split("@")[0],
					avatar_url: null,
				},
			},
		});
		return { data, error };
	},

	// Sign in existing user
	signIn: async (email: string, password: string) => {
		const { data, error } = await supabase.auth.signInWithPassword({
			email,
			password,
		});
		return { data, error };
	},

	// Reset password
	resetPassword: async (email: string) => {
		const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
			redirectTo: "yourapp://reset-password",
		});
		return { data, error };
	},

	// Update password
	updatePassword: async (newPassword: string) => {
		const { data, error } = await supabase.auth.updateUser({
			password: newPassword,
		});
		return { data, error };
	},
};

// ============================================
// 2. PHONE/SMS AUTHENTICATION
// ============================================

export const phoneAuth = {
	// Send OTP to phone
	sendOTP: async (phoneNumber: string) => {
		// Ensure phone number has country code
		const formattedPhone = phoneNumber.startsWith("+")
			? phoneNumber
			: `+86${phoneNumber}`; // Default to China

		const { data, error } = await supabase.auth.signInWithOtp({
			phone: formattedPhone,
		});
		return { data, error };
	},

	// Verify OTP
	verifyOTP: async (phoneNumber: string, otp: string) => {
		const formattedPhone = phoneNumber.startsWith("+")
			? phoneNumber
			: `+86${phoneNumber}`;

		const { data, error } = await supabase.auth.verifyOtp({
			phone: formattedPhone,
			token: otp,
			type: "sms",
		});
		return { data, error };
	},
};

// ============================================
// 3. MAGIC LINK (PASSWORDLESS EMAIL)
// ============================================

export const magicLinkAuth = {
	// Send magic link to email
	sendMagicLink: async (email: string) => {
		const { data, error } = await supabase.auth.signInWithOtp({
			email,
			options: {
				emailRedirectTo: "yourapp://auth-callback",
				shouldCreateUser: true,
			},
		});
		return { data, error };
	},

	// Verify magic link token (usually handled automatically)
	verifyMagicLink: async (token: string, email: string) => {
		const { data, error } = await supabase.auth.verifyOtp({
			email,
			token,
			type: "email",
		});
		return { data, error };
	},
};

// ============================================
// 4. SOCIAL AUTHENTICATION
// ============================================

export const socialAuth = {
	// Google Sign In
	signInWithGoogle: async () => {
		const { data, error } = await supabase.auth.signInWithOAuth({
			provider: "google",
			options: {
				redirectTo: "yourapp://auth-callback",
				scopes: "profile email",
			},
		});
		return { data, error };
	},

	// Apple Sign In
	signInWithApple: async () => {
		const { data, error } = await supabase.auth.signInWithOAuth({
			provider: "apple",
			options: {
				redirectTo: "yourapp://auth-callback",
				scopes: "email name",
			},
		});
		return { data, error };
	},

	// GitHub Sign In
	signInWithGitHub: async () => {
		const { data, error } = await supabase.auth.signInWithOAuth({
			provider: "github",
			options: {
				redirectTo: "yourapp://auth-callback",
				scopes: "read:user user:email",
			},
		});
		return { data, error };
	},

	// WeChat Sign In (requires custom OAuth setup)
	signInWithWeChat: async () => {
		// WeChat requires special handling for China market
		// This would typically use a custom OAuth flow
		const { data, error } = await supabase.auth.signInWithOAuth({
			provider: "wechat" as any, // Custom provider
			options: {
				redirectTo: "yourapp://auth-callback",
			},
		});
		return { data, error };
	},
};

// ============================================
// 5. SESSION MANAGEMENT
// ============================================

export const sessionManagement = {
	// Get current session
	getSession: async () => {
		const { data, error } = await supabase.auth.getSession();
		return { data, error };
	},

	// Get current user
	getUser: async () => {
		const { data: { user } } = await supabase.auth.getUser();
		return user;
	},

	// Refresh session
	refreshSession: async () => {
		const { data, error } = await supabase.auth.refreshSession();
		return { data, error };
	},

	// Sign out
	signOut: async () => {
		const { error } = await supabase.auth.signOut();
		return { error };
	},

	// Listen to auth changes
	onAuthStateChange: (callback: (event: any, session: any) => void) => {
		const { data } = supabase.auth.onAuthStateChange(callback);
		return data.subscription;
	},
};

// ============================================
// 6. USER MANAGEMENT
// ============================================

export const userManagement = {
	// Update user profile
	updateProfile: async (updates: {
		email?: string;
		password?: string;
		data?: Record<string, any>;
	}) => {
		const { data, error } = await supabase.auth.updateUser(updates);
		return { data, error };
	},

	// Delete user account
	deleteAccount: async () => {
		// This requires admin privileges or a server-side function
		// Users cannot delete their own accounts directly
		const { error } = await supabase.rpc("delete_user_account");
		return { error };
	},

	// Verify email
	verifyEmail: async (token: string) => {
		const { data, error } = await supabase.auth.verifyOtp({
			token,
			type: "signup",
		});
		return { data, error };
	},
};

// ============================================
// 7. MULTI-FACTOR AUTHENTICATION (MFA)
// ============================================

export const mfaAuth = {
	// Enroll MFA
	enrollMFA: async () => {
		const { data, error } = await supabase.auth.mfa.enroll({
			factorType: "totp",
		});
		return { data, error };
	},

	// Verify MFA
	verifyMFA: async (code: string, factorId: string) => {
		const { data, error } = await supabase.auth.mfa.verify({
			factorId,
			code,
		});
		return { data, error };
	},

	// Unenroll MFA
	unenrollMFA: async (factorId: string) => {
		const { data, error } = await supabase.auth.mfa.unenroll({
			factorId,
		});
		return { data, error };
	},
};

// ============================================
// 8. ANONYMOUS AUTHENTICATION
// ============================================

export const anonymousAuth = {
	// Sign in anonymously
	signInAnonymously: async () => {
		const { data, error } = await supabase.auth.signInAnonymously();
		return { data, error };
	},

	// Convert anonymous to permanent account
	linkAccount: async (email: string, password: string) => {
		const { data, error } = await supabase.auth.updateUser({
			email,
			password,
		});
		return { data, error };
	},
};

// ============================================
// USAGE EXAMPLES IN COMPONENTS
// ============================================

/**
 * Example: Email/Password Sign In Component
 */
export const EmailSignInExample = () => {
	const handleSignIn = async () => {
		const { data, error } = await emailPasswordAuth.signIn(
			"user@example.com",
			"password123"
		);
		
		if (error) {
			console.error("Sign in failed:", error.message);
		} else {
			console.log("Signed in:", data.user);
		}
	};
};

/**
 * Example: Phone OTP Component
 */
export const PhoneOTPExample = () => {
	const handleSendOTP = async (phone: string) => {
		const { error } = await phoneAuth.sendOTP(phone);
		
		if (error) {
			console.error("Failed to send OTP:", error.message);
		} else {
			console.log("OTP sent successfully");
		}
	};

	const handleVerifyOTP = async (phone: string, otp: string) => {
		const { data, error } = await phoneAuth.verifyOTP(phone, otp);
		
		if (error) {
			console.error("Invalid OTP:", error.message);
		} else {
			console.log("Phone verified:", data.user);
		}
	};
};

/**
 * Example: Social Login Component
 */
export const SocialLoginExample = () => {
	const handleGoogleSignIn = async () => {
		const { data, error } = await socialAuth.signInWithGoogle();
		
		if (error) {
			console.error("Google sign in failed:", error.message);
		} else {
			console.log("Google sign in initiated:", data.url);
			// The actual authentication happens in the browser/webview
		}
	};

	const handleAppleSignIn = async () => {
		const { data, error } = await socialAuth.signInWithApple();
		
		if (error) {
			console.error("Apple sign in failed:", error.message);
		} else {
			console.log("Apple sign in initiated:", data.url);
		}
	};
};