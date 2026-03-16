import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  User as FirebaseUser,
} from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "@/firebase/clientFirebase";

type UserProfile = {
  id: string;
  fullName: string;
  email: string;
  phone?: string;
  role: "admin" | "customer" | "staff";
  isActive: boolean;
  familyAccountId?: string | null;
  profileImage?: string | null;
};

type AuthContextValue = {
  firebaseUser: FirebaseUser | null;
  userProfile: UserProfile | null;
  loading: boolean;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      setFirebaseUser(user);
      if (!user) {
        setUserProfile(null);
        setLoading(false);
        return;
      }

      try {
        const userRef = doc(db, "users", user.uid);
        const snap = await getDoc(userRef);
        if (snap.exists()) {
          const data = snap.data() as Omit<UserProfile, "id">;
          setUserProfile({ id: snap.id, ...data });
        } else {
          // Minimal profile bootstrap if none exists.
          setUserProfile({
            id: user.uid,
            fullName: user.displayName || user.email || "",
            email: user.email || "",
            role: "customer",
            isActive: true,
            phone: "",
            familyAccountId: null,
            profileImage: null,
          });
        }
      } catch (err) {
        console.error("Failed to load user profile", err);
        setUserProfile(null);
      } finally {
        setLoading(false);
      }
    });

    return () => unsub();
  }, []);

  const login = async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password);
  };

  const logout = async () => {
    await signOut(auth);
  };

  const value: AuthContextValue = {
    firebaseUser,
    userProfile,
    loading,
    isAdmin: userProfile?.role === "admin",
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return ctx;
}

