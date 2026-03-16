import { doc, getDoc, updateDoc, collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig.js";

const USERS_COL = "users";
const FAMILY_ACCOUNTS_COL = "familyAccounts";

export async function getUsers() {
  const snap = await getDocs(collection(db, USERS_COL));
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

export async function getUser(userId) {
  const ref = doc(db, USERS_COL, userId);
  const snap = await getDoc(ref);
  if (!snap.exists()) return null;
  return { id: snap.id, ...snap.data() };
}

export async function updateUserProfile(userId, updates) {
  const ref = doc(db, USERS_COL, userId);
  await updateDoc(ref, {
    ...updates,
    updatedAt: new Date(),
  });
  const snap = await getDoc(ref);
  return { id: snap.id, ...snap.data() };
}

export async function getUserFullProfile(userId) {
  const user = await getUser(userId);
  if (!user) return null;

  let familyAccount = null;
  let children = [];

  if (user.familyAccountId) {
    const familyRef = doc(db, FAMILY_ACCOUNTS_COL, user.familyAccountId);
    const familySnap = await getDoc(familyRef);
    if (familySnap.exists()) {
      familyAccount = { id: familySnap.id, ...familySnap.data() };

      const childrenCol = collection(db, `${FAMILY_ACCOUNTS_COL}/${familyAccount.id}/children`);
      const childrenSnap = await getDocs(childrenCol);
      children = childrenSnap.docs.map((d) => ({ id: d.id, ...d.data() }));
    }
  }

  const ordersQ = query(collection(db, "orders"), where("userId", "==", userId));
  const ordersSnap = await getDocs(ordersQ);

  return {
    user,
    familyAccount,
    children,
    orders: ordersSnap.docs.map((d) => ({ id: d.id, ...d.data() })),
  };
}

