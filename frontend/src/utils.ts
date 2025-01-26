const formatDateToDateTimeLocal = (date: Date) => {
  // Get the local ISO string
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");

  // Format: YYYY-MM-DDThh:mm
  return `${year}-${month}-${day}T${hours}:${minutes}`;
};

export const formatDate = (date: string) => {
  return formatDateToDateTimeLocal(new Date(date));
};

export const formatFirestoreTimestamp = (date: {
  seconds: number;
  nanoseconds: number;
}) => {
  return new Date((date.seconds + date.nanoseconds * 10 ** -9) * 1000);
};

export const getFirebaseErrorMessage = (error) => {
  return error?.code?.replace("auth/", "").replace(/-/g, " ") || "";
};
