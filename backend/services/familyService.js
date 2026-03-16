import {
  addDoc,
  arrayUnion,
  collection,
  doc,
  getDoc,
  getDocs,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../firebase/firebaseConfig.js";

const FAMILY_ACCOUNTS_COL = "familyAccounts";

export async function createFamilyAccount(primaryUserId, familyName) {
  const now = serverTimestamp();
  const ref = await addDoc(collection(db, FAMILY_ACCOUNTS_COL), {
    primaryUserId,
    familyName,
    memberUserIds: [primaryUserId],
    notes: null,
    createdAt: now,
    updatedAt: now,
  });
  const snap = await getDoc(ref);
  return { id: snap.id, ...snap.data() };
}

export async function addFamilyMember(familyAccountId, userId) {
  const ref = doc(db, FAMILY_ACCOUNTS_COL, familyAccountId);
  await updateDoc(ref, {
    memberUserIds: arrayUnion(userId),
    updatedAt: serverTimestamp(),
  });
  const snap = await getDoc(ref);
  return { id: snap.id, ...snap.data() };
}

export async function getFamilyAccount(familyAccountId) {
  const ref = doc(db, FAMILY_ACCOUNTS_COL, familyAccountId);
  const snap = await getDoc(ref);
  if (!snap.exists()) return null;
  return { id: snap.id, ...snap.data() };
}

export async function getFamilyAccounts() {
  const snap = await getDocs(collection(db, FAMILY_ACCOUNTS_COL));
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

