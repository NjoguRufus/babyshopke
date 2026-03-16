import { uploadFile, getProductImagePath, getProfileImagePath } from "../firebase/storage.js";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig.js";

const PRODUCTS_COL = "products";
const USERS_COL = "users";

export async function uploadProductImage(file, productId) {
  const path = getProductImagePath(productId, file.name);
  const { url } = await uploadFile(path, file);

  const ref = doc(db, PRODUCTS_COL, productId);
  await updateDoc(ref, {
    images: url
      ? (prev) => (Array.isArray(prev) ? [...prev, url] : [url])
      : [],
  });

  return url;
}

export async function uploadProfileImage(file, userId) {
  const path = getProfileImagePath(userId, file.name);
  const { url } = await uploadFile(path, file);

  const ref = doc(db, USERS_COL, userId);
  await updateDoc(ref, {
    profileImage: url,
  });

  return url;
}

