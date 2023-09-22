/* 
####################################################################################################################
#  Author:  Guillermo Escobar <
#  Date:    2023-09-21
#  Purpose: This script merges two CSV files into a new CSV file 
#####################################################################################################################
*/
'use strict'
const axios = require('axios');
const csv = require('csvtojson')
const fs = require('fs');
const config = require('./config');
const { promisify } = require('util');

const mix = async (listpianoUsrs) => {
  try {
    const [fileAData, fileBData] = await Promise.all([
      csv().fromFile(config.fileA),
      csv().fromFile(config.fileB),
    ]);

    const merge = fileAData.reduce((aux, fileA) => {
      const fileB = fileBData.find((row) => row.user_id === fileA.user_id);
      const pianoUsr = listpianoUsrs.find((user) => user.email === fileA.email);

      aux.push({
        user_id: pianoUsr?.uid ?? fileA.user_id,
        email: fileA.email,
        first_name: fileB?.first_name,
        last_name: fileB?.last_name,
      });

      return aux;
    }, []);

    return merge;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

async function getUsrListPiano() {
  try {
    const apiUrl = "https://sandbox.piano.io/api/v3/publisher/user/list?aid=" + config.aid + "&api_token=" + config.token;
    const response = await axios.get(`${apiUrl}`)
    const userList = response.data.users;
    if (response.data.code) throw new Error(`Something happened, code: ${response.data.code}`);
    return userList;
  } catch (err) {
    throw err;
  }
};

const convCsv = async (data, filename = 'report', inter = ',') => {
  try {
    const items = data;
    const replacer = (key, value) => {
      if (typeof value === 'string') { 
        return value.replace(/"/g, '""');
      }
      return value;
    }

    const title = Object.keys(items[0]);
    inter = inter || ',';

    const csv = [
      title.join(inter),
      ...items.map((row) =>
        title.map((fieldName) => JSON.stringify(row[fieldName], replacer)).join(inter)
      ),
    ].join('\r\n');

    const outputFinal = promisify(fs.writeFile);
    await outputFinal(`./${filename}.csv`, csv);
    console.log("");
    console.log("*************************************************");
    console.log("*   END OF RUN: output ---> mergedFile_JS.csv   *");
    console.log("*************************************************");
    console.log("");
  } catch (error) {
    console.error(error);
    throw error;
  }
};

(async () => {
  try {
    const response = await getUsrListPiano(config.aid, config.token);
    const mixdList = await mix(response);
    await convCsv(mixdList, "mergedFile_JS", ",");
  } catch (error) {
    console.error(error);
    throw error;
  }
})();