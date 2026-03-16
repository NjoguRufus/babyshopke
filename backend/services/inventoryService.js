import {
  addDoc,
  collection,
  doc,
  getDocs,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "../firebase/firebaseConfig.js";
import { getProductById } from "./productService.js";

const INVENTORY_TX_COL = "inventoryTransactions";
const PRODUCTS_COL = "products";

async function createInventoryTx({
  productId,
  sku,
  type,
  quantity,
  previousStock,
  newStock,
  reason,
  referenceId,
  referenceType,
  performedBy,
}) {
  const ref = await addDoc(collection(db, INVENTORY_TX_COL), {
    productId,
    sku,
    type,
    quantity,
    previousStock,
    newStock,
    reason,
    referenceId: referenceId || null,
    referenceType: referenceType || null,
    performedBy: performedBy || null,
    createdAt: serverTimestamp(),
  });
  return ref.id;
}

export async function restockProduct(productId, quantity, performedBy, reason) {
  if (quantity <= 0) throw new Error("Quantity must be positive");
  const product = await getProductById(productId);
  if (!product) throw new Error("Product not found");
  const previousStock = product.stockQty || 0;
  const newStock = previousStock + quantity;

  const productRef = doc(db, PRODUCTS_COL, productId);
  await updateDoc(productRef, { stockQty: newStock });

  await createInventoryTx({
    productId,
    sku: product.sku,
    type: "stock_in",
    quantity,
    previousStock,
    newStock,
    reason: reason || "Restock",
    referenceId: null,
    referenceType: "restock",
    performedBy,
  });
}

export async function reduceStock(productId, quantity, performedBy, referenceId) {
  if (quantity <= 0) throw new Error("Quantity must be positive");
  const product = await getProductById(productId);
  if (!product) throw new Error("Product not found");
  const previousStock = product.stockQty || 0;
  if (previousStock < quantity) {
    throw new Error("Insufficient stock");
  }
  const newStock = previousStock - quantity;

  const productRef = doc(db, PRODUCTS_COL, productId);
  await updateDoc(productRef, { stockQty: newStock });

  await createInventoryTx({
    productId,
    sku: product.sku,
    type: "stock_out",
    quantity,
    previousStock,
    newStock,
    reason: "Sale",
    referenceId: referenceId || null,
    referenceType: "order",
    performedBy,
  });
}

export async function adjustStock(productId, newQty, performedBy, reason) {
  const product = await getProductById(productId);
  if (!product) throw new Error("Product not found");
  const previousStock = product.stockQty || 0;

  const productRef = doc(db, PRODUCTS_COL, productId);
  await updateDoc(productRef, { stockQty: newQty });

  await createInventoryTx({
    productId,
    sku: product.sku,
    type: "adjustment",
    quantity: newQty - previousStock,
    previousStock,
    newStock: newQty,
    reason: reason || "Manual adjustment",
    referenceId: null,
    referenceType: "manual",
    performedBy,
  });
}

export async function getInventoryHistory(productId) {
  const q = query(collection(db, INVENTORY_TX_COL), where("productId", "==", productId));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

export async function getLowStockProducts() {
  const q = query(
    collection(db, PRODUCTS_COL),
    where("isActive", "==", true),
    where("stockQty", "<=", 5),
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

