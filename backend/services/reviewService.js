import {
  addDoc,
  collection,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { db } from "../firebase/firebaseConfig.js";

const REVIEWS_COL = "reviews";

export async function createReview(data) {
  const now = new Date();
  const ref = await addDoc(collection(db, REVIEWS_COL), {
    ...data,
    createdAt: now,
  });
  const snap = await getDocs(
    query(collection(db, REVIEWS_COL), where("__name__", "==", ref.id)),
  );
  const docSnap = snap.docs[0];
  return { id: docSnap.id, ...docSnap.data() };
}

export async function getProductReviews(productId) {
  const q = query(collection(db, REVIEWS_COL), where("productId", "==", productId));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

