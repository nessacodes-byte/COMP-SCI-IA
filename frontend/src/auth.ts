import { auth, db } from "./firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  sendEmailVerification,
  updateCurrentUser,
  updateEmail,
  updatePassword,
  signInWithPopup,
  updateProfile,
  EmailAuthProvider,
  reauthenticateWithCredential,
} from "@firebase/auth";
import { doc, setDoc, getDoc } from "@firebase/firestore";
import { User, FirestoreTask, defaultProfilePicture } from "./types";
import { formatFirestoreTimestamp } from "./utils";

export const doCreateUserWithEmailAndPassword = async (
  name: string,
  email: string,
  password: string
) => {
  // Try create account with the email and password
  const userCredential = await createUserWithEmailAndPassword(
    auth,
    email,
    password
  );

  // Update user profile with name and default profile picture
  const user = userCredential.user;
  await updateProfile(user, {
    displayName: name,
    photoURL: defaultProfilePicture,
  });

  // Add more fields to the user details in firestore
  const newUser: User = {
    id: user.uid,
    email,
    name,
    profilePicture: defaultProfilePicture,
    reminderDays: 3,
    tasks: [],
  };

  // Set the information into firestore
  await changeUserInDatabase(newUser);

  // Set current user with Google Authentication
  await updateCurrentUser(auth, user);

  return newUser;
};

export const doSignInWithEmailAndPassword = async (
  email: string,
  password: string
) => {
  // Try signing in the user with email and passwords
  const userCredential = await signInWithEmailAndPassword(
    auth,
    email,
    password
  );
  const user = userCredential.user;

  // Get current user details from database
  const userDoc = await getDoc(doc(db, "users", user.uid));
  const currentUser = userDoc.data() as User;

  // Set current user with Google Authentication
  await updateCurrentUser(auth, user);

  return currentUser;
};

export const changeUserInDatabase = async (user: User) => {
  await setDoc(doc(db, "users", user.id), user);
  if (auth.currentUser) {
    await updateProfile(auth.currentUser, {
      displayName: user.name,
      photoURL: user.profilePicture,
    });
  }
};

export const doSignOut = () => {
  return auth.signOut();
};

export const doPasswordChange = async (
  oldPassword: string,
  newPassword: string
) => {
  const user = auth.currentUser;
  if (!user || !user.email) return new Promise(() => {});

  // Create credentials with the old password
  const credential = EmailAuthProvider.credential(user.email, oldPassword);

  // Reauthenticate first
  await reauthenticateWithCredential(user, credential);

  // If reauthentication succeeds, update to new password
  return updatePassword(user, newPassword);
};

export const doEmailChange = async (email: string) => {
  if (auth.currentUser) {
    return updateEmail(auth.currentUser, email);
  }
  return new Promise(() => {});
};
