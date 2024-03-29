const jwtDecode = require('jwt-decode');
const webpush = require('web-push');
const notification = require('../utils/mongoose/mongooseScheme');
let configuration = {};
try {
  configuration = require('../../config.json');
} catch {
  console.log(configuration);
}
const vapidkeys = {
  publicKey: process.env.VPAID_PUBLIC || configuration?.VPAID_PUBLIC,
  privateKey: process.env.VPAID_PRIVATE || configuration?.VPAID_PRIVATE
};
webpush.setVapidDetails('mailto:viveksai26@gmail.com', vapidkeys.publicKey, vapidkeys.privateKey);
class subscriptionController {
  constructor() {}
  static async newsletter(req, res, next) {
    var message = req.query.message ? req.query.message : 'Helloo';
    var title = req.query.title ? req.query.title : 'Test';
    const notificationPayload = {
      notification: {
        title,
        body: message,
        icon:
          'https://cdn4.iconfinder.com/data/icons/happy-easter-5/64/easter_rabbit_bunny_holiday_animal_happy_cute-512.png',
        vibrate: [100, 50, 100],
        data: {
          dateOfArrival: Date.now(),
          primaryKey: 1
        },
        actions: [
          {
            action: 'explore',
            title: 'Go to the site'
          }
        ]
      }
    };

    notification.notification.find().then((data) => {
      console.log(data);
      res.status(200).json({ message: 'Newsletter sent successfully.' });
      data?.forEach((val) => {
        webpush.sendNotification(JSON.parse(val.token), JSON.stringify(notificationPayload)).catch((error) => {
          console.log(error);
          notification.notification.deleteOne(val).then((data) => console.log(data));
        });
      });
    });
  }
  static async subscribers(req, res, next) {
    try {
      notification.notification.find().then((data) => res.status(200).json(data));
    } catch (error) {
      res.status(500).json(error);
    }
  }
  static async clearSubscriptions(req, res, next) {
    try {
      notification.notification.deleteMany(() => true);
      res.status(200).json('subscriptions cleared');
    } catch (error) {
      res.status(500).json(error);
    }
  }
  static async subscribe(req, res, next) {
    const sub = req.body;
    console.log('Received Subscription on the server: ', sub);
    try {
      notification.notification.findOne({ token: JSON.stringify(sub) }).then((data) => {
        if (!data) {
          const authHeader = req.get('Authorization');
          notification.notification.insertMany(
            { token: JSON.stringify(sub), email: authHeader ? jwtDecode(authHeader).email : '' },
            (err, result) => {
              if (err) {
                res.send(err);
              } else {
                res.send(result);
              }
            }
          );
        } else {
          res.send('subscriber already exists');
        }
      });
    } catch (err) {
      console.log(err);
    }
  }
}
module.exports = subscriptionController;
