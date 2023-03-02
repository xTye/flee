import {
  collection,
  doc as docRef,
  getDoc,
  getDocs,
  updateDoc,
} from "firebase/firestore";
import { firebaseStore } from "..";
import { UserInterface } from "../types/UserType";

export const useFetchUser = async (id: string) => {
  try {
    const doc = await getDoc(docRef(firebaseStore, "users", id));

    const data = doc.data();
    if (!data) throw new Error("No data found for user.");

    const user: UserInterface = {
      id: doc.id,
      name: data.name,
      email: data.email,
      tools: data.tools,
    };

    return user;
  } catch (e: any) {
    console.error(e.message);
  }
};

export const useFetchUsers = async () => {
  try {
    const docs = await getDocs(collection(firebaseStore, "users"));

    const users: UserInterface[] = [];

    docs.forEach((doc) => {
      const data = doc.data();

      const user: UserInterface = {
        id: doc.id,
        name: data.name,
        email: data.email,
        tools: data.tools,
      };

      users.push(user);
    });

    return users;
  } catch (e: any) {
    console.error(e.message);
  }
};

export const useUpdateUser = async (id: string, data: UserInterface) => {
  try {
    const doc = await getDoc(docRef(firebaseStore, "users", id));

    if (!doc.exists()) throw new Error("No user found with that ID.");

    await updateDoc(docRef(firebaseStore, "users", id), {
      ...data,
      updatedAt: new Date(),
    });
  } catch (e: any) {
    console.error(e.message);
  }
};

export const useCreateUser = async (data: UserInterface) => {
  try {
    await updateDoc(docRef(firebaseStore, "users", data.id), {
      ...data,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  } catch (e: any) {
    console.error(e.message);
  }
};
