import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  Timestamp 
} from 'firebase/firestore';
import { db } from '../config/firebase';

export interface Task {
  id: string;
  title: string;
  course?: string;
  due?: string;
  done: boolean;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateTaskData {
  title: string;
  course?: string;
  due?: string;
  done?: boolean;
}

export class TaskService {
  // Hent alle oppgaver for en bruker
  static async getUserTasks(userId: string): Promise<Task[]> {
    try {
      const tasksRef = collection(db, 'tasks');
      const q = query(
        tasksRef, 
        where('userId', '==', userId),
        orderBy('createdAt', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      const tasks: Task[] = [];
      
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        tasks.push({
          id: doc.id,
          ...data,
          createdAt: data.createdAt.toDate(),
          updatedAt: data.updatedAt.toDate(),
        } as Task);
      });
      
      return tasks;
    } catch (error) {
      console.error('Feil ved henting av oppgaver:', error);
      throw new Error('Kunne ikke hente oppgaver');
    }
  }

  // Opprett ny oppgave
  static async createTask(userId: string, taskData: CreateTaskData): Promise<string> {
    try {
      const now = Timestamp.now();
      const docRef = await addDoc(collection(db, 'tasks'), {
        ...taskData,
        done: taskData.done || false,
        userId,
        createdAt: now,
        updatedAt: now,
      });
      
      return docRef.id;
    } catch (error) {
      console.error('Feil ved opprettelse av oppgave:', error);
      throw new Error('Kunne ikke opprette oppgave');
    }
  }

  // Oppdater oppgave
  static async updateTask(taskId: string, updates: Partial<CreateTaskData>): Promise<void> {
    try {
      const taskRef = doc(db, 'tasks', taskId);
      await updateDoc(taskRef, {
        ...updates,
        updatedAt: Timestamp.now(),
      });
    } catch (error) {
      console.error('Feil ved oppdatering av oppgave:', error);
      throw new Error('Kunne ikke oppdatere oppgave');
    }
  }

  // Toggle oppgave som ferdig/ikke ferdig
  static async toggleTask(taskId: string, done: boolean): Promise<void> {
    try {
      const taskRef = doc(db, 'tasks', taskId);
      await updateDoc(taskRef, {
        done,
        updatedAt: Timestamp.now(),
      });
    } catch (error) {
      console.error('Feil ved toggle av oppgave:', error);
      throw new Error('Kunne ikke oppdatere oppgave');
    }
  }

  // Slett oppgave
  static async deleteTask(taskId: string): Promise<void> {
    try {
      await deleteDoc(doc(db, 'tasks', taskId));
    } catch (error) {
      console.error('Feil ved sletting av oppgave:', error);
      throw new Error('Kunne ikke slette oppgave');
    }
  }
}