import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "../firebase/firebaseConfig.js";

const TX_COL = "paymentTransactions";

export async function recordTransaction(orderId, transactionData) {
  const now = new Date();
  const ref = await addDoc(collection(db, TX_COL), {
    orderId,
    userId: transactionData.userId,
    transactionCode: transactionData.transactionCode,
    method: transactionData.method,
    amount: transactionData.amount,
    status: transactionData.status || "pending",
    providerResponse: transactionData.providerResponse || null,
    recordedBy: transactionData.recordedBy || null,
    createdAt: now,
    updatedAt: now,
  });
  const snap = await getDoc(ref);
  return { id: snap.id, ...snap.data() };
}

export async function getTransactions() {
  const snap = await getDocs(collection(db, TX_COL));
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

export async function getTransactionsByUser(userId) {
  const q = query(collection(db, TX_COL), where("userId", "==", userId));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

export async function updateTransactionStatus(transactionId, status) {
  const ref = doc(db, TX_COL, transactionId);
  await updateDoc(ref, {
    status,
    updatedAt: new Date(),
  });
  const snap = await getDoc(ref);
  return { id: snap.id, ...snap.data() };
}

