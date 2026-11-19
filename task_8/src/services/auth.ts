import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  type User,
  type AuthError,
} from "firebase/auth";
import { auth, googleProvider, isFirebaseConfigured } from "@/firebase";
import type { AuthUser } from "@/types/auth";

const MOCK_STORAGE_KEY = "kbtu_mock_auth_session";

function formatFirebaseUser(user: User): AuthUser {
  return {
    uid: user.uid,
    email: user.email,
    displayName: user.displayName || user.email?.split("@")[0] || "User",
    photoURL: user.photoURL,
    emailVerified: user.emailVerified,
    createdAt: user.metadata.creationTime,
    lastLoginAt: user.metadata.lastSignInTime,
  };
}

function getMockSession(): AuthUser | null {
  try {
    const raw = sessionStorage.getItem(MOCK_STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function setMockSession(user: AuthUser | null): void {
  try {
    if (user) {
      sessionStorage.setItem(MOCK_STORAGE_KEY, JSON.stringify(user));
    } else {
      sessionStorage.removeItem(MOCK_STORAGE_KEY);
    }
  } catch (error) {
    void error;
  }
}

const mockSubscribers: Set<(user: AuthUser | null) => void> = new Set();

function notifyMockSubscribers(user: AuthUser | null) {
  mockSubscribers.forEach((cb) => cb(user));
}

export function formatAuthErrorMessage(error: unknown): string {
  if (!error) return "An unknown error occurred.";
  const err = error as AuthError;
  const code = err.code || "";

  switch (code) {
    case "auth/email-already-in-use":
      return "An account with this email address already exists.";
    case "auth/invalid-email":
      return "The email address is invalid.";
    case "auth/operation-not-allowed":
      return "This authentication method is not enabled in Firebase console.";
    case "auth/weak-password":
      return "Password should be at least 6 characters long.";
    case "auth/user-disabled":
      return "This user account has been disabled.";
    case "auth/user-not-found":
    case "auth/wrong-password":
    case "auth/invalid-credential":
      return "Invalid email or password.";
    case "auth/popup-closed-by-user":
      return "Google sign-in popup was closed before finishing.";
    case "auth/cancelled-popup-request":
      return "Only one sign-in popup can be open at a time.";
    case "auth/network-request-failed":
      return "Network error. Please check your internet connection.";
    case "auth/too-many-requests":
      return "Too many failed attempts. Please try again later.";
    default:
      return err.message || "Authentication failed. Please try again.";
  }
}

export async function signUpWithEmail(
  email: string,
  password: string
): Promise<AuthUser> {
  if (isFirebaseConfigured && auth) {
    try {
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      return formatFirebaseUser(cred.user);
    } catch (error) {
      throw new Error(formatAuthErrorMessage(error), { cause: error });
    }
  }

  await new Promise((r) => setTimeout(r, 400));
  const mockUser: AuthUser = {
    uid: `demo-${Date.now().toString(36)}`,
    email,
    displayName: email.split("@")[0],
    photoURL: null,
    emailVerified: false,
    createdAt: new Date().toUTCString(),
    lastLoginAt: new Date().toUTCString(),
  };
  setMockSession(mockUser);
  notifyMockSubscribers(mockUser);
  return mockUser;
}

export async function signInWithEmail(
  email: string,
  password: string
): Promise<AuthUser> {
  if (isFirebaseConfigured && auth) {
    try {
      const cred = await signInWithEmailAndPassword(auth, email, password);
      return formatFirebaseUser(cred.user);
    } catch (error) {
      throw new Error(formatAuthErrorMessage(error), { cause: error });
    }
  }

  await new Promise((r) => setTimeout(r, 400));
  const existing = getMockSession();
  const mockUser: AuthUser = {
    uid: existing?.uid || `demo-${Date.now().toString(36)}`,
    email,
    displayName: email.split("@")[0],
    photoURL: null,
    emailVerified: true,
    createdAt: existing?.createdAt || new Date().toUTCString(),
    lastLoginAt: new Date().toUTCString(),
  };
  setMockSession(mockUser);
  notifyMockSubscribers(mockUser);
  return mockUser;
}

export async function signInWithGoogle(): Promise<AuthUser> {
  if (isFirebaseConfigured && auth && googleProvider) {
    try {
      const cred = await signInWithPopup(auth, googleProvider);
      return formatFirebaseUser(cred.user);
    } catch (error) {
      throw new Error(formatAuthErrorMessage(error), { cause: error });
    }
  }

  await new Promise((r) => setTimeout(r, 400));
  const mockUser: AuthUser = {
    uid: `google-demo-${Date.now().toString(36)}`,
    email: "google.user@example.com",
    displayName: "Google Demo User",
    photoURL: null,
    emailVerified: true,
    createdAt: new Date().toUTCString(),
    lastLoginAt: new Date().toUTCString(),
  };
  setMockSession(mockUser);
  notifyMockSubscribers(mockUser);
  return mockUser;
}

export async function signOutUser(): Promise<void> {
  if (isFirebaseConfigured && auth) {
    try {
      await signOut(auth);
      return;
    } catch (error) {
      throw new Error(formatAuthErrorMessage(error), { cause: error });
    }
  }

  await new Promise((r) => setTimeout(r, 200));
  setMockSession(null);
  notifyMockSubscribers(null);
}

export function subscribeToAuthChanges(
  callback: (user: AuthUser | null) => void
): () => void {
  if (isFirebaseConfigured && auth) {
    return onAuthStateChanged(
      auth,
      (user) => {
        callback(user ? formatFirebaseUser(user) : null);
      },
      (error) => {
        console.error("Auth state change error:", error);
        callback(null);
      }
    );
  }

  mockSubscribers.add(callback);
  callback(getMockSession());
  return () => {
    mockSubscribers.delete(callback);
  };
}
