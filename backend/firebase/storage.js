import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import { storage } from "./firebaseConfig.js";

export const getProductImagePath = (productId, filename) =>
  `product-images/${productId}/${filename}`;

export const getProfileImagePath = (userId, filename) =>
  `profile-images/${userId}/${filename}`;

export async function uploadFile(path, file) {
  const storageRef = ref(storage, path);
  const snapshot = await uploadBytes(storageRef, file);
  const url = await getDownloadURL(snapshot.ref);
  return { url, path };
}

export async function deleteFile(path) {
  const storageRef = ref(storage, path);
  await deleteObject(storageRef);
}

