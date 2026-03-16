import { addDoc, collection, getDocs, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig.js";
import { reduceStock } from "./inventoryService.js";

const ADMIN_POS_COL = "adminPosSessions";

export async function createAdminPosSession({
  cashierUserId,
  customerName,
  items,
  total,
  paymentMethod,
}) {
  const ref = await addDoc(collection(db, ADMIN_POS_COL), {
    cashierUserId: cashierUserId || null,
    customerName: customerName || null,
    items,
    total,
    paymentMethod: paymentMethod || "cash",
    status: "completed",
    createdAt: serverTimestamp(),
  });

  // Reduce stock for each item in this POS sale.
  await Promise.all(
    (items || []).map((item) =>
      reduceStock(item.productId, item.quantity, cashierUserId || null, ref.id),
    ),
  );

  return { id: ref.id };
}

export async function getAdminPosSessions() {
  const snap = await getDocs(collection(db, ADMIN_POS_COL));
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

