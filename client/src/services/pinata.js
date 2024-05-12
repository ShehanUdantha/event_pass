const key = import.meta.env.VITE_PINATA_API_KEY;
const secret = import.meta.env.VITE_PINATA_SECRECT_KEY;
const jwt = import.meta.env.VITE_PINATA_JWT;

import axios from 'axios';
import FormData from 'form-data';
import { pinataUrl, pinJsonUrl, pinFileUrl } from "../constants";

export const uploadJSONToIPFS = async (jsonBody, jsonName) => {

  //making axios POST request to Pinata
  return axios
    .post(pinJsonUrl, {
      pinataMetadata: {
        name: `${jsonName}`
      },
      pinataContent: jsonBody
    }, {
      headers: {
        pinata_api_key: key,
        pinata_secret_api_key: secret,
      }
    })
    .then(function (response) {
      return {
        success: true,
        pinataURL: pinataUrl + response.data.IpfsHash
      };
    })
    .catch(function (error) {
      console.log(error)
      return {
        success: false,
        message: error.message,
      }
    });
};

export const uploadFileToIPFS = async (file, folder, fileName) => {

  //making axios POST request to Pinata
  let data = new FormData();
  data.append('file', file, `${folder}/${fileName}`);

  const metadata = JSON.stringify({
    name: `${folder}`,
    keyvalues: {
      exampleKey: 'eventPassValue'
    }
  });
  data.append('pinataMetadata', metadata);

  //pinataOptions are optional
  const pinataOptions = JSON.stringify({
    cidVersion: 0,
    customPinPolicy: {
      regions: [
        {
          id: 'FRA1',
          desiredReplicationCount: 1
        },
        {
          id: 'NYC1',
          desiredReplicationCount: 2
        }
      ]
    }
  });
  data.append('pinataOptions', pinataOptions);

  return axios
    .post(pinFileUrl, data, {
      maxBodyLength: 'Infinity',
      headers: {
        'Content-Type': `multipart/form-data; boundary=${data._boundary}`,
        Authorization: `Bearer ${jwt}`,
        pinata_api_key: key,
        pinata_secret_api_key: secret,
      }
    })
    .then(function (response) {
      return {
        success: true,
        pinataURL: pinataUrl + response.data.IpfsHash + `/${fileName}`
      };
    })
    .catch(function (error) {
      console.log(error)
      return {
        success: false,
        message: error.message,
      }
    });
};