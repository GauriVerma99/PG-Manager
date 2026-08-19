import { collection, doc, getDocs, updateDoc, query, where } from 'firebase/firestore';
import { db } from '../firebase/config';
import type { UserProfile } from '../context/AuthContext';

export const getPendingUsers = async (pgId: string): Promise<UserProfile[]> => {
  const q = query(
    collection(db, 'users'), 
    where('pgId', '==', pgId),
    where('isActive', '==', false)
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ uid: doc.id, ...doc.data() } as UserProfile));
};

export const approveUser = async (uid: string, role: string) => {
  // Update the user document to active
  await updateDoc(doc(db, 'users', uid), {
    isActive: true
  });

  // If they are a tenant, we also need to activate their tenant record
  if (role === 'tenant') {
    await updateDoc(doc(db, 'tenants', uid), {
      status: 'Active'
    });
  }
};
