import { collection, doc, getDocs, setDoc, updateDoc, query, where, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase/config';

export interface Bill {
  id: string;
  pgId: string;
  tenantId: string;
  billingMonth: string; // e.g. "2023-10"
  baseRent: number;
  electricityCharge: number;
  waterCharge: number;
  maintenanceCharge: number;
  otherCharges: number;
  previousBalance: number;
  discount: number;
  totalPayable: number;
  amountPaid: number;
  status: 'Pending' | 'Partially Paid' | 'Paid' | 'Overdue' | 'Under Review';
  transactionId?: string;
  dueDate: any;
  createdAt?: any;
  updatedAt?: any;
}

export const getBills = async (pgId: string): Promise<Bill[]> => {
  const q = query(collection(db, 'bills'), where('pgId', '==', pgId));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Bill));
};

export const getTenantBills = async (tenantId: string): Promise<Bill[]> => {
  const q = query(collection(db, 'bills'), where('tenantId', '==', tenantId));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Bill));
};

export const updateBillStatus = async (billId: string, status: Bill['status'], transactionId?: string) => {
  const dataToUpdate: any = { status, updatedAt: new Date() };
  if (transactionId) dataToUpdate.transactionId = transactionId;
  await updateDoc(doc(db, 'bills', billId), dataToUpdate);
};

export const generateBill = async (_pgId: string, data: Omit<Bill, 'id' | 'createdAt' | 'updatedAt' | 'amountPaid' | 'status'>) => {
  const billRef = doc(collection(db, 'bills'));
  
  const totalPayable = 
    data.baseRent + 
    data.electricityCharge + 
    data.waterCharge + 
    data.maintenanceCharge + 
    data.otherCharges + 
    data.previousBalance - 
    data.discount;

  const newBill = {
    ...data,
    totalPayable,
    amountPaid: 0,
    status: 'Pending',
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  };
  
  await setDoc(billRef, newBill);
  return { id: billRef.id, ...newBill };
};
