import { auth, db } from "./firebase";
import {
  doc,
  setDoc,
  getDoc,
  collection,
  getDocs,
  addDoc,
  deleteDoc,
  serverTimestamp
} from "firebase/firestore";

export function requireUid(): string {
  const u = auth.currentUser;
  if (!u?.uid) throw new Error("Not logged in");
  return u.uid;
}

/** Creates users/{uid} if missing (plan starts as free) */
export async function ensureUserDoc() {
  const u = auth.currentUser;
  if (!u?.uid) return;

  const ref = doc(db, "users", u.uid);
  const snap = await getDoc(ref);

  if (!snap.exists()) {
    await setDoc(ref, {
      plan: "free",
      email: u.email ?? null,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    }, { merge: true });
  }
}

/** --- Labs (custom labs) --- */
export async function loadCustomLabs() {
  const uid = requireUid();
  const labsRef = collection(db, "users", uid, "labs_custom");
  const snap = await getDocs(labsRef);
  return snap.docs.map(d => ({ id: d.id, ...d.data() })) as any[];
}

export async function addCustomLab(lab: any) {
  const uid = requireUid();
  const labsRef = collection(db, "users", uid, "labs_custom");
  const docRef = await addDoc(labsRef, {
    ...lab,
    updatedAt: serverTimestamp(),
    createdAt: serverTimestamp()
  });
  return docRef.id;
}

export async function deleteCustomLab(labId: string) {
  const uid = requireUid();
  await deleteDoc(doc(db, "users", uid, "labs_custom", labId));
}

/** --- Research draft (single draft) --- */
export async function loadResearchDraft() {
  const uid = requireUid();
  const ref = doc(db, "users", uid, "drafts", "research");
  const snap = await getDoc(ref);
  return snap.exists() ? snap.data() : null;
}

export async function saveResearchDraft(data: any) {
  const uid = requireUid();
  const ref = doc(db, "users", uid, "drafts", "research");
  await setDoc(ref, { ...data, updatedAt: serverTimestamp() }, { merge: true });
}

/** --- Neural progress (single doc) --- */
export async function loadNeuralProgress() {
  const uid = requireUid();
  const ref = doc(db, "users", uid, "drafts", "neural");
  const snap = await getDoc(ref);
  return snap.exists() ? snap.data() : null;
}

export async function saveNeuralProgress(data: any) {
  const uid = requireUid();
  const ref = doc(db, "users", uid, "drafts", "neural");
  await setDoc(ref, { ...data, updatedAt: serverTimestamp() }, { merge: true });
}

