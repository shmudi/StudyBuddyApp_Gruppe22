import { FirebaseError } from 'firebase/app';
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  orderBy,
  query,
  Timestamp,
  updateDoc,
  where
} from 'firebase/firestore';
import { db } from '../config/firebase';

// Task-typen jeg bruker i appen
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

// Data som trengs for å opprette en ny oppgave
export interface CreateTaskData {
  title: string;
  course?: string;
  due?: string;
  done?: boolean;
}

export class TaskService {
  // Henter alle oppgaver for en bruker
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

      querySnapshot.forEach((docSnap) => {
        const data: any = docSnap.data();

        // Konverterer timestamps til Date
        const createdAt = data?.createdAt?.toDate ? data.createdAt.toDate() : new Date(0);
        const updatedAt = data?.updatedAt?.toDate ? data.updatedAt.toDate() : createdAt || new Date(0);

        // Konverterer 'due' hvis det finnes
        const due =
          data?.due?.toDate
            ? data.due.toDate().toISOString().split('T')[0] // f.eks. "2025-11-13"
            : data.due || '';

        tasks.push({
          id: docSnap.id,
          ...data,
          due,
          createdAt,
          updatedAt,
        } as Task);
      });

      return tasks;
    } catch (error) {
      // Fallback hvis mangler indeks
      if (error instanceof FirebaseError && error.code === 'failed-precondition') {
        console.warn(
          'Firestore: Mangler indeks for (userId, createdAt). Bruker fallback uten orderBy.'
        );
        const tasksRef = collection(db, 'tasks');
        const qNoIndex = query(tasksRef, where('userId', '==', userId));
        const snap = await getDocs(qNoIndex);
        const tasks: Task[] = [];
        snap.forEach((docSnap) => {
          const data: any = docSnap.data();
          const createdAt = data?.createdAt?.toDate ? data.createdAt.toDate() : new Date(0);
          const updatedAt = data?.updatedAt?.toDate ? data.updatedAt.toDate() : createdAt || new Date(0);
          const due =
            data?.due?.toDate
              ? data.due.toDate().toISOString().split('T')[0]
              : data.due || '';
          tasks.push({
            id: docSnap.id,
            ...data,
            due,
            createdAt,
            updatedAt,
          } as Task);
        });
        tasks.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
        return tasks;
      }
      console.error('Feil ved henting av oppgaver:', error);
      throw new Error('Kunne ikke hente oppgaver');
    }
  }

  // Lager en ny oppgave i Firestore
  static async createTask(userId: string, taskData: CreateTaskData): Promise<string> {
    try {
      const now = Timestamp.now();

      // Konverter due til Firestore Timestamp (viktig!)
      const dueValue =
        taskData.due && typeof taskData.due === 'string'
          ? Timestamp.fromDate(new Date(taskData.due))
          : null;

      const docRef = await addDoc(collection(db, 'tasks'), {
        title: taskData.title,
        course: taskData.course || '',
        due: dueValue, // ✅ lagres som Timestamp
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

  // Oppdaterer felt på en eksisterende oppgave
  static async updateTask(taskId: string, updates: Partial<CreateTaskData>): Promise<void> {
    try {
      const taskRef = doc(db, 'tasks', taskId);

      // Bruker any her fordi vi kan konvertere 'due' fra string til Firestore Timestamp
      // ved oppdatering, det matcher ikke TypeScript-typen for CreateTaskData.
      const updatedData: any = {
        ...updates,
        updatedAt: Timestamp.now(),
      };

      if (updates.due && typeof updates.due === "string") {
      updatedData["due"] = Timestamp.fromDate(new Date(updates.due as string));
}

      await updateDoc(taskRef, updatedData);
    } catch (error) {
      console.error('Feil ved oppdatering av oppgave:', error);
      throw new Error('Kunne ikke oppdatere oppgave');
    }
  }

  // Marker oppgave som ferdig / ikke ferdig
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

  // Sletter en oppgave
  static async deleteTask(taskId: string): Promise<void> {
    try {
      await deleteDoc(doc(db, 'tasks', taskId));
    } catch (error) {
      console.error('Feil ved sletting av oppgave:', error);
      throw new Error('Kunne ikke slette oppgave');
    }
  }
}
