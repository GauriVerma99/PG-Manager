import React, { createContext, useContext, useEffect, useState } from 'react';
import { type User, onAuthStateChanged } from 'firebase/auth';
import { doc, onSnapshot } from 'firebase/firestore';
import { auth, db } from '../firebase/config';

export type UserRole = 'admin' | 'staff' | 'tenant' | 'superadmin';

export interface UserProfile {
  uid: string;
  name: string;
  email: string;
  role: UserRole;
  pgId: string;
  isActive: boolean;
  permissions?: string[];
}

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({ user: null, profile: null, loading: true });

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let unsubscribeProfile: (() => void) | undefined;

    const unsubscribeAuth = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
        
        // Special case for our mock SuperAdmin
        if (firebaseUser.email === 'super@admin.com') {
          setProfile({
            uid: 'superadmin_1',
            email: 'super@admin.com',
            name: 'Super Admin',
            role: 'superadmin',
            pgId: 'ALL',
            isActive: true,
          } as UserProfile);
          setLoading(false);
          return;
        }

        // Listen to the user profile document in real-time
        const docRef = doc(db, 'users', firebaseUser.uid);
        unsubscribeProfile = onSnapshot(docRef, (docSnap) => {
          if (docSnap.exists()) {
            setProfile({ uid: firebaseUser.uid, ...docSnap.data() } as UserProfile);
          } else {
            setProfile(null);
          }
          setLoading(false);
        }, (error) => {
          console.error("Error listening to user profile:", error);
          setProfile(null);
          setLoading(false);
        });
      } else {
        setUser(null);
        setProfile(null);
        setLoading(false);
        if (unsubscribeProfile) {
          unsubscribeProfile();
        }
      }
    });

    return () => {
      unsubscribeAuth();
      if (unsubscribeProfile) unsubscribeProfile();
    };
  }, []);

  return (
    <AuthContext.Provider value={{ user, profile, loading }}>
      {/* 
        We can conditionally render children or handle loading globally.
        Let's render a loading screen if loading is true.
      */}
      {loading ? (
        <div className="global-loader">
          <div className="spinner"></div>
          <p>Loading application...</p>
        </div>
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
};
