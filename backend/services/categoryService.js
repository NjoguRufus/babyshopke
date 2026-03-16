import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { db } from "../firebase/firebaseConfig.js";

const CATEGORIES_COL = "categories";

export async function createCategory(data) {
  const now = serverTimestamp();
  const ref = await addDoc(collection(db, CATEGORIES_COL), {
    ...data,
    createdAt: now,
  });
  const snap = await getDocs(collection(db, CATEGORIES_COL));
  return { id: ref.id, ...(snap.docs.find((d) => d.id === ref.id)?.data() ?? data) };
}

export async function getCategories() {
  const snap = await getDocs(collection(db, CATEGORIES_COL));
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

export async function updateCategory(categoryId, updates) {
  const ref = doc(db, CATEGORIES_COL, categoryId);
  await updateDoc(ref, updates);
  const snap = await getDocs(collection(db, CATEGORIES_COL));
  const docSnap = snap.docs.find((d) => d.id === categoryId);
  return docSnap ? { id: docSnap.id, ...docSnap.data() } : null;
}

export async function deleteCategory(categoryId) {
  const ref = doc(db, CATEGORIES_COL, categoryId);
  await deleteDoc(ref);
}

