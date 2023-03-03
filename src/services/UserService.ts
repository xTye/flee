import {
  collection,
  doc as docRef,
  getDoc,
  getDocs,
  updateDoc,
  addDoc,
  setDoc,
} from "firebase/firestore";
import { firebaseStore } from "..";
import { UserInterface } from "../types/UserType";
import { SessionActions } from "../auth/Session";

export const useFetchUser = async (id: string) => {
  try {
    const doc = await getDoc(docRef(firebaseStore, "users", id));

    const data = doc.data() as UserInterface;
    if (!data) return;

    const user: UserInterface = {
      ...data,
      id: doc.id,
    };

    return user;
  } catch (e) {
    console.log(e);
  }
};

export const useFetchUsers = async () => {
  try {
    const docs = await getDocs(collection(firebaseStore, "users"));

    const users: UserInterface[] = [];

    docs.forEach((doc) => {
      const data = doc.data() as UserInterface;

      const user: UserInterface = {
        ...data,
        id: doc.id,
      };

      users.push(user);
    });

    return users;
  } catch (e) {
    console.log(e);
  }
};

export const useUpdateUser = async (
  id: string,
  data: UserInterface,
  actions: SessionActions
) => {
  try {
    await updateDoc(docRef(firebaseStore, "users", id), {
      tools: data.tools,
      updatedAt: new Date(),
    });

    await actions.update(data);
  } catch (e) {
    console.log(e);
  }
};

// Create user is special because all values should be default on creation.
// This is also here because we need to create a user when they sign up,
// and isn't already caught by the redirect function in the auth service.
export const useCreateUser = async (id: string) => {
  try {
    const user = await useFetchUser(id);
    if (user) return;

    await setDoc(docRef(firebaseStore, "users", id), {
      tools: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  } catch (e) {
    console.log(e);
  }
};
