import { collection, doc, getDocs, setDoc, updateDoc, query, where, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase/config';
import { setDoc as setTenantDoc } from 'firebase/firestore'; // For creating the tenant record upon approval

export type ApplicationStatus = 'SUBMITTED' | 'APPROVED' | 'REJECTED';

export interface TenantApplication {
  id: string;
  pgId: string;
  userId: string;
  name: string;
  email: string;
  phone: string;
  moveInDate: string;
  durationMonths: number;
  roomType: string;
  status: ApplicationStatus;
  createdAt: any;
  updatedAt: any;
}

export const submitApplication = async (app: Omit<TenantApplication, 'id' | 'status' | 'createdAt' | 'updatedAt'>) => {
  const appRef = doc(collection(db, 'applications'));
  const newApp = {
    ...app,
    status: 'SUBMITTED' as ApplicationStatus,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  };
  await setDoc(appRef, newApp);
  return { id: appRef.id, ...newApp };
};

export const getPgApplications = async (pgId: string): Promise<TenantApplication[]> => {
  const q = query(collection(db, 'applications'), where('pgId', '==', pgId));
  const snap = await getDocs(q);
  return snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as TenantApplication));
};

export const approveApplication = async (application: TenantApplication) => {
  // Update status
  const appRef = doc(db, 'applications', application.id);
  await updateDoc(appRef, { status: 'APPROVED', updatedAt: serverTimestamp() });

  // Provision Tenant Record
  const tenantRef = doc(db, 'tenants', application.userId);
  await setTenantDoc(tenantRef, {
    pgId: application.pgId,
    name: application.name,
    email: application.email,
    phone: application.phone,
    status: 'Active',
    depositAmount: 0,
    roomType: application.roomType,
    moveInDate: application.moveInDate,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  });
  
  // Provision User Role update (activate them)
  const userRef = doc(db, 'users', application.userId);
  await updateDoc(userRef, { isActive: true, role: 'tenant', pgId: application.pgId });
};

export const rejectApplication = async (id: string) => {
  const appRef = doc(db, 'applications', id);
  await updateDoc(appRef, { status: 'REJECTED', updatedAt: serverTimestamp() });
};
