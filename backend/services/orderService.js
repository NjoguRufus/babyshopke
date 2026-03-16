import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  updateDoc,
  where,
  writeBatch,
} from "firebase/firestore";
import { db } from "../firebase/firebaseConfig.js";
import { getCart, clearCart } from "./cartService.js";
import { generateOrderNumber } from "../utils/orderNumber.js";
import { reduceStock } from "./inventoryService.js";

const ORDERS_COL = "orders";

export async function createOrder(userId, shippingAddress, paymentMethod, notes) {
  const cart = await getCart(userId);
  if (!cart.items || cart.items.length === 0) {
    throw new Error("Cart is empty");
  }

  // Basic totals
  const subtotal = cart.items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
  const shippingFee = 0; // placeholder flat fee logic
  const discountAmount = 0;
  const totalAmount = subtotal + shippingFee - discountAmount;

  const orderNumber = generateOrderNumber();
  const now = new Date();

  // Use batch for atomic order creation + stock reduction snapshot.
  const batch = writeBatch(db);
  const orderRef = doc(collection(db, ORDERS_COL));

  batch.set(orderRef, {
    userId,
    familyAccountId: null,
    orderNumber,
    status: "pending",
    paymentStatus: "pending",
    fulfillmentStatus: "unfulfilled",
    subtotal,
    shippingFee,
    discountAmount,
    totalAmount,
    currency: "KES",
    items: cart.items.map((i) => ({
      productId: i.productId,
      sku: i.sku,
      name: i.name,
      price: i.price,
      quantity: i.quantity,
      total: i.price * i.quantity,
    })),
    shippingAddress,
    notes: notes || null,
    createdAt: now,
    updatedAt: now,
  });

  // Commit order document
  await batch.commit();

  // Reduce stock per item (separate to keep example simple).
  await Promise.all(
    cart.items.map((item) =>
      reduceStock(item.productId, item.quantity, userId, orderRef.id),
    ),
  );

  // Clear cart after successful order
  await clearCart(userId);

  const snap = await getDoc(orderRef);
  return { id: snap.id, ...snap.data() };
}

export async function getOrderById(orderId) {
  const ref = doc(db, ORDERS_COL, orderId);
  const snap = await getDoc(ref);
  if (!snap.exists()) return null;
  return { id: snap.id, ...snap.data() };
}

export async function getOrdersByUser(userId) {
  const q = query(collection(db, ORDERS_COL), where("userId", "==", userId));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

export async function getAllOrders() {
  const snap = await getDocs(collection(db, ORDERS_COL));
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

export async function updateOrderStatus(orderId, status) {
  const ref = doc(db, ORDERS_COL, orderId);
  await updateDoc(ref, {
    status,
    updatedAt: new Date(),
  });
  const snap = await getDoc(ref);
  return { id: snap.id, ...snap.data() };
}

export async function updatePaymentStatus(orderId, paymentStatus) {
  const ref = doc(db, ORDERS_COL, orderId);
  await updateDoc(ref, {
    paymentStatus,
    updatedAt: new Date(),
  });
  const snap = await getDoc(ref);
  return { id: snap.id, ...snap.data() };
}

