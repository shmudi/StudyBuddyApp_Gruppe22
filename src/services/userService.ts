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
  let photoURL: string | null = null;

  // Hvis brukeren har valgt et bilde → last det opp til Firebase Storage
  if (imageUri) {
    const response = await fetch(imageUri);
    const blob = await response.blob();
    const imageRef = ref(storage, `profileImages/${uid}.jpg`);
    await uploadBytes(imageRef, blob);
    photoURL = await getDownloadURL(imageRef);
  }

  // Opprett objekt for Firestore, men unngå undefined-verdier
  const updateData: any = {
    fullName: data.fullName,
    username: data.username,
  };

  // Bare legg til photoURL hvis det faktisk finnes (ikke undefined)
  if (photoURL !== null) {
    updateData.photoURL = photoURL;
  }

  // Oppdater dokumentet uten å sende undefined-felt
  const userRef = doc(db, "users", uid);
  await updateDoc(userRef, updateData);

  return photoURL;
}
