// Modules
const webpush = require('web-push');
const Storage = require('node-storage');

// Vapid keys
const vapid = require('./vapid.json');

// Configure web-push
webpush.setVapidDetails(
    'mailto:pmtargosz@gmail.com',
    vapid.publicKey,
    vapid.privateKey
);

// Subscriptions
const store = new Storage('./db')
let subscriptions = store.get('subscriptions') || [];

// Create URL safe vapid public key
module.exports.getKey = () => {
    const urlsafeBase64Decode = base64 => {
        base64 += Array(5 - base64.length % 4).join('=');

        base64 = base64
            .replace(/\-/g, '+')
            .replace(/\_/g, '/');

        return new Buffer.from(base64, 'base64');

    }
    return urlsafeBase64Decode(vapid.publicKey);
};

// Store a new subscription
module.exports.addSubscription = subscription => {
    // Add to subscription array
    subscriptions.push(subscription);

    store.put('subscriptions', subscriptions);
}

// Send notifications to all registered subscriptions 
module.exports.send = message => {
    let notifications = [];

    subscriptions.map(subscription => {
        // Send Notification
        let p = webpush.sendNotification(subscription, message).catch(status => {
            if (status.statusCode === 410) subscription['delete'] = true;
            return null;
        });

        notifications.push(p);
    });

    Promise.all(notifications).then(() => {
        subscriptions = subscriptions.filter(subscription => !subscription.delete)

        store.put('subscriptions', subscriptions);
    })
}