import {
  doc,
  getDoc,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";
import { db } from "../firebase/firebaseConfig.js";

const CARTS_COL = "carts";

/** Remove undefined from cart item so Firestore accepts it */
function sanitizeCartItem(item) {
  const out = {};
  for (const [k, v] of Object.entries(item)) {
    if (v !== undefined) out[k] = v;
  }
  return out;
}

export async function getCart(userId) {
  const ref = doc(db, CARTS_COL, userId);
  const snap = await getDoc(ref);
  if (!snap.exists()) {
    return { userId, items: [], updatedAt: null };
  }
  return { id: snap.id, ...snap.data() };
}

export async function addToCart(userId, item) {
  const cart = await getCart(userId);
  const existing = cart.items.find((i) => i.productId === item.productId);
  let items;
  if (existing) {
    items = cart.items.map((i) =>
      i.productId === item.productId ? { ...i, quantity: i.quantity + item.quantity } : i,
    );
  } else {
    items = [...cart.items, item];
  }
  const ref = doc(db, CARTS_COL, userId);
  const sanitizedItems = items.map(sanitizeCartItem);
  await setDoc(
    ref,
    {
      userId,
      items: sanitizedItems,
      updatedAt: serverTimestamp(),
    },
    { merge: true },
  );
  const snap = await getDoc(ref);
  return { id: snap.id, ...snap.data() };
}

export async function updateCartItem(userId, productId, quantity) {
  const cart = await getCart(userId);
  const items = cart.items
    .map((i) => (i.productId === productId ? { ...i, quantity } : i))
    .filter((i) => i.quantity > 0);
  const ref = doc(db, CARTS_COL, userId);
  const sanitizedItems = items.map(sanitizeCartItem);
  await setDoc(
    ref,
    {
      userId,
      items: sanitizedItems,
      updatedAt: serverTimestamp(),
    },
    { merge: true },
  );
  const snap = await getDoc(ref);
  return { id: snap.id, ...snap.data() };
}

export async function removeFromCart(userId, productId) {
  const cart = await getCart(userId);
  const items = cart.items.filter((i) => i.productId !== productId);
  const ref = doc(db, CARTS_COL, userId);
  const sanitizedItems = items.map(sanitizeCartItem);
  await setDoc(
    ref,
    {
      userId,
      items: sanitizedItems,
      updatedAt: serverTimestamp(),
    },
    { merge: true },
  );
  const snap = await getDoc(ref);
  return { id: snap.id, ...snap.data() };
}

export async function clearCart(userId) {
  const ref = doc(db, CARTS_COL, userId);
  await setDoc(
    ref,
    {
      userId,
      items: [],
      updatedAt: serverTimestamp(),
    },
    { merge: true },
  );
  const snap = await getDoc(ref);
  return { id: snap.id, ...snap.data() };
}

