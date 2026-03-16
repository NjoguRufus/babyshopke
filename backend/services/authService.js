import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import {
  doc,
  getDoc,
  setDoc,
  serverTimestamp,
} from "firebase/firestore";
import { auth, db } from "../firebase/firebaseConfig.js";
import { USER_ROLES } from "../config/roleConstants.js";

const USERS_COL = "users";

export async function loginUser(email, password) {
  const cred = await signInWithEmailAndPassword(auth, email, password);
  const authUser = cred.user;
  await ensureUserProfile(authUser);
  return authUser;
}

export async function logoutUser() {
  await signOut(auth);
}

export function listenToAuthState(callback) {
  return onAuthStateChanged(auth, callback);
}

export async function getCurrentUserProfile() {
  const user = auth.currentUser;
  if (!user) return null;
  const ref = doc(db, USERS_COL, user.uid);
  const snap = await getDoc(ref);
  if (!snap.exists()) return null;
  return { id: snap.id, ...snap.data() };
}

export async function createUserProfile(authUser, extraData = {}) {
  const ref = doc(db, USERS_COL, authUser.uid);
  const now = serverTimestamp();
  const profile = {
    fullName: authUser.displayName || extraData.fullName || authUser.email || "",
    email: authUser.email,
    phone: extraData.phone || "",
    role: extraData.role || USER_ROLES.CUSTOMER,
    isActive: true,
    familyAccountId: extraData.familyAccountId || null,
    profileImage: extraData.profileImage || null,
    createdAt: now,
    updatedAt: now,
  };
  await setDoc(ref, profile, { merge: true });
  return { id: ref.id, ...profile };
}

async function ensureUserProfile(authUser) {
  const ref = doc(db, USERS_COL, authUser.uid);
  const snap = await getDoc(ref);
  if (snap.exists()) return;
  await createUserProfile(authUser, {});
}

