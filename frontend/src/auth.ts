import { auth, db } from "./firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  sendEmailVerification,
  updatePassword,
  signInWithPopup,
  updateProfile,
} from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { User, FirestoreTask, defaultProfilePicture } from "./types";
import { formatFirestoreTimestamp } from "./utils";

export const doCreateUserWithEmailAndPassword = async (
  name: string,
  email: string,
  password: string
) => {
  const userCredential = await createUserWithEmailAndPassword(
    auth,
    email,
    password
  );
  const user = userCredential.user;

  await updateProfile(user, {
    displayName: name,
    photoURL: defaultProfilePicture,
  });

  const userProfile: User = {
    id: user.uid,
    email,
    name,
    profilePicture: defaultProfilePicture,
    reminderDays: 3,
    tasks: [],
  };

  await setDoc(doc(db, "users", user.uid), userProfile);

  return userProfile;
};

export const doSignInWithEmailAndPassword = async (
  email: string,
  password: string
) => {
  const userCredential = await signInWithEmailAndPassword(
    auth,
    email,
    password
  );

  const userDoc = await getDoc(doc(db, "users", userCredential.user.uid));
  const userProfile = userDoc.data() as any;

  // Format deadline of tasks to Date object
  userProfile.tasks = userProfile.tasks.map((task: FirestoreTask) => ({
    ...task,
    deadline: formatFirestoreTimestamp(task.deadline).toISOString(),
  }));

  return userProfile;
};

export const doSignOut = () => {
  return auth.signOut();
};

export const doPasswordReset = (email: string) => {
  return sendPasswordResetEmail(auth, email);
};

export const doPasswordChange = (password: string) => {
  if (auth.currentUser) {
    return updatePassword(auth.currentUser, password);
  }
};

export const doSendEmailVerification = () => {
  if (auth.currentUser) {
    return sendEmailVerification(auth.currentUser, {
      url: `${window.location.origin}/`,
    });
  }
};
