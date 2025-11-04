import {
  addDoc,
  collection,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  Timestamp,
  where,
  Unsubscribe
} from 'firebase/firestore';
import { db } from '../config/firebase';

export interface ChatMessage {
  id: string;
  groupId: string;  // Bruker 'groupId' i stedet for 'chatId' (matcher Firebase)
  text: string;
  senderId: string;
  senderName: string;
  timestamp: Date;
  createdAt: Date;
}

export interface CreateMessageData {
  text: string;
  senderId: string;
  senderName: string;
  timestamp: Date;
}

export class ChatService {
  // Hent alle meldinger for en chat
  static async getChatMessages(groupId: string): Promise<ChatMessage[]> {
    try {
      const messagesRef = collection(db, 'messages');  // Bruker 'messages' collection
      const q = query(
        messagesRef,
        where('groupId', '==', groupId),  // Bruker 'groupId' felt
        orderBy('createdAt', 'asc')
      );
      
      const querySnapshot = await getDocs(q);
      const messages: ChatMessage[] = [];
      
      querySnapshot.forEach((docSnap: any) => {
        const data: any = docSnap.data();
        const createdAt = data?.createdAt?.toDate ? data.createdAt.toDate() : new Date();
        const timestamp = data?.timestamp?.toDate ? data.timestamp.toDate() : createdAt;
        
        messages.push({
          id: docSnap.id,
          groupId: data.groupId,  // Endret fra chatId til groupId
          text: data.text,
          senderId: data.senderId,
          senderName: data.senderName,
          timestamp,
          createdAt,
        } as ChatMessage);
      });
      
      // Already sorted by Firestore with the index
      return messages;
    } catch (error) {
      // console.error('Feil ved henting av meldinger:', error);
      throw new Error('Kunne ikke hente meldinger');
    }
  }

  // Send ny melding
  static async sendMessage(groupId: string, messageData: CreateMessageData): Promise<string> {
    try {
      const now = Timestamp.now();
      const docData = {
        groupId,  // Endret fra chatId til groupId
        text: messageData.text,
        senderId: messageData.senderId,
        senderName: messageData.senderName,
        timestamp: Timestamp.fromDate(messageData.timestamp),
        createdAt: now,
      };
      
      console.log('💾 Sending to Firebase:', docData);
      
      const docRef = await addDoc(collection(db, 'messages'), docData);
      
      return docRef.id;
    } catch (error) {
      console.error('❌ Error sending message:', error);
      throw new Error('Kunne ikke sende melding');
    }
  }

  // Real-time listener for meldinger (automatisk oppdatering)
  static subscribeToChat(groupId: string, callback: (messages: ChatMessage[]) => void): Unsubscribe {
    console.log('🔥 Setting up Firebase listener for groupId:', groupId);
    
    try {
      const messagesRef = collection(db, 'messages');  // Bruker 'messages' collection
      
      // Try with timestamp instead of createdAt for ordering
      const q = query(
        messagesRef,
        where('groupId', '==', groupId),  // Bruker 'groupId' felt
        orderBy('timestamp', 'asc')  // Use timestamp instead of createdAt
      );
      
      return onSnapshot(q, 
        (snapshot: any) => {
          console.log('🔥 Firebase snapshot received! Changes:', snapshot.docs.length);
          const messages: ChatMessage[] = [];
          
          snapshot.forEach((docSnap: any) => {
            const data: any = docSnap.data();
            console.log('📨 Message data:', data);
            
            const createdAt = data?.createdAt?.toDate ? data.createdAt.toDate() : new Date();
            const timestamp = data?.timestamp?.toDate ? data.timestamp.toDate() : createdAt;
            
            messages.push({
              id: docSnap.id,
              groupId: data.groupId,  // Endret fra chatId til groupId
              text: data.text,
              senderId: data.senderId,
              senderName: data.senderName,
              timestamp,
              createdAt,
            } as ChatMessage);
          });
          
          // No need to sort - Firestore does it with the index
          console.log('✅ Processed messages (sorted by Firestore timestamp):', messages.length);
          callback(messages);
        }, 
        (error: any) => {
          console.error('❌ Real-time listener error:', error);
          console.log('🔄 Falling back to simple query without orderBy...');
          
          // Fallback to simple query without orderBy
          const simpleQ = query(messagesRef, where('groupId', '==', groupId));
          return onSnapshot(simpleQ, (snapshot: any) => {
            const messages: ChatMessage[] = [];
            snapshot.forEach((docSnap: any) => {
              const data: any = docSnap.data();
              const createdAt = data?.createdAt?.toDate ? data.createdAt.toDate() : new Date();
              const timestamp = data?.timestamp?.toDate ? data.timestamp.toDate() : createdAt;
              
              messages.push({
                id: docSnap.id,
                groupId: data.groupId,
                text: data.text,
                senderId: data.senderId,
                senderName: data.senderName,
                timestamp,
                createdAt,
              } as ChatMessage);
            });
            
            // Sort manually since no orderBy
            messages.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
            console.log('✅ Fallback: Processed messages (sorted manually):', messages.length);
            callback(messages);
          });
        }
      );
    } catch (error) {
      console.error('❌ Error setting up real-time listener:', error);
      // Return empty unsubscribe function hvis det feiler
      return () => {};
    }
  }

  // Hent unike chat-IDer for en bruker (for å liste alle chats)
  static async getUserChats(userId: string): Promise<string[]> {
    try {
      const messagesRef = collection(db, 'chats');
      const q = query(
        messagesRef,
        where('senderId', '==', userId)
      );
      
      const querySnapshot = await getDocs(q);
      const chatIds = new Set<string>();
      
      querySnapshot.forEach((docSnap: any) => {
        const data = docSnap.data();
        chatIds.add(data.groupId);
      });
      
      return Array.from(chatIds);
    } catch (error) {
      // console.error('Feil ved henting av bruker-chats:', error);
      throw new Error('Kunne ikke hente chats');
    }
  }
}