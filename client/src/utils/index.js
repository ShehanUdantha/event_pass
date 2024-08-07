export const separateCurrentDateTime = () => {
  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = String(currentDate.getMonth() + 1).padStart(2, '0');
  const day = String(currentDate.getDate()).padStart(2, '0');
  const hours = String(currentDate.getHours()).padStart(2, '0');
  const minutes = String(currentDate.getMinutes()).padStart(2, '0');

  const separatedDateTime = {
    date: `${year}-${month}-${day}`,
    time: `${hours}:${minutes}`
  };
  return separatedDateTime;
}

export const calculateRemainingTime = (startedDate) => {
  if (startedDate) {
    const start = new Date();
    const end = new Date(startedDate);

    // calculate the difference in milliseconds
    const difference = end - start;

    // convert milliseconds to days, hours, minutes, and seconds
    const daysRemaining = Math.floor(difference / (1000 * 60 * 60 * 24));
    const hoursRemaining = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutesRemaining = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
    const secondsRemaining = Math.floor((difference % (1000 * 60)) / 1000);

    if (daysRemaining <= 0 && hoursRemaining <= 0 && minutesRemaining <= 0 && secondsRemaining <= 0) {
      return "Expired";
    }

    return daysRemaining + ' days ' + hoursRemaining + ' hours ' + minutesRemaining + ' minutes ' + secondsRemaining + ' seconds';
  } else {
    return "0";
  }
};

export const formatDateAndTime = (inputDate) => {
  const parsedDateTime = new Date(inputDate);

  const options = { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: 'numeric' };
  const formattedDateTime = parsedDateTime.toLocaleDateString('en-US', options);
  return formattedDateTime;
}

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

  // format the time as HH:mm
  return `${hours.toString().padStart(2, "0")}:${minutes
    .toString()
    .padStart(2, "0")}`;
}

export function convertBigNumberToDate(bigNumber) {
  // convert the big number to a regular number
  const timestamp = Number(bigNumber);

  if (isNaN(timestamp)) {
    return "Invalid timestamp";
  }

  const date = new Date(timestamp);
  const formattedDate = date.toLocaleString();

  return formattedDate;
}

export function convertBigNumberToInt(bigNumber) {
  // convert the big number to an integer
  const intValue = parseInt(bigNumber, 10);

  if (isNaN(intValue)) {
    console.error("Conversion to integer failed");
    return null;
  }

  return intValue;
}

export const getUrlParams = (url) => {
  const urlParts = url.toString().split('/');
  const address = urlParts[4];
  const eventId = parseInt(urlParts[5]);
  const ticketId = parseInt(urlParts[6]);

  return {
    address,
    eventId,
    ticketId
  };
};

export const convertWeiToEth = (weiValue) => {
  const wei = parseFloat(weiValue);
  if (!isNaN(wei)) {
    const eth = wei / 10 ** 18; // 1 Ether = 10^18 Wei
    return eth.toFixed(6);
  } else {
    return "0.0";
  }
};

export const calculateTimeAgo = (timestamp) => {
  const currentTime = new Date();
  const previousTime = new Date(parseInt(timestamp, 10));
  const timeDifference = currentTime - previousTime;
  const minutes = Math.floor(timeDifference / 60000);

  if (minutes < 1) {
    return 'Just now';
  } else if (minutes < 60) {
    return `${minutes}m ago`;
  } else {
    const hours = Math.floor(minutes / 60);
    if (hours < 24) {
      return `${hours}h ago`;
    } else {
      const days = Math.floor(hours / 24);
      if (days < 7) {
        return `${days}d ago`;
      } else {
        const weeks = Math.floor(days / 7);
        return `${weeks}w ago`;
      }
    }
  }
};

export const dataURItoBlob = (dataURI) => {
  const byteString = atob(dataURI.split(',')[1]);
  const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
  const arrayBuffer = new ArrayBuffer(byteString.length);
  const uintArray = new Uint8Array(arrayBuffer);

  for (let i = 0; i < byteString.length; i++) {
    uintArray[i] = byteString.charCodeAt(i);
  }

  return new Blob([arrayBuffer], { type: mimeString });
};

export const generateJson = (url, colorName) => {
  return {
    "name": "Sketch Robot",
    "description": "A unique NFT featuring a sketched image of a robot with intricate design details, created by an EventPass.",
    "image": url,
    "attributes": [
      {
        "trait_type": "Style",
        "value": "Sketch"
      },
      {
        "trait_type": "Complexity",
        "value": "Detailed"
      },
      {
        "trait_type": "Color",
        "value": `${colorName}`
      }
    ]
  };
};

export const generateRandomRGB = () => {
  const r = Math.floor(Math.random() * 256);
  const g = Math.floor(Math.random() * 256);
  const b = Math.floor(Math.random() * 256);
  return `rgb(${r}, ${g}, ${b})`;
}

export const calculatePercentage = (ticketAmount, ticketSold) => {
  ticketAmount = Number(ticketAmount);
  ticketSold = Number(ticketSold);

  const percentage = (ticketSold / ticketAmount) * 100;

  return percentage;
}

export const getDateList = () => {
  const dateList = [];
  const today = new Date();
  // loop from today to 6 days back
  for (let i = 6; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    dateList.push(date.toISOString().slice(0, 10)); // push date in YYYY-MM-DD format
  }

  return dateList;
}

export const formatDate = (date) => {
  return date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();
}

export const countTicketsByDate = (tickets, type) => {
  const dateList = getDateList();

  // create an array to store the count of tickets for each date
  const ticketCounts = [];

  // loop through each date in dateList
  for (let i = 0; i < dateList.length; i++) {
    const date = new Date(dateList[i]);

    // count the tickets within the date range
    const count = tickets.filter(ticket => {
      const getTimestamp = type === 1 ? ticket.timestamp : type === 2 ? ticket.verifiedTimestamp : type === 3 ? ticket.refundTimestamp : ticket.timestamp;
      const ticketBigNumberDate = convertBigNumberToDate(getTimestamp);
      const ticketDate = new Date(ticketBigNumberDate);
      const ticketDateString = formatDate(ticketDate);
      const dateString = formatDate(date);

      return ticketDateString === dateString;
    }).length;

    // add the count to ticketCounts array
    ticketCounts.push(count);
  }

  return ticketCounts;
}