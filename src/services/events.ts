// src/services/events.ts
// 🔥 Denne filen håndterer henting og lagring av kalenderhendelser (nå koblet til Tasks)
// Ref: https://firebase.google.com/docs/firestore/query-data/get-data

import { addDoc, collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../config/firebase";

/**
 * Representerer en "event" i kalenderen.
 * Her bruker vi nå Task-data fra "tasks"-samlingen i Firestore,
 * slik at kalender og oppgaveskjerm deler samme backend.
 */
export interface EventItem {
  id?: string;
  userId: string;
  title: string;
  description?: string;
  due: string; // 🟡 Viktig: bruker "due" (samme felt som i TasksScreen)
  course?: string;
}

/**
 * ➕ Opprett en ny "task" i Firestore
 * (brukes hvis du ønsker å legge til hendelser via kalenderen senere)
 */
export async function addEvent(event: EventItem) {
  try {
    await addDoc(collection(db, "tasks"), event); // 📁 bruker "tasks"-samlingen
    console.log("✅ Ny oppgave lagt til:", event.title);
  } catch (err) {
    console.error("❌ Feil ved lagring av event:", err);
  }
}

/**
 * 📅 Hent alle tasks (hendelser) for en gitt måned
 * Bruker Firestore-query med "where" på feltet "due"
 */
export async function getEventsForMonth(year: number, month: number) {
  const monthStr = String(month + 1).padStart(2, "0"); // 0-indexed months
  const prefix = `${year}-${monthStr}`;

  // 🔍 Firestore query:
  // Hent alle tasks som har "due"-dato innenfor valgt måned (1.–31.)
  const q = query(
    collection(db, "tasks"),
    where("due", ">=", `${prefix}-01`),
    where("due", "<=", `${prefix}-31`)
  );

  try {
    const snapshot = await getDocs(q);
    const events: EventItem[] = [];

    snapshot.forEach((doc) => {
      const data = doc.data() as EventItem;
      events.push({
        id: doc.id,
        userId: data.userId,
        title: data.title,
        description: data.description || "",
        due: data.due,
        course: data.course || "",
      });
    });

    console.log(`📅 Hentet ${events.length} oppgaver fra ${prefix}`);
    return events;
  } catch (error) {
    console.error("❌ Feil ved henting av events:", error);
    return [];
  }
}
