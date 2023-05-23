const { google } = require('googleapis');
const credentials = require('./oauth.json');

// Create an OAuth2 client
const client = new google.auth.OAuth2(
  credentials.web.client_id,
  credentials.web.client_secret,
  credentials.web.redirect_uris[0]
);


// Set the credentials and access token
client.setCredentials({
  refresh_token: credentials.web.refresh_token
});

// Fetch data from the Google Spreadsheet
async function fetchSpreadsheetData() {
  try {
    const sheets = google.sheets({ version: 'v4', auth: client });

    // Specify the spreadsheet ID and range
    const spreadsheetId = '1doF3_1VhHOLCVw-7ofb2M6tz-nxbZBSVrEF-p-zRv1g';
    const range = 'Sheet1!B:O'; // Example range, change it to match your data

    // Get the values from the specified range
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range,
    });

    const rows = response.data.values;

    // Process the data as needed
    if (rows.length > 1) { // Check if there are rows excluding the header
      // Convert the rows to JSON format, starting from the second row
      const jsonData = rows.slice(1).map((row) => {
        return {
          employee_full_name: row[0] || '',
          job_title: row[1] || '',
          phone_number: row[2] || '',
          email: row[3] || '',
          address: row[4] || '',
          city: row[5] || '',
          state: row[6] || '',
          primary_emergency_contact: row[7] || '',
          primary_emergency_phone_number: row[8] || '',
          primary_emergency_relationship: row[9] || '',
          secondary_emergency_contact: row[10] || '',
          secondary_emergency_phone_number: row[11] || '',
          secondary_emergency_relationship: row[12] || '',
          timestamp: row[13] || '',
          // Add more properties as needed for each column
        };
      });
      // console.log(jsonData);
      return jsonData;
    }  else {
      console.log('No data found.');
      return {};
    }
  } catch (error) {
    console.error('Error retrieving data:', error);
  }
}

// Call the fetchSpreadsheetData function to fetch data
fetchSpreadsheetData();

module.exports = fetchSpreadsheetData;