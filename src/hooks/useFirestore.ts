import {
  doc,
  setDoc,
  Timestamp,
  getDoc,
  updateDoc,
  DocumentSnapshot,
  DocumentData,
  arrayRemove,
} from "firebase/firestore";
import { db } from "../services/firebase";
import toast from "react-hot-toast";
import {
  AddNewJobFieldValues,
  Job,
  UserAuth,
  UserFirestoreDocData,
} from "../types";
import { generateJobID } from "../utils";

export async function getFirestoreDocumentSnapshot(userEmail: string) {
  const docRef = doc(db, "users", userEmail);
  const docSnap = await getDoc(docRef);

  return docSnap;
}

export async function isFirstAccessUser(
  docSnap: DocumentSnapshot<DocumentData>
) {
  if (docSnap.exists()) {
    const docData = docSnap.data() as UserFirestoreDocData;
    const docProfile = docData.profile;

    if (Object.keys(docProfile).length == 0) {
      return true;
    } else {
      return false;
    }
  }
}

export async function createNewUserDocumentInFirestore(userEmail: string) {
  try {
    if (userEmail) {
      const docRef = doc(db, "users", userEmail);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        await setDoc(doc(db, "users", userEmail), {
          profile: {},
          jobs: [],
        });

        return "firstAccess";
      } else {
        return "normalAccess";
      }
    }
  } catch (error) {
    console.log("Error adding document: ", error);
    toast.error("Erro ao tentar criar base de dados para este usuário..!");
  }
}

export async function addJob(
  user: UserAuth,
  title: string,
  dailyHours: number,
  totalHours: number
) {
  try {
    if (user.email) {
      const docRef = doc(db, "users", user.email);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const currentData = docSnap.data() as UserFirestoreDocData;
        const currentJobs = currentData.jobs;

        await updateDoc(docRef, {
          jobs: [
            ...currentJobs,
            {
              id: generateJobID(),
              title: title,
              dailyHours: Number(dailyHours),
              totalHours: Number(totalHours),
              createdAt: Timestamp.now(),
            },
          ],
        }).catch((error) => console.error(error));
      }
    }
  } catch (error) {
    console.error(error);
    toast.error("Erro ao tentar adicionar novo job.!");
  }
}

export async function removeJob(user: UserAuth, job: Job) {
  if (user?.email) {
    const docRef = doc(db, "users", user.email);

    await updateDoc(docRef, {
      jobs: arrayRemove(job),
    }).catch((error) => console.error(error));
  }
}

export async function editJob(
  user: UserAuth,
  allJobs: Job[],
  currentJob: Job,
  newValues: AddNewJobFieldValues
) {
  if (allJobs) {
    const jobToBeEdited = allJobs.find((item) => item.id == currentJob.id);
    const remainingJobs = allJobs.filter((item) => item.id != currentJob.id);

    if (jobToBeEdited && remainingJobs) {
      jobToBeEdited.title = newValues.title;
      jobToBeEdited.dailyHours = Number(newValues.dailyHours);
      jobToBeEdited.totalHours = Number(newValues.totalHours);

      remainingJobs.push(jobToBeEdited);

      if (user?.email) {
        const docRef = doc(db, "users", user.email);

        await updateDoc(docRef, {
          jobs: remainingJobs,
        });
      }
    }
  }
}
