import { createContext, useContext, useEffect, useState } from "react";
import { auth, provider, db } from "../firebase";
import { signInWithPopup, signOut } from "firebase/auth";
import { doc, setDoc, serverTimestamp, updateDoc } from "firebase/firestore";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authLoading, setAuthLoading] = useState(false);

  const loginWithGoogle = async () => {
    const result = await signInWithPopup(auth, provider);
    const u = result.user;
    try {
      await setDoc(
        doc(db, "users", u.uid),
        {
          name: u.displayName,
          email: u.email,
          photo: u.photoURL,
          role: "user",
          createdAt: serverTimestamp(),
        },
        { merge: true }
      );
    } catch (err) {
      console.warn("Firestore write error:", err);
    }

    setUser(u);
  };

  // Simple email "login" for demo: creates a lightweight local user and stores a record in Firestore.
  const login = async (email) => {
    setAuthLoading(true);
    try {
      // Browser-safe deterministic short hex from the email (replaces Node Buffer)
      const emailToHex = (str) => {
        const bytes = new TextEncoder().encode(str);
        return Array.from(bytes)
          .map((b) => b.toString(16).padStart(2, "0"))
          .join("");
      };

      const uid = `local-${emailToHex(email).slice(0, 12)}-${Date.now()}`;
      const displayName = (localStorage.getItem("username") || email.split("@")[0]).slice(0, 20);
      const u = {
        uid,
        email,
        displayName,
        photoURL: null,
      };

      try {
        await setDoc(
          doc(db, "users", uid),
          {
            name: displayName,
            email,
            role: "user",
            createdAt: serverTimestamp(),
          },
          { merge: true }
        );
      } catch (err) {
        console.warn("Firestore write error (creating user):", err);
      }

      setUser(u);
      return u;
    } finally {
      setAuthLoading(false);
    }
  };

  const updateUserPhoto = async (photoDataURL) => {
    if (!user) return;
    try {
      await updateDoc(doc(db, "users", user.uid), {
        photo: photoDataURL,
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      console.error("Error updating photo:", error);
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (err) {
      console.warn("SignOut error:", err);
    }
    setUser(null);
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((u) => {
      setUser(u);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  return (
    <AuthContext.Provider value={{ user, loginWithGoogle, login, logout, updateUserPhoto, authLoading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    return {
      user: null,
      loginWithGoogle: async () => {},
      login: async () => {},
      logout: async () => {},
      updateUserPhoto: async () => {},
      authLoading: false,
    };
  }
  return context;
};
