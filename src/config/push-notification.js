const admin = require('firebase-admin');

const serviceAccount = require('./rv-push-notification-firebase-adminsdk-fbsvc-67ceef3490.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

function sendToOneUser(fcmToken, title, body) {
  const message = {
    notification: {
      title: title,
      body: body,
    },
    token: fcmToken,
  };

  admin
    .messaging()
    .send(message)
    .then((response) => {
      console.log('Successfully sent to one user:', response);
    })
    .catch((error) => {
      console.error('Error sending to one user:', error);
    });
}

function sendToMultipleUsers(data) {
  data.forEach((ele) => {
    const message = {
      notification: {
        title: ele.title,
        body: ele.body,
      },
      token: ele.token,
    };
    admin
      .messaging()
      .send(message)
      .then((response) => {
        console.log('Successfully sent to one user:', response);
      })
      .catch((error) => {
        console.error('Error sending to one user:', error);
      });
  });
}

module.exports = { sendToOneUser, sendToMultipleUsers };
