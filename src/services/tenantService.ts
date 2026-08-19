import { collection, doc, getDocs, setDoc, updateDoc, query, where, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase/config';

export interface Tenant {
  id: string; // typically the auth UID
  pgId: string;
  name: string;
  email: string;
  phone: string;
  roomId?: string;
  bedId?: string;
  status: 'Active' | 'Inactive';
  depositAmount: number;
  moveInDate?: any;
  moveOutDate?: any;
  createdAt?: any;
  updatedAt?: any;
}

export const getTenants = async (pgId: string): Promise<Tenant[]> => {
  const q = query(collection(db, 'tenants'), where('pgId', '==', pgId));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Tenant));
};

export const createTenantRecord = async (tenantId: string, data: Omit<Tenant, 'id' | 'createdAt' | 'updatedAt'>) => {
  const tenantRef = doc(db, 'tenants', tenantId);
  const newTenant = {
    ...data,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  };
  await setDoc(tenantRef, newTenant);
  return { id: tenantId, ...newTenant };
};

export const updateTenantRecord = async (tenantId: string, data: Partial<Tenant>) => {
  const tenantRef = doc(db, 'tenants', tenantId);
  await updateDoc(tenantRef, {
    ...data,
    updatedAt: serverTimestamp()
  });
};
