import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  limit,
  query,
  updateDoc,
  where,
  orderBy,
} from "firebase/firestore";
import { db } from "../firebase/firebaseConfig.js";

const PRODUCTS_COL = "products";

export async function createProduct(data) {
  const now = new Date();
  const ref = await addDoc(collection(db, PRODUCTS_COL), {
    totalViews: 0,
    totalSales: 0,
    isActive: true,
    images: [],
    ...data,
    createdAt: now,
    updatedAt: now,
  });
  const snap = await getDoc(ref);
  return { id: snap.id, ...snap.data() };
}

export async function getProducts() {
  const snap = await getDocs(collection(db, PRODUCTS_COL));
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

export async function getActiveProducts() {
  const q = query(collection(db, PRODUCTS_COL), where("isActive", "==", true));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

export async function getFeaturedProducts() {
  const q = query(
    collection(db, PRODUCTS_COL),
    where("isActive", "==", true),
    where("isFeatured", "==", true),
    limit(12),
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

export async function getProductById(productId) {
  const ref = doc(db, PRODUCTS_COL, productId);
  const snap = await getDoc(ref);
  if (!snap.exists()) return null;
  return { id: snap.id, ...snap.data() };
}

export async function getProductBySlug(slug) {
  const q = query(collection(db, PRODUCTS_COL), where("slug", "==", slug), limit(1));
  const snap = await getDocs(q);
  if (snap.empty) return null;
  const docSnap = snap.docs[0];
  return { id: docSnap.id, ...docSnap.data() };
}

export async function updateProduct(productId, updates) {
  const ref = doc(db, PRODUCTS_COL, productId);
  await updateDoc(ref, {
    ...updates,
    updatedAt: new Date(),
  });
  const snap = await getDoc(ref);
  return { id: snap.id, ...snap.data() };
}

export async function deleteProduct(productId) {
  const ref = doc(db, PRODUCTS_COL, productId);
  await deleteDoc(ref);
}

export async function getLowStockProducts() {
  const q = query(
    collection(db, PRODUCTS_COL),
    where("isActive", "==", true),
    where("stockQty", "<=", 5),
    orderBy("stockQty", "asc"),
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

