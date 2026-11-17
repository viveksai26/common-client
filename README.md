# common-client

A starter web app built with **Angular** (the front end) and **Node.js + Express** (the back end). It gives you, out of the box:

- Sign in with Google
- Pages that only logged-in users can see
- An installable app (PWA) that works like a mobile app
- Push notifications ("newsletter") sent from the server to your users' browsers, stored in MongoDB

The front end and back end live in the same repository and are deployed together as one app.

- **Live demo (front end only, GitHub Pages):** https://viveksai26.github.io/common-client/
- **Live demo (front end + API, Heroku):** https://common-client-rs.herokuapp.com/common-client

---

## Table of contents

1. [How the project fits together](#1-how-the-project-fits-together)
2. [What you need before you start](#2-what-you-need-before-you-start)
3. [Step-by-step setup](#3-step-by-step-setup)
4. [Running the app](#4-running-the-app)
5. [Using the app](#5-using-the-app)
6. [Project structure](#6-project-structure)
7. [Scripts reference](#7-scripts-reference)
8. [API reference](#8-api-reference)
9. [Configuration reference](#9-configuration-reference)
10. [Deployment](#10-deployment)
11. [Troubleshooting](#11-troubleshooting)
12. [Security notes](#12-security-notes)
13. [Glossary](#13-glossary)

---

## 1. How the project fits together

```
 Browser (Angular app)                    Server (Express)                 Database
 ┌────────────────────────┐   HTTP    ┌──────────────────────┐        ┌──────────┐
 │ Login with Google      │ ───────►  │ /api/subscription/*  │ ─────► │ MongoDB  │
 │ Profile, Home, Manage  │ ◄───────  │ sends web-push       │        │          │
 │ newsletter pages       │           │ serves the built app │        └──────────┘
 │ Service worker (PWA)   │ ◄─ push ─ └──────────────────────┘
 └────────────────────────┘
```

- **Front end** (`client/`): the Angular app you see in the browser.
- **Back end** (`server/` and `server.js`): an Express server that exposes an API under `/api` and also serves the built Angular app from the `/common-client` path.
- **Database**: MongoDB stores push-notification subscriptions.

**The login flow:** you click "Sign in with Google", Google returns an *ID token*, and the app saves it in the browser's `localStorage`. From then on, an HTTP interceptor adds that token to every request to the API as the `Authorization` header.

**The notification flow:** when the app loads in a browser with the service worker enabled, it asks permission to send notifications and sends the resulting *subscription* to `POST /api/subscription/subscribe`. The server saves it in MongoDB. Later, calling `GET /api/subscription/newsletter` makes the server push a message to every saved subscription.

---

## 2. What you need before you start

Install or create each of these once.

| Requirement | Why | How to get it |
| --- | --- | --- |
| **Git** | Download the code | https://git-scm.com/downloads |
| **Node.js 14** (with npm) | Run the tools and the server | Use [nvm](https://github.com/nvm-sh/nvm) (macOS/Linux) or [nvm-windows](https://github.com/coreybutler/nvm-windows), then `nvm install 14` and `nvm use 14` |
| **A MongoDB database** | Store subscriptions | Free option: [MongoDB Atlas](https://www.mongodb.com/atlas) (see below) |
| **VAPID keys** | Required for web push | Generated with one command (see below) |
| **A Google OAuth client ID** | Required for Google sign-in | [Google Cloud Console](https://console.cloud.google.com/apis/credentials) |

> **Why Node 14?** This project uses Angular 10, which is old. Newer Node versions (17 and above) can fail to build it. If you must use a newer Node, see [Troubleshooting](#11-troubleshooting).

Check your versions:

```bash
node -v    # should print v14.x.x
npm -v
git --version
```

### Create a free MongoDB database (Atlas)

1. Sign up at https://www.mongodb.com/atlas and create a free cluster.
2. Under **Database Access**, create a database user and note the username and password.
3. Under **Network Access**, allow your IP address (for quick local testing you can allow `0.0.0.0/0`, but do not do this for a real project).
4. Click **Connect → Drivers** and copy the connection string. It looks like `mongodb+srv://<user>:<password>@<cluster>.mongodb.net/<dbname>`. Replace `<user>` and `<password>` with your own values.

### Generate VAPID keys

VAPID keys identify your server to browsers' push services. Run this once:

```bash
npx web-push generate-vapid-keys
```

It prints a **public key** and a **private key**. Keep both; you will use them in [step 3](#3-step-by-step-setup).

### Create a Google OAuth client ID

1. Open the [Google Cloud Console credentials page](https://console.cloud.google.com/apis/credentials) and create a project if you do not have one.
2. Click **Create credentials → OAuth client ID** and choose **Web application**.
3. Under **Authorised JavaScript origins**, add `http://localhost:4200` (and later your deployed URL).
4. Save, then copy the **Client ID**.

---

## 3. Step-by-step setup

### Step 1: Get the code

```bash
git clone https://github.com/viveksai26/common-client.git
cd common-client
```

### Step 2: Install dependencies

```bash
npm install
```

This downloads everything listed in `package.json` into a `node_modules/` folder. It can take a few minutes.

### Step 3: Give the server its secrets

Create a file named `config.json` in the project root (next to `package.json`). It is listed in `.gitignore`, so it will not be committed.

```json
{
  "MONGO_URL": "mongodb+srv://<user>:<password>@<cluster>.mongodb.net/<dbname>",
  "VPAID_PUBLIC": "<your VAPID public key>",
  "VPAID_PRIVATE": "<your VAPID private key>"
}
```

> The names `VPAID_PUBLIC` and `VPAID_PRIVATE` are spelled this way in the code (not "VAPID"). Use them exactly as written.

You can instead set the same three names as environment variables; environment variables take priority over `config.json`.

### Step 4: Give the front end its settings

Open these files and replace the values with your own:

1. `client/src/environments/environment.ts` (used while developing)
   - `gsignIn.web.client_id`: your Google OAuth client ID.
   - `baseURL`: where the API runs. Leave it as `http://localhost:8080` for local development.
2. `client/src/environments/environment.prod.ts` (used for production builds)
   - Same fields; set `baseURL` to your deployed server's address.
3. `client/src/app/app.component.ts`
   - Set `VAPID_PUBLIC_KEY` to your **VAPID public key**. It must match `VPAID_PUBLIC` from step 3.

> Do not put a Google *client secret* in front-end code. The sign-in flow used here only needs the client ID.

### Step 5: Allow your email on protected API routes (optional)

`server/auth/auth.js` contains a list called `validEmails`. Replace the email in it with your own Google account's email if you plan to use the `isAuthorized` middleware.

---

## 4. Running the app

There are two ways to run it. Start with development mode.

### Development mode (recommended while coding)

Open **two terminals** in the project folder.

**Terminal 1: the API**

```bash
npm run start-nodemon
```

You should see messages like `MongoDB database connection established successfully`. The API runs at http://localhost:8080 and restarts automatically when you change server files.

**Terminal 2: the Angular app**

```bash
npm run ng -- serve
```

Wait for "Compiled successfully", then open http://localhost:4200/. The page reloads automatically when you change front-end files.

> In development mode the service worker is **off**, so push notifications will not work. Use production mode below to test them.

### Production mode (also how you test push notifications)

```bash
npm run build     # builds the Angular app into dist/common-client
npm start         # starts the Express server
```

Open http://localhost:8080/common-client. The server serves both the API and the built app. Opening `http://localhost:8080/` redirects to `/common-client`.

> The build uses `--base-href=/common-client/`, which is why the app lives under that path. If you change the path, update the scripts in `package.json` and the static routes in `server.js`.

---

## 5. Using the app

| Page | Path | What it does |
| --- | --- | --- |
| Login | `/login` | "Sign in with Google" button. After signing in you land on your profile. |
| Home | `/home` | A grid of tiles linking to other projects by the author. |
| Profile | `/user/profile` | Shows details decoded from your Google ID token. Requires login; otherwise you are sent to `/login`. |
| Manage newsletter | `/manage-newsletter` | Buttons to list subscribers, clear subscribers and send a test notification. |

**Try the push notifications:**

1. Run in production mode (section 4) and open http://localhost:8080/common-client.
2. Click **Allow** when the browser asks to show notifications.
3. Go to `/manage-newsletter`, click **Get Subscribers**, and confirm your browser appears in the list.
4. Click **send Newsletter**. A notification titled "Test" with the message "Helloo" should appear.

You can also send a custom message from the browser address bar:

```
http://localhost:8080/api/subscription/newsletter?title=Hello&message=It%20works
```

---

## 6. Project structure

```
.
├── client/                          # The Angular app
│   ├── manifest.webmanifest         # PWA install settings (name, colours, icons)
│   └── src/
│       ├── index.html               # The single HTML page
│       ├── main.ts                  # Angular entry point
│       ├── styles.css               # Global styles
│       ├── environments/            # environment.ts (dev) / environment.prod.ts (production)
│       ├── assets/                  # Images and icons
│       └── app/
│           ├── app.module.ts        # Root module: wires everything together
│           ├── app.component.ts     # Asks for push permission and subscribes
│           ├── routes/              # Root routing
│           └── modules/
│               ├── core/            # App-wide plumbing
│               │   ├── errors/      # Custom error handler and error page
│               │   ├── guards/      # authentication.guard.ts, auto-login.service.ts
│               │   ├── interceptors/# http.interceptor.ts adds the Authorization header
│               │   └── services/    # Snackbar notification service
│               ├── feature/
│               │   ├── public/      # login (sign-up exists but is not routed yet)
│               │   └── secure/      # home, user (profile), manage-subscribers
│               └── shared/
│                   ├── constants/   # API URLs, route paths, storage keys
│                   ├── layout/      # Public and secure headers, footers, sidebar
│                   ├── services/    # authentication and newsletter services
│                   └── styles/      # Angular Material module
│
├── server/                          # The Express API
│   ├── auth/auth.js                 # Email allow-list check (isAuthorized)
│   ├── controllers/                 # Logic for subscription routes
│   ├── routes/                      # /api/dashboard and /api/subscription
│   ├── utils/mongoose/              # Database connection and schemas
│   └── views/                       # Jade templates for the error page
│
├── server.js                        # Server entry point
├── angular.json                     # Angular build/test configuration
├── ngsw-config.json                 # Service worker caching rules
├── e2e/                             # End-to-end tests (Protractor)
└── .github/workflows/main.yml       # Build + deploy to GitHub Pages
```

**Where do I start reading the code?** Begin with `client/src/app/app.module.ts` (how the app is assembled), then `client/src/app/modules/feature/public/login/login.component.ts` (sign-in), then `server.js` and `server/routes/subscription.router.js` (the API).

---

## 7. Scripts reference

Run any of these with `npm run <name>`.

| Script | What it does |
| --- | --- |
| `start` | Starts the Express server (`node server.js`). Needs a built app for the front end. |
| `start-nodemon` | Same, but restarts when server files change. Use while developing. |
| `ng -- serve` | Starts the Angular dev server on port 4200. |
| `build` | Production build into `dist/common-client` (enables the service worker). |
| `build-dev` | Development build with the same base path. |
| `test` | Runs unit tests with Karma in Chrome. |
| `e2e` | Runs end-to-end tests with Protractor. |
| `lint` | Checks `client/src` with ESLint and fixes what it can. |
| `format` | Formats `client/src/**/*.ts` with Prettier. |
| `heroku-postbuild` | Runs automatically on Heroku after install to build the app. |

---

## 8. API reference

All routes start with `/api`. Responses are JSON unless noted.

| Method | Route | Description |
| --- | --- | --- |
| `POST` | `/api/subscription/subscribe` | Saves a push subscription (send the subscription object as the JSON body). If an `Authorization` header with a Google ID token is present, the user's email is saved with it. Returns `subscriber already exists` for duplicates. |
| `GET` | `/api/subscription/subscribers` | Lists all saved subscriptions. |
| `GET` | `/api/subscription/newsletter` | Sends a push notification to every subscriber. Optional query params: `title` (default `Test`) and `message` (default `Helloo`). Subscriptions that fail (for example, expired) are removed. |
| `GET` | `/api/subscription/clearSubscriptions` | Deletes saved subscriptions. |
| `GET` | `/api/dashboard` | Renders a placeholder HTML page. |

Unknown `/api/...` routes return a 404 error page.

---

## 9. Configuration reference

### Server (environment variables or `config.json`)

| Name | Required | Description |
| --- | --- | --- |
| `MONGO_URL` | Yes | MongoDB connection string. |
| `VPAID_PUBLIC` | Yes | VAPID public key. |
| `VPAID_PRIVATE` | Yes | VAPID private key. |
| `PORT` | No | Port to listen on. Defaults to `8080`. |

### Front end (files you edit)

| File | Setting | Description |
| --- | --- | --- |
| `client/src/environments/environment.ts` | `gsignIn.web.client_id`, `baseURL` | Development Google client ID and API address. |
| `client/src/environments/environment.prod.ts` | `gsignIn.web.client_id`, `baseURL` | Production Google client ID and API address. |
| `client/src/app/app.component.ts` | `VAPID_PUBLIC_KEY` | Must match the server's `VPAID_PUBLIC`. |
| `client/src/app/modules/shared/constants/api-urls.ts` | API URLs | Built from `baseURL`. |

---

## 10. Deployment

### GitHub Pages (front end only)

Every push runs `.github/workflows/main.yml`, which installs dependencies, runs `npm run build`, and publishes `dist/common-client` to the `gh-pages` branch. In your repository settings, set Pages to serve from the `gh-pages` branch. Because there is no server here, API calls need a `baseURL` pointing at a separately hosted server.

### Heroku (front end + API)

1. Create a Heroku app and connect this repository.
2. In **Settings → Config Vars**, add `MONGO_URL`, `VPAID_PUBLIC` and `VPAID_PRIVATE`.
3. Deploy. Heroku runs `npm install`, then `heroku-postbuild` (builds the Angular app), then `npm start`.
4. Set `baseURL` in `client/src/environments/environment.prod.ts` to your Heroku app's address, and add that address to your Google OAuth client's authorised JavaScript origins.

---

## 11. Troubleshooting

**`npm install` fails or prints many warnings.**
Warnings about deprecated packages are normal for an Angular 10 project. For real errors, confirm you are on Node 14 (`node -v`) and try deleting `node_modules` and running `npm install` again.

**`error:0308010C:digital envelope routines::unsupported` when building.**
You are on Node 17 or newer. Either switch to Node 14 (`nvm use 14`), or set this before the command:
- macOS/Linux: `export NODE_OPTIONS=--openssl-legacy-provider`
- Windows (PowerShell): `$env:NODE_OPTIONS="--openssl-legacy-provider"`

**`ng: command not found`.**
Use `npm run ng -- serve` instead, which uses the copy installed in the project.

**The server crashes or logs a MongoDB error at start-up.**
Check that `MONGO_URL` is set correctly (in `config.json` or as an environment variable), that the password has no unescaped special characters, and that your IP address is allowed in Atlas **Network Access**.

**"Sign in with Google" popup fails or shows `origin_mismatch`.**
Add the exact address you are using (for example `http://localhost:4200`) to **Authorised JavaScript origins** for your OAuth client, and make sure `client_id` in `environment.ts` is your own.

**No notification permission prompt appears.**
The service worker only runs in production builds (`npm run build`, then `npm start`). Also check that the site is not blocked in your browser's notification settings.

**A notification never arrives.**
Make sure `VAPID_PUBLIC_KEY` in `app.component.ts` matches `VPAID_PUBLIC` on the server, then clear the old subscription (site settings, or the "clear Subscribers" button) and subscribe again.

**The page is blank or assets 404 when opened from the server.**
You must run `npm run build` first, and open `/common-client` (not just `/`).

**The page does not update after I rebuild.**
The service worker caches files. Hard refresh, or in browser DevTools go to Application → Service Workers → Unregister.

---

## 12. Security notes

Read these before using this project as the base for something real.

- **Secrets in the repo:** the environment files currently contain a Google OAuth *client secret*. Rotate it in the Google Cloud Console and remove it from the code; a front-end app only needs the client ID.
- **Open API routes:** `isAuthorized` in `server/auth/auth.js` exists but is not applied to the `/api/subscription` routes, so anyone who knows the URLs can list subscribers, clear them, or send notifications. Add the middleware to those routes before going public.
- **Front-end guards are not security:** the login check in the Angular app only controls which pages are shown. Enforce access on the server.
- **ID token handling:** the server decodes the Google ID token with `jwt-decode`, which does **not** verify its signature. For real authorisation, verify tokens with Google's libraries.
- **Contact email:** update the email passed to `webpush.setVapidDetails` in `server/controllers/subscription.controller.js`.
- **Never commit** `config.json`, database passwords or VAPID private keys.

---

## 13. Glossary

- **Angular:** a framework for building web pages as reusable components.
- **Express:** a small Node.js framework for building web servers and APIs.
- **MongoDB / Mongoose:** a document database, and the library the server uses to talk to it.
- **PWA (Progressive Web App):** a website that can be installed and can work offline-ish like a native app.
- **Service worker:** a script the browser runs in the background; it enables caching and push notifications.
- **Web push / VAPID:** the standard for sending notifications from a server to a browser; VAPID keys prove the messages come from your server.
- **JWT / ID token:** a signed token from Google that says who the user is.
- **Interceptor:** Angular code that runs on every HTTP request, used here to add the token.
- **Guard:** Angular code that decides whether a user may open a page.
- **Environment variable:** a setting provided to the program from outside the code, so secrets stay out of the repository.
