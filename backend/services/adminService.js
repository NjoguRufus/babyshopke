import { collection, getDocs, doc, getDoc, setDoc, serverTimestamp, limit, orderBy, query } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig.js";
import { getUsers } from "./userService.js";
import { getProducts } from "./productService.js";
import { getLowStockProducts } from "./inventoryService.js";
import { getAllOrders } from "./orderService.js";
import { getTransactions } from "./transactionService.js";
import { getFamilyAccounts } from "./familyService.js";

const ACTIVITY_LOGS_COL = "activityLogs";
const ADMIN_SETTINGS_COL = "adminSettings";
const ADMIN_SETTINGS_DOC_ID = "system";

export async function getDashboardStats() {
  const [users, products, orders, transactions, lowStock, families] = await Promise.all([
    getUsers(),
    getProducts(),
    getAllOrders(),
    getTransactions(),
    getLowStockProducts().catch(() => []),
    getFamilyAccounts(),
  ]);

  const totalRevenue = transactions
    .filter((t) => t.status === "success" || t.status === "paid")
    .reduce((sum, t) => sum + (t.amount || 0), 0);

  return {
    totalUsers: users.length,
    totalProducts: products.length,
    totalOrders: orders.length,
    pendingOrders: orders.filter((o) => o.status === "pending").length,
    deliveredOrders: orders.filter((o) => o.status === "delivered").length,
    lowStockProducts: lowStock.length,
    totalRevenue,
    totalTransactions: transactions.length,
    totalFamilies: families.length,
  };
}

export async function getRecentOrders(limitCount = 10) {
  const orders = await getAllOrders();
  const sorted = [...orders].sort((a, b) => {
    const ta = a.createdAt?.toMillis?.() ?? (a.createdAt ? new Date(a.createdAt).getTime() : 0);
    const tb = b.createdAt?.toMillis?.() ?? (b.createdAt ? new Date(b.createdAt).getTime() : 0);
    return tb - ta;
  });
  return sorted.slice(0, limitCount);
}

export async function getRecentActivities(limitCount = 20) {
  try {
    const col = collection(db, ACTIVITY_LOGS_COL);
    const q = query(col, orderBy("createdAt", "desc"), limit(limitCount));
    const snap = await getDocs(q);
    return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
  } catch (e) {
    return [];
  }
}

export async function getActivityLogs() {
  const snap = await getDocs(collection(db, ACTIVITY_LOGS_COL));
  const list = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
  list.sort((a, b) => {
    const ta = a.createdAt?.toMillis?.() ?? (a.createdAt ? new Date(a.createdAt).getTime() : 0);
    const tb = b.createdAt?.toMillis?.() ?? (b.createdAt ? new Date(b.createdAt).getTime() : 0);
    return tb - ta;
  });
  return list;
}

export async function getSystemSettings() {
  const ref = doc(db, ADMIN_SETTINGS_COL, ADMIN_SETTINGS_DOC_ID);
  const snap = await getDoc(ref);
  if (!snap.exists()) {
    return {
      allowOrders: true,
      allowReviews: true,
      allowRegistrations: true,
      defaultCurrency: "KES",
      lowStockAlertsEnabled: true,
      updatedAt: null,
    };
  }
  return { id: snap.id, ...snap.data() };
}

export async function toggleSystemSetting(settingKey, value) {
  const ref = doc(db, ADMIN_SETTINGS_COL, ADMIN_SETTINGS_DOC_ID);
  const current = await getSystemSettings();
  const updates = { ...current, [settingKey]: value, updatedAt: serverTimestamp() };
  delete updates.id;
  await setDoc(ref, updates, { merge: true });
  return { ...current, [settingKey]: value };
}
