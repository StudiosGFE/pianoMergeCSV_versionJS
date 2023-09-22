 __![Alt text](image.png)__

# Interview Assessment
<br>

### Author:  Guillermo Escobar

- Date: `September 2023`
- javaScript  
- script name: piano_MixJS.js 
- input: fileA.csv, fileB.csv, Piano API data 
- output: mergedFile_JS.csv 



### Purpose:

This script merges two CSV files into a new CSV file.
The client has provided 2 csv files with user data that they would like to import to the system. However some user IDs are incorrect because these users already exist in the system under different user_id values. Generate a merged file in the format: user_id,email,first_name,last_name
But make sure that for the incorrect records, user_id is taken from the system, rather than from the list provided from the client.

### Install Dependences :
```
npm install
```

### Run:
```
node mixPiano.js  /  npm start
```