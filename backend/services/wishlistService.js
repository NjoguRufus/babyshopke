import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { db } from "../firebase/firebaseConfig.js";

const WISHLISTS_COL = "wishlists";

export async function addToWishlist(userId, productId) {
  const q = query(
    collection(db, WISHLISTS_COL),
    where("userId", "==", userId),
    where("productId", "==", productId),
  );
  const existing = await getDocs(q);
  if (!existing.empty) {
    return existing.docs.map((d) => ({ id: d.id, ...d.data() }))[0];
  }
  const ref = await addDoc(collection(db, WISHLISTS_COL), {
    userId,
    productId,
    createdAt: new Date(),
  });
  const docSnap = await getDocs(
    query(collection(db, WISHLISTS_COL), where("__name__", "==", ref.id)),
  );
  const snap = docSnap.docs[0];
  return { id: snap.id, ...snap.data() };
}

export async function removeFromWishlist(userId, productId) {
  const q = query(
    collection(db, WISHLISTS_COL),
    where("userId", "==", userId),
    where("productId", "==", productId),
  );
  const snap = await getDocs(q);
  await Promise.all(snap.docs.map((d) => deleteDoc(doc(db, WISHLISTS_COL, d.id))));
}

export async function getWishlist(userId) {
  const q = query(collection(db, WISHLISTS_COL), where("userId", "==", userId));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

