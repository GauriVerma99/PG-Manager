import { collection, getDocs, doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase/config';

export interface PgSettings {
  pgId: string;
  pgName: string;
  upiId?: string;
  bankAccountNumber?: string;
  bankIfsc?: string;
  bankAccountName?: string;
  phoneNumber?: string;
  mapUrl?: string;
  
  // Location
  state?: string;
  city?: string;
  
  // Public Listing Details
  description?: string;
  amenities?: string[];
  photos?: string[];
  
  updatedAt?: any;
}

export const getPgSettings = async (pgId: string): Promise<PgSettings | null> => {
  const docRef = doc(db, 'pg_settings', pgId);
  const snapshot = await getDoc(docRef);
  if (snapshot.exists()) {
    return { pgId: snapshot.id, ...snapshot.data() } as PgSettings;
  }
  return null;
};

export const updatePgSettings = async (pgId: string, settings: Partial<PgSettings>) => {
  const docRef = doc(db, 'pg_settings', pgId);
  await updateDoc(docRef, { ...settings, updatedAt: new Date() });
};

export const getAllPgListings = async (): Promise<PgSettings[]> => {
  const snapshot = await getDocs(collection(db, 'pg_settings'));
  return snapshot.docs.map(doc => ({ pgId: doc.id, ...doc.data() } as PgSettings));
};
