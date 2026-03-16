import { serverTimestamp } from "firebase/firestore";

export const createdAt = () => serverTimestamp();
export const updatedAt = () => serverTimestamp();

