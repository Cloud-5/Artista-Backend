const admin = require('firebase-admin');
const serviceAccount = require('./angular-chat-c21c3-firebase-adminsdk-59enp-6a83075340.json'); // Replace with the actual path

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  // Optional: Specify the database URL if you're using the Realtime Database
  //  databaseURL: 'https://<your-database-name>.firebaseio.com'
});

module.exports = admin;
