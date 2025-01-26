import { Task, User } from './types';

export function addTaskToUser(task: Task, user: User) {
    // Get the current information of the user in the database (refer to doSignInWithEmailAndPassword)

    // Construct a userProfile object that has the new task appended

    // Update user information to userProfile into the database
    // await setDoc(doc(db, "users", user.uid), userProfile);
}