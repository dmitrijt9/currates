# Currates - currency converter

Android app - provides fast conversion of most common rates.

- offline mode
- fetch latest exchange rates when connected
- set base currency by your location (if you are in Germany, EUR will be set)
- save your favourite exchange pairs

## Prototype

- Figma - https://www.figma.com/proto/BZioDAVQv0GyKIbQo0zyjo/Currates?node-id=13%3A207&scaling=scale-down

## Development

Before first run:

1. Install NativeScript CLI - https://docs.nativescript.org/start/quick-setup
2. Install iOS and Android SDKs for your platform - https://docs.nativescript.org/start/general-requirements#full-setup-requirements

### Run

Connect android phone via USB Debugging mode.

Run `yarn dev` in the root of the repo.

You can also run VUE Devtool for debugging Vue components or Vuex store.

Uncomment `Vue.use(VueDevtools, { host: '192.168.0.145' })` in `app.js` and write IP address of your computer.
Then run `yarn run:devtools`

**OR**

Type `yarn build:android`, which builds your app and creates APK file, that you can install on your mobile phone and run.

**OR**

See [NativeScript CLI docs](https://docs.nativescript.org/start/cli-basics) and manage it by yourself the way which suits you the best.
