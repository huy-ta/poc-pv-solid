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

The build results will be in the `public/lib` folder. For now, you'll have to manually copy-paste the `s-infinite-events.js` file into `frontend/components/infinite-events` in `linagora.esn.calendar`.

## Caveats

- Bundle size: The SolidJS core library _and_ `solid-element` weigh about 15.7kB minified, and 6.3kB minified & gzipped. The component itself weighs about 6.6kB minified and 2.7kb minified & gzipped.
- Styling issues:
  - There are a few more problems regarding using Web Components in a (UI) Design System. For example, how do you build a WC using SolidJS and you need to use a Material Button inside it? This can't be solved unless you also use Web Components to build the Material UI elements.
  - This won't work with the current theming implmentation. Unless we use CSS Variables for theming, there's basically no way to use theme with Web Components.
- For some really weird reason, this doesn't work on iPad Air 2 running iOS 11.2.6. Other iOS versions are fine.
