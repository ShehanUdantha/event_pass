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