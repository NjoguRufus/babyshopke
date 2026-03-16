import {
  addDoc,
  collection,
  getDocs,
  query,
  where,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../firebase/firebaseConfig.js";

const PRODUCT_VIEWS_COL = "productViews";

export async function recordProductView(
  productId,
  userId = null,
  familyAccountId = null,
  childId = null,
) {
  const now = serverTimestamp();
  await addDoc(collection(db, PRODUCT_VIEWS_COL), {
    productId,
    userId,
    familyAccountId,
    childId,
    viewedAt: now,
  });
}

export async function getProductViews(productId) {
  const q = query(
    collection(db, PRODUCT_VIEWS_COL),
    where("productId", "==", productId),
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

