(function () {
    const ClientPushServer = (settings = {}) => {
        const state = {
            subscribe: document.querySelector(settings.subscribe),
            unsubscribe: document.querySelector(settings.unsubscribe),
            serverUrl: 'http://localhost:3000'
        }

        const __setSubscribeStatus = status => {
            if (status) {
                state.subscribe.className = 'hidden';
                state.unsubscribe.className = '';
            } else {
                state.subscribe.className = '';
                state.unsubscribe.className = 'hidden';
            }
        };

        const __registerServiceWorker = async () => {
            try {
                const register = await navigator.serviceWorker.register('./sw.js');

                console.log('Service Worker registred', register);

                return register;
            } catch (err) {
                console.error(err);
            }
        };

        const __getApplicationServerKey = async () => {
            const response = await fetch(`${state.serverUrl}/api/key`);
            const publicKey = await response.json();

            return new Uint8Array(publicKey.key.data);
        };

        const __eventUnsubscribeHandler = async swReg => {
            const subscription = await swReg.pushManager.getSubscription();
            const unsubscription = await subscription.unsubscribe();
            unsubscription && __setSubscribeStatus(false);
        };

        const __eventSubscribeHandler = async swReg => {
            if (!swReg) return console.error('Service Worker Registration Not Found');

            const publicKey = await __getApplicationServerKey();

            try {
                const subscription = await swReg.pushManager.subscribe({
                    userVisibleOnly: true,
                    applicationServerKey: publicKey
                });

                fetch(`${state.serverUrl}/api/subscribe`, {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(subscription.toJSON())
                }).then(__setSubscribeStatus).catch(__eventUnsubscribeHandler);

            } catch (err) {
                console.error(err);
            }
        };

        const __eventsListeners = swReg => {
            state.subscribe.querySelector('button').addEventListener('click', () => __eventSubscribeHandler(swReg));
            state.unsubscribe.querySelector('button').addEventListener('click', () => __eventUnsubscribeHandler(swReg))
        };

        const init = async () => {
            const serviceWorker = await __registerServiceWorker();
            const statusServiceWorker = await serviceWorker.pushManager.getSubscription();

            __setSubscribeStatus(statusServiceWorker);

            __eventsListeners(serviceWorker);
            // fetch('http://localhost:3000/api/subscribe', {
            //     method: 'POST'
            // }).then(res => res.json()).then(r => console.log(r));

            // fetch('http://localhost:3000/api/key').then(res => res.json()).then(r => console.log(r));
        };


        return Object.freeze({
            init
        });
    }

    const client = ClientPushServer({
        subscribe: '#subscribe',
        unsubscribe: '#unsubscribe'
    });

    client.init();
}());