export const calculateRemainingDays = (startedDate) => {
  const start = new Date();
  const end = new Date(startedDate);

  // Calculate the difference in milliseconds
  const difference = end - start;
  // Convert milliseconds to days
  const daysRemaining = Math.ceil(difference / (1000 * 60 * 60 * 24));
  return daysRemaining;
};

export const formatDateAndTime = (inputDate) => {
  const parsedDateTime = new Date(inputDate);

  const options = { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: 'numeric' };
  const formattedDateTime = parsedDateTime.toLocaleDateString('en-US', options);
  return formattedDateTime;
}

export const checkIfImage = (url, callback) => {
  const img = new Image();
  img.src = url;

  if (img.complete) callback(true);

  img.onload = () => callback(true);
  img.onerror = () => callback(false);
};

export const updateTime = (date, time) => {
  const updatedTime = time + ":00";
  const [hours, minutes, seconds] = updatedTime.split(':');

  const updatedDateTime = new Date(date);
  updatedDateTime.setHours(parseInt(hours, 10));
  updatedDateTime.setMinutes(parseInt(minutes, 10));
  updatedDateTime.setSeconds(parseInt(seconds, 10));

  return updatedDateTime;
};

export const separateTime = (dateAndTime) => {
  const hours = dateAndTime.getHours();
  const minutes = dateAndTime.getMinutes();

  // Format the time as HH:mm
  return `${hours.toString().padStart(2, "0")}:${minutes
    .toString()
    .padStart(2, "0")}`;
}

export function convertBigNumberToDate(bigNumber) {
  // Convert the big number to a regular number
  const timestamp = Number(bigNumber);

  if (isNaN(timestamp)) {
    return "Invalid timestamp";
  }

  const date = new Date(timestamp);
  const formattedDate = date.toLocaleString();

  return formattedDate;
}

export function convertBigNumberToInt(bigNumber) {
  // Convert the big number to an integer
  const intValue = parseInt(bigNumber, 10);

  if (isNaN(intValue)) {
    console.error("Conversion to integer failed");
    return null;
  }

  return intValue;
}

