import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { getFirestore, doc, updateDoc } from "firebase/firestore";

const storage = getStorage();
const db = getFirestore();

/**
 * Oppdaterer brukerprofilen i Firestore og laster opp nytt bilde hvis valgt.
 */
export async function updateUserProfile(
  uid: string,
  data: { fullName: string; username: string },
  imageUri?: string | null
) {
  let photoURL = null;

  // Hvis brukeren har valgt et bilde, last det opp til Firebase Storage
  // Hvis brukeren har valgt et bilde, last det opp til Firebase Storage
    if (imageUri) {
      const response = await fetch(imageUri);
      const blob = await response.blob();
      const imageRef = ref(storage, `profileImages/${uid}.jpg`);
      await uploadBytes(imageRef, blob);
      photoURL = await getDownloadURL(imageRef);
    }
  // Oppdater Firestore-dokumentet for brukeren
  const userRef = doc(db, "users", uid);
  await updateDoc(userRef, {
    fullName: data.fullName,
    username: data.username,
    ...(photoURL && { photoURL }),
  });

  return photoURL;
}
