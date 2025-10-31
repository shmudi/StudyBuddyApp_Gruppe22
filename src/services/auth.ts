import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  User,
  sendPasswordResetEmail
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '../config/firebase';

export interface UserProfile {
  id: string;
  email: string;
  fullName: string;
  username: string;
  createdAt: Date;
}

export class AuthService {
  // Registrer ny bruker
  static async register(email: string, password: string, fullName: string, username: string): Promise<User> {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Lagre brukerinfo i Firestore
      await setDoc(doc(db, 'users', user.uid), {
        id: user.uid,
        email: user.email,
        fullName,
        username,
        createdAt: new Date()
      });

      return user;
    } catch (error) {
      throw new Error(`Registrering feilet: ${error instanceof Error ? error.message : 'Ukjent feil'}`);
    }
  }

  // Logg inn bruker
  static async login(email: string, password: string): Promise<User> {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      return userCredential.user;
    } catch (error) {
      throw new Error(`Innlogging feilet: ${error instanceof Error ? error.message : 'Ukjent feil'}`);
    }
  }

  // Logg ut bruker
  static async logout(): Promise<void> {
    try {
      await signOut(auth);
    } catch (error) {
      throw new Error(`Utlogging feilet: ${error instanceof Error ? error.message : 'Ukjent feil'}`);
    }
  }

  // Tilbakestill passord
  static async resetPassword(email: string): Promise<void> {
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (error) {
      throw new Error(`Passord-tilbakestilling feilet: ${error instanceof Error ? error.message : 'Ukjent feil'}`);
    }
  }

  // Hent brukerprofil fra Firestore
  static async getUserProfile(userId: string): Promise<UserProfile | null> {
    try {
      const userDoc = await getDoc(doc(db, 'users', userId));
      if (userDoc.exists()) {
        return userDoc.data() as UserProfile;
      }
      return null;
    } catch (error) {
      console.error('Feil ved henting av brukerprofil:', error);
      return null;
    }
  }

  // Lytt på auth state endringer
  static onAuthStateChange(callback: (user: User | null) => void) {
    return onAuthStateChanged(auth, callback);
  }
}