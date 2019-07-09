# Rebuilding the planning view frontend using Web Component

A POC for the planning view with infinite scroll support.

## Instructions

To run this POC, follow these steps:

- Run the mock server that generates random events:

```
cd event-generator
npm install
npm run dev
```

- Build the Web Components:

```
// in the root directory
npm install
npm run build
```

The build results will be in the `public/lib` folder. For now, you'll have to manually copy-paste it into `frontend/components/infinite-events` in `linagora.esn.calendar`.

## Caveats

...to be updated
