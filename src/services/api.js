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

/* LOCAL FALLBACK STORAGE FOR DEMO / OFFLINE MODE */
const LOCAL_STORAGE_KEY = "social_scheduler_local_posts";

const getLocalPosts = () => {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

const saveLocalPosts = (posts) => {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(posts));
  } catch (err) {
    console.error("Failed to save to localStorage:", err);
  }
};

/* CREATE POST */
export const savePost = async (post) => {
  const newPost = {
    ...post,
    id: `post-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    status: post.status || "Upcoming",
    views: 0,
    createdAt: new Date().toISOString(),
  };

  try {
    const docRef = await addDoc(postsRef, newPost);
    newPost.id = docRef.id;
  } catch (err) {
    console.warn("Firestore save error, saving locally:", err);
  }

  const local = getLocalPosts();
  saveLocalPosts([newPost, ...local]);
  return newPost;
};

export const fetchPosts = async () => {
  try {
    const snap = await getDocs(postsRef);
    const remotePosts = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    const localPosts = getLocalPosts();
    // Merge remote and local posts without duplicates
    const all = [...remotePosts];
    localPosts.forEach((lp) => {
      if (!all.some((p) => p.id === lp.id)) {
        all.push(lp);
      }
    });
    return all;
  } catch (err) {
    console.warn("Firestore fetch error, returning local posts:", err);
    return getLocalPosts();
  }
};

export const deletePost = async (id) => {
  try {
    await deleteDoc(doc(db, "posts", id));
  } catch (err) {
    console.warn("Firestore delete error:", err);
  }
  const local = getLocalPosts().filter((p) => p.id !== id);
  saveLocalPosts(local);
};

export const incrementViews = async (id) => {
  try {
    await updateDoc(doc(db, "posts", id), {
      views: increment(1),
    });
  } catch (err) {
    console.warn("Firestore incrementViews error:", err);
  }

  const local = getLocalPosts().map((p) =>
    p.id === id ? { ...p, views: (p.views || 0) + 1 } : p
  );
  saveLocalPosts(local);
};
