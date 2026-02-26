import { db } from "../firebase";
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
  increment,
} from "firebase/firestore";

const postsRef = collection(db, "posts");

/* CREATE POST */
export const savePost = async (post) => {
  await addDoc(postsRef, {
    ...post,
    status: "Upcoming",
    views: 0,
    createdAt: new Date(),
  });
};
export const fetchPosts = async () => {
  const snap = await getDocs(postsRef);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
};
export const deletePost = async (id) => {
  await deleteDoc(doc(db, "posts", id));
};
export const incrementViews = async (id) => {
  await updateDoc(doc(db, "posts", id), {
    views: increment(1),
  });
};
