import { collection, doc, getDocs, setDoc, query, where, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase/config';

export interface Room {
  id: string;
  name: string;
  capacity: number;
  pgId: string;
  createdAt?: any;
  updatedAt?: any;
}

export interface Bed {
  id: string;
  roomId: string;
  name: string;
  status: 'Available' | 'Occupied' | 'Maintenance';
  pgId: string;
}

export const getRooms = async (pgId: string): Promise<Room[]> => {
  const q = query(collection(db, 'rooms'), where('pgId', '==', pgId));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Room));
};

export const getBedsForRoom = async (roomId: string): Promise<Bed[]> => {
  const q = query(collection(db, 'beds'), where('roomId', '==', roomId));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Bed));
};

export const createRoom = async (pgId: string, name: string, capacity: number) => {
  const roomRef = doc(collection(db, 'rooms'));
  const newRoom = {
    name,
    capacity,
    pgId,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  };
  await setDoc(roomRef, newRoom);
  return { id: roomRef.id, ...newRoom };
};

export const addBedToRoom = async (pgId: string, roomId: string, name: string) => {
  const bedRef = doc(collection(db, 'beds'));
  const newBed = {
    roomId,
    name,
    status: 'Available',
    pgId
  };
  await setDoc(bedRef, newBed);
  return { id: bedRef.id, ...newBed };
};
