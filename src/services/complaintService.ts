import { collection, doc, getDocs, setDoc, query, where, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase/config';

export type ComplaintPriority = 'Low' | 'Medium' | 'High' | 'Urgent';
export type ComplaintStatus = 'Submitted' | 'Under Review' | 'Assigned' | 'In Progress' | 'Resolved' | 'Closed';

export interface Complaint {
  id: string;
  pgId: string;
  tenantId: string;
  title: string;
  category: string;
  description: string;
  priority: ComplaintPriority;
  status: ComplaintStatus;
  assignedStaffId?: string;
  resolutionTimeTarget?: any; // To track SLA
  resolutionTimeActual?: any;
  rating?: number;
  feedback?: string;
  createdAt?: any;
  updatedAt?: any;
}

const SLA_HOURS: Record<ComplaintPriority, number> = {
  Low: 72,
  Medium: 48,
  High: 24,
  Urgent: 6
};

export const getComplaints = async (pgId: string): Promise<Complaint[]> => {
  const q = query(collection(db, 'complaints'), where('pgId', '==', pgId));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Complaint));
};

export const createComplaint = async (pgId: string, tenantId: string, title: string, category: string, description: string, priority: ComplaintPriority) => {
  const complaintRef = doc(collection(db, 'complaints'));
  
  // Deterministic SLA Target Calculation
  const slaTarget = new Date();
  slaTarget.setHours(slaTarget.getHours() + SLA_HOURS[priority]);

  const newComplaint = {
    pgId,
    tenantId,
    title,
    category,
    description,
    priority,
    status: 'Submitted',
    resolutionTimeTarget: slaTarget,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  };
  
  await setDoc(complaintRef, newComplaint);
  return { id: complaintRef.id, ...newComplaint };
};
