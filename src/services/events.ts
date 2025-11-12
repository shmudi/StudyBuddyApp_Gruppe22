// src/services/events.ts
// Her håndteres henting og lagring av kalenderhendelser.
// Leser fra 'events' (og prøver fallback mot 'tasks' hvis det trengs).
// Ref: https://firebase.google.com/docs/firestore/query-data/get-data

import { addDoc, collection, getDocs, query, Timestamp, where } from "firebase/firestore";
import { db } from "../config/firebase";

/**
 * En EventItem er det som viser i kalenderen.
 * Forventer at dokumentene i 'events' har dette formatet.
 */
export interface EventItem {
  id?: string;
  userID: string;  // Matcher eksisterende struktur (userID i stedet for userId)
  title: string;
  description?: string;
  date: string;    // Bruker "date" felt (som i eksisterende events)
}

/**
 *  Legger til en ny hendelse i 'events' (brukes evt. hvis jeg vil opprette
 * hendelser direkte fra kalenderen senere).
 */
export async function addEvent(event: EventItem) {
  try {
    await addDoc(collection(db, "events"), {  // Bruker "events"-samlingen
      userID: event.userID,
      title: event.title,
      description: event.description || "",
      date: event.date,
      createdAt: Timestamp.now(),
    });
    // console.log("Ny hendelse lagt til:", event.title);
  } catch (err) {
    // console.error("Feil ved lagring av event:", err);
  }
}

/**
 * enter alle hendelser for en bestemt måned.
 * Bygger en prefiks-query på 'YYYY-MM' og returnerer alle treff.
 * Hvis queries feiler prøver den fallback som leser alt og filtrerer lokalt.
 */
export async function getEventsForMonth(year: number, month: number, userID?: string) {
  const monthNum = month + 1;
  const monthStr = monthNum < 10 ? `0${monthNum}` : `${monthNum}`; // Fix padStart issue
  const prefix = `${year}-${monthStr}`;

  try {
    // Bygg query basert på om userID er oppgitt
    let q;
    if (userID) {
      q = query(
        collection(db, "events"),
        where("userID", "==", userID),
        where("date", ">=", `${prefix}-01`),
        where("date", "<=", `${prefix}-31`)
      );
    } else {
      // Hent alle events for måneden (hvis ikke spesifikk bruker)
      q = query(
        collection(db, "events"),
        where("date", ">=", `${prefix}-01`),
        where("date", "<=", `${prefix}-31`)
      );
    }

    const snapshot = await getDocs(q);
    const events: EventItem[] = [];

    snapshot.forEach((doc: any) => {
      const data = doc.data();
      events.push({
        id: doc.id,
        userID: data.userID,
        title: data.title,
        description: data.description || "",
        date: data.date,
      });
    });

    // console.log(`Hentet ${events.length} hendelser fra ${prefix}`);
    return events;
  } catch (error) {
    // console.error("Feil ved henting av events:", error);
    // Fallback hvis compound query feiler (mangler indeks)
    try {
      const allEvents = await getDocs(collection(db, "events"));
      const events: EventItem[] = [];
      
      allEvents.forEach((doc: any) => {
        const data = doc.data();
        const eventDate = data.date;
        
        // Filter på klient-side hvis query feiler
        if (eventDate && eventDate.startsWith(prefix)) {
          if (!userID || data.userID === userID) {
            events.push({
              id: doc.id,
              userID: data.userID,
              title: data.title,
              description: data.description || "",
              date: data.date,
            });
          }
        }
      });
      
      // console.log(`Fallback: Hentet ${events.length} hendelser fra ${prefix}`);
      return events;
    } catch (fallbackError) {
      // console.error("" Fallback også feilet:", fallbackError);
      // Siste fallback: prøv å lese fra 'tasks' collection hvis den eksisterer
      try {
        const tasksQ = userID
          ? query(
              collection(db, "tasks"),
              where("userId", "==", userID),
              where("due", ">=", `${prefix}-01`),
              where("due", "<=", `${prefix}-31`)
            )
          : query(
              collection(db, "tasks"),
              where("due", ">=", `${prefix}-01`),
              where("due", "<=", `${prefix}-31`)
            );

        const snap = await getDocs(tasksQ);
        const taskEvents: EventItem[] = [];
        snap.forEach((doc: any) => {
          const data = doc.data();
          taskEvents.push({
            id: doc.id,
            userID: data.userId || data.userID || "",
            title: data.title || "Uten tittel",
            description: data.description || "",
            date: data.due,
          });
        });

        return taskEvents;
      } catch (fallbackError2) {
        // console.error("Tasks-fallback også feilet:", fallbackError2);
        return [];
      }
    }
  }
}
