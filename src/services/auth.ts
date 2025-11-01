import type { Auth, User } from "firebase/auth";
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, db } from "../config/firebase";

// Struktur for brukerdata lagret i Firestore
export interface UserProfile {
  id: string;
  email: string;
  fullName: string;
  username: string;
  createdAt: Date;
}

export class AuthService {
  // Registrer ny bruker
  static async register(
    email: string,
    password: string,
    fullName: string,
    username: string
  ): Promise<User> {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth as Auth,
        email,
        password
      );
      const user = userCredential.user;

      // Lagre brukerinfo i Firestore
      await setDoc(doc(db, "users", user.uid), {
        id: user.uid,
        email: user.email,
        fullName,
        username,
        createdAt: new Date(),
      });

      return user;
    } catch (error: any) {
      console.error("❌ Registrering feilet:", error.message);
      throw new Error(error.message);
    }
  }

  // Logg inn
  static async login(email: string, password: string): Promise<User> {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth as Auth,
        email,
        password
      );
      return userCredential.user;
    } catch (error: any) {
      console.error("❌ Innlogging feilet:", error.message);
      throw new Error(error.message);
    }
  }

  // Logg ut
  static async logout(): Promise<void> {
    try {
      await signOut(auth as Auth);
    } catch (error: any) {
      console.error("❌ Utlogging feilet:", error.message);
      throw new Error(error.message);
    }
  }

  // Tilbakestill passord
  static async resetPassword(email: string): Promise<void> {
    try {
      await sendPasswordResetEmail(auth as Auth, email);
    } catch (error: any) {
      console.error("❌ Passord-tilbakestilling feilet:", error.message);
      throw new Error(error.message);
    }
  }

  // Hent brukerprofil
  static async getUserProfile(userId: string): Promise<UserProfile | null> {
    try {
      const userDoc = await getDoc(doc(db, "users", userId));
      if (userDoc.exists()) {
        return userDoc.data() as UserProfile;
      }
      return null;
    } catch (error) {
      console.error("❌ Feil ved henting av brukerprofil:", error);
      return null;
    }
  }

  // Lytt på auth state endringer
  static onAuthStateChange(callback: (user: User | null) => void) {
    return onAuthStateChanged(auth as Auth, callback);
  }
}
