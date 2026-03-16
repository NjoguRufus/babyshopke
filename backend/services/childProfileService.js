import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { db } from "../firebase/firebaseConfig.js";

const FAMILY_ACCOUNTS_COL = "familyAccounts";

export async function createChildProfile(familyAccountId, childData) {
  const now = serverTimestamp();
  const col = collection(db, `${FAMILY_ACCOUNTS_COL}/${familyAccountId}/children`);
  const ref = await addDoc(col, {
    ...childData,
    createdAt: now,
    updatedAt: now,
  });
  const snap = await getDoc(ref);
  return { id: snap.id, ...snap.data() };
}

export async function updateChildProfile(familyAccountId, childId, updates) {
  const ref = doc(db, `${FAMILY_ACCOUNTS_COL}/${familyAccountId}/children`, childId);
  await updateDoc(ref, {
    ...updates,
    updatedAt: serverTimestamp(),
  });
  const snap = await getDoc(ref);
  return { id: snap.id, ...snap.data() };
}

export async function getChildrenByFamily(familyAccountId) {
  const col = collection(db, `${FAMILY_ACCOUNTS_COL}/${familyAccountId}/children`);
  const snap = await getDocs(col);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

