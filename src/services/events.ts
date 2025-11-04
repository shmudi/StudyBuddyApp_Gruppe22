// src/services/events.ts
// 🔥 Denne filen håndterer henting og lagring av kalenderhendelser fra 'events' collection
// Ref: https://firebase.google.com/docs/firestore/query-data/get-data

import { addDoc, collection, getDocs, query, where, Timestamp } from "firebase/firestore";
import { db } from "../config/firebase";

/**
 * Representerer en "event" i kalenderen.
 * Bruker den eksisterende "events"-samlingen i Firestore.
 */
export interface EventItem {
  id?: string;
  userID: string;  // Matcher eksisterende struktur (userID i stedet for userId)
  title: string;
  description?: string;
  date: string;    // Bruker "date" felt (som i eksisterende events)
}

/**
 * ➕ Opprett en ny "event" i Firestore
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
    // console.log("✅ Ny hendelse lagt til:", event.title);
  } catch (err) {
    // console.error("❌ Feil ved lagring av event:", err);
  }
}

/**
 * 📅 Hent alle events for en gitt måned
 * Bruker Firestore-query med "where" på feltet "date"
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

    // console.log(`📅 Hentet ${events.length} hendelser fra ${prefix}`);
    return events;
  } catch (error) {
    // console.error("❌ Feil ved henting av events:", error);
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
      
      // console.log(`📅 Fallback: Hentet ${events.length} hendelser fra ${prefix}`);
      return events;
    } catch (fallbackError) {
      // console.error("❌ Fallback også feilet:", fallbackError);
      return [];
    }
  }
}
