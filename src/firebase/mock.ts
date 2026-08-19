// A complete mock of Firebase Firestore & Auth using localStorage for demo purposes

export const db = {};
export const auth = {};
export const getAuth = () => auth;
export const getFirestore = () => db;
export const getStorage = () => ({});

// Mock Auth
export const onAuthStateChanged = (_authObj: any, cb: any) => {
  const userStr = localStorage.getItem('mock_user');
  if (userStr) {
    setTimeout(() => cb(JSON.parse(userStr)), 100);
  } else {
    setTimeout(() => cb(null), 100);
  }
  return () => {};
};

export const signInWithEmailAndPassword = async (_authObj: any, email: string, _pass: string) => {
  // Hardcoded Super Admin for testing
  if (email === 'super@admin.com') {
    const superAdmin = { uid: 'superadmin_1', email: 'super@admin.com' };
    localStorage.setItem('mock_user', JSON.stringify(superAdmin));
    return { user: superAdmin };
  }

  // Find user with this email in mock_db
  const dbData = JSON.parse(localStorage.getItem('mock_db') || '{"users":{}}');
  const users = dbData.users || {};
  
  // Find the key (uid) for the user with this email
  const uid = Object.keys(users).find(key => users[key].email === email);
  
  if (!uid) throw new Error("User not found or password incorrect");
  
  const userEntry = users[uid];
  const fakeUser = { uid, email: userEntry.email };
  localStorage.setItem('mock_user', JSON.stringify(fakeUser));
  return { user: fakeUser };
};

export const createUserWithEmailAndPassword = async (_authObj: any, email: string, _pass: string) => {
  const uid = 'user_' + Date.now();
  const fakeUser = { uid, email };
  localStorage.setItem('mock_user', JSON.stringify(fakeUser));
  return { user: fakeUser };
};

export const signOut = async () => {
  localStorage.removeItem('mock_user');
};

// Mock Firestore
const getDb = () => JSON.parse(localStorage.getItem('mock_db') || '{"users":{}, "pg_settings":{}, "tenants":{}, "bills":{}, "rooms":{}}');
const saveDb = (data: any) => localStorage.setItem('mock_db', JSON.stringify(data));

export const doc = (...args: any[]) => {
  let collName = '';
  let id = 'id_' + Date.now();
  
  if (args.length === 1) { // doc(collRef)
    collName = args[0].path;
  } else if (args.length === 2) { 
    if (typeof args[0] === 'object' && args[0].path) { // doc(collRef, id)
      collName = args[0].path;
      id = args[1];
    } else { // doc(db, collName) ? Invalid in real firebase but just in case
      collName = args[1];
    }
  } else if (args.length === 3) { // doc(db, collName, id)
    collName = args[1];
    id = args[2];
  }
  
  return { collectionName: collName, id };
};

export const collection = (_dbObj: any, path: string) => {
  return { path, collectionName: path };
};

export const setDoc = async (docRef: any, data: any) => {
  const d = getDb();
  if (!d[docRef.collectionName]) d[docRef.collectionName] = {};
  d[docRef.collectionName][docRef.id] = data;
  saveDb(d);
};

export const updateDoc = async (docRef: any, data: any) => {
  const d = getDb();
  if (d[docRef.collectionName] && d[docRef.collectionName][docRef.id]) {
    d[docRef.collectionName][docRef.id] = { ...d[docRef.collectionName][docRef.id], ...data };
    saveDb(d);
  }
};

export const getDoc = async (docRef: any) => {
  const d = getDb();
  const data = d[docRef.collectionName]?.[docRef.id];
  return {
    exists: () => !!data,
    data: () => data,
    id: docRef.id
  };
};

export const query = (collRef: any, ...constraints: any[]) => {
  return { collRef, constraints };
};

export const where = (field: string, op: string, value: any) => {
  return { field, op, value };
};

export const getDocs = async (queryRef: any) => {
  const d = getDb();
  const collName = queryRef.collRef ? queryRef.collRef.path : queryRef.path; // handle both collection and query
  const allDocs = d[collName] || {};
  
  let results = Object.keys(allDocs).map(k => ({ id: k, ...allDocs[k] }));
  
  if (queryRef.constraints) {
    queryRef.constraints.forEach((c: any) => {
      results = results.filter(docData => docData[c.field] === c.value);
    });
  }
  
  return {
    docs: results.map(data => ({
      id: data.id,
      data: () => data
    }))
  };
};

export const onSnapshot = (docRef: any, onNext: any, onError?: any) => {
  // Initial call
  getDoc(docRef).then(onNext).catch(onError);
  
  // Polling to simulate real-time
  const interval = setInterval(() => {
    getDoc(docRef).then(onNext).catch(onError);
  }, 2000);
  
  return () => clearInterval(interval);
};

export const serverTimestamp = () => new Date().toISOString();
