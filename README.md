# Overview

PWA - Push Server. Express, node, node-push.

## Installation

First, clone this repo and change to the directory:

```bash
git clone git@github.com:pmtargosz/<project>.git
cd <project>
```

### Install

```bash
cd <project>
npm install
```

### Run Static Server

```bash
cd <project>
npm run server
# http://localhost:3000
```

### POST Message format (json)

```bash
{"message": "your_message"}
```

## Resources

- [express](https://expressjs.com/): Fast, unopinionated, minimalist web framework for Node.js.
- [web-pus](https://github.com/web-push-libs/web-push): Web push requires that push messages triggered from a backend be done via the Web Push Protocol and if you want to send data with your push message, you must also encrypt that data according to the Message Encryption for Web Push spec.

## License

[MIT](https://opensource.org/licenses/MIT)
