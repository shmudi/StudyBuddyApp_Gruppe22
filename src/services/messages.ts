import { FirebaseError } from 'firebase/app';
import {
  addDoc,
  collection,
  getDocs,
  orderBy,
  query,
  Timestamp,
  where
} from 'firebase/firestore';
import { db } from '../config/firebase';

export interface Message {
  id: string;
  text: string;
  authorId: string;
  authorName: string;
  groupId: string;
  createdAt: Date;
}

export interface CreateMessageData {
  text: string;
  authorName: string;
  groupId: string;
}

export class MessageService {
  // Hent alle meldinger for en gruppe
  static async getGroupMessages(groupId: string): Promise<Message[]> {
    try {
      const messagesRef = collection(db, 'messages');
      const q = query(
        messagesRef, 
        where('groupId', '==', groupId),
        orderBy('createdAt', 'asc')
      );
      
      const querySnapshot = await getDocs(q);
      const messages: Message[] = [];
      
      querySnapshot.forEach((docSnap) => {
        const data: any = docSnap.data();
        const createdAt = data?.createdAt?.toDate ? data.createdAt.toDate() : new Date();
        messages.push({
          id: docSnap.id,
          ...data,
          createdAt,
        } as Message);
      });
      
      return messages;
    } catch (error) {
      // Fallback: mangler indeks -> hent uten orderBy og sorter i klient
      if (error instanceof FirebaseError && error.code === 'failed-precondition') {
        console.warn('Firestore: Mangler indeks for meldinger. Bruker fallback mens indeks opprettes.');
        const messagesRef = collection(db, 'messages');
        const qNoIndex = query(messagesRef, where('groupId', '==', groupId));
        const snap = await getDocs(qNoIndex);
        const messages: Message[] = [];
        snap.forEach((docSnap) => {
          const data: any = docSnap.data();
          const createdAt = data?.createdAt?.toDate ? data.createdAt.toDate() : new Date();
          messages.push({
            id: docSnap.id,
            ...data,
            createdAt,
          } as Message);
        });
        // Sorter eldste først
        messages.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
        return messages;
      }
      console.error('Feil ved henting av meldinger:', error);
      throw new Error('Kunne ikke hente meldinger');
    }
  }

  // Opprett ny melding
  static async createMessage(userId: string, messageData: CreateMessageData): Promise<string> {
    try {
      const now = Timestamp.now();
      const docRef = await addDoc(collection(db, 'messages'), {
        ...messageData,
        authorId: userId,
        createdAt: now,
      });
      
      return docRef.id;
    } catch (error) {
      console.error('Feil ved opprettelse av melding:', error);
      throw new Error('Kunne ikke sende melding');
    }
  }
}