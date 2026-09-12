import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { db } from '../lib/firebase';
import { collection, query, getDocs, updateDoc, doc, deleteDoc } from 'firebase/firestore';

export const ADMIN_COLLECTIONS = [
  'users',
  'memberships',
  'bloodDonation',
  'cabinet',
  'elections',
  'cabinetMeetings',
  'news',
  'events',
  'dailyTasks',
  'announcements',
  'campaigns',
  'donations',
  'overseasRegistration',
  'paidAds'
] as const;

export type CollectionName = typeof ADMIN_COLLECTIONS[number];
export type RecordItem = Record<string, any> & { id: string };

type AdminContextType = {
  data: Record<CollectionName, RecordItem[]>;
  loading: Record<CollectionName, boolean>;
  fetchAll: () => Promise<void>;
  fetchCollection: (name: CollectionName) => Promise<void>;
  updateItem: (collectionName: CollectionName, id: string, updates: any) => Promise<void>;
  deleteItem: (collectionName: CollectionName, id: string) => Promise<void>;
  approveItem: (collectionName: CollectionName, id: string) => Promise<void>;
  rejectItem: (collectionName: CollectionName, id: string) => Promise<void>;
  saveItemField: (collectionName: CollectionName, id: string, field: string) => Promise<void>;
};

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export function AdminProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<Record<CollectionName, RecordItem[]>>(() => {
    const initial: any = {};
    ADMIN_COLLECTIONS.forEach(c => initial[c] = []);
    return initial;
  });

  const [loading, setLoading] = useState<Record<CollectionName, boolean>>(() => {
    const initial: any = {};
    ADMIN_COLLECTIONS.forEach(c => initial[c] = false);
    return initial;
  });

  const fetchCollection = useCallback(async (name: CollectionName) => {
    setLoading(prev => ({ ...prev, [name]: true }));
    try {
      const q = query(collection(db, name));
      const snap = await getDocs(q);
      const list: RecordItem[] = [];
      snap.forEach(d => list.push({ id: d.id, ...d.data() }));
      
      list.sort((a, b) => {
        const timeA = a.createdAt?.toMillis?.() || new Date(a.date || 0).getTime() || 0;
        const timeB = b.createdAt?.toMillis?.() || new Date(b.date || 0).getTime() || 0;
        return timeB - timeA;
      });

      setData(prev => ({ ...prev, [name]: list }));
    } catch (error) {
      console.error(`Error fetching ${name}:`, error);
    } finally {
      setLoading(prev => ({ ...prev, [name]: false }));
    }
  }, []);

  const fetchAll = useCallback(async () => {
    await Promise.all(ADMIN_COLLECTIONS.map(c => fetchCollection(c)));
  }, [fetchCollection]);

  const updateItem = async (collectionName: CollectionName, id: string, updates: any) => {
    await updateDoc(doc(db, collectionName, id), updates);
    await fetchCollection(collectionName);
  };

  const deleteItem = async (collectionName: CollectionName, id: string) => {
    if (!confirm('Are you sure you want to delete this item?')) return;
    await deleteDoc(doc(db, collectionName, id));
    await fetchCollection(collectionName);
  };

  const approveItem = async (collectionName: CollectionName, id: string) => {
    await updateItem(collectionName, id, { status: 'Approved' });
  };

  const rejectItem = async (collectionName: CollectionName, id: string) => {
    await updateItem(collectionName, id, { status: 'Rejected' });
  };

  const saveItemField = async (collectionName: CollectionName, id: string, field: string) => {
    const item = data[collectionName].find(i => i.id === id);
    const currentValue = item ? item[field] : '';
    const newValue = prompt(`Edit ${field}:`, currentValue || '');
    if (newValue === null) return;
    await updateItem(collectionName, id, { [field]: newValue });
  };

  return (
    <AdminContext.Provider value={{
      data, loading, fetchAll, fetchCollection, updateItem, deleteItem, approveItem, rejectItem, saveItemField
    }}>
      {children}
    </AdminContext.Provider>
  );
}

export function useAdminData() {
  const context = useContext(AdminContext);
  if (!context) throw new Error("useAdminData must be used within an AdminProvider");
  return context;
}
