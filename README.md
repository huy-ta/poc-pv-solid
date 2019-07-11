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

- Build the Web Component:

```
// in the root directory
npm install
npm run build
```

The build results will be in the `public/lib` folder.

- Use the Web Component inside OpenPaaS (specifically in this case, `linagora.esn.calendar`):
  - Copy the built file `s-infinite-events.js` in `public/lib` folder to `frontend/components/infinite-events` in `linagora.esn.calendar`. Ideally, we should do this using `bower install` when the web component package is published. For now, we'll do it manually since it's just a POC.
  - Inject it via Awesome Module:

  ```js
    webserverWrapper.injectJS('calendar', JSFilesToInject, 'esn');
    // JSFilesToInject = [..., '../components/infinite-events/s-infinite-events.js', ...]
  ```

  - Use the web component in the template just like an HTML Element:

  ```html
    s-infinite-events
      p(slot="loading") Loading...
  ```

  - Since we are using AngularJS 1.3.20 which doesn't support `ng-prop-*` and `ng-on-*` for Web Components, we'll have to get the ref to the web component and then manually set its properties and add the event listener accordingly. You can see all of that stuff in the pull request [linagora.esn.calendar!560](https://ci.linagora.com/linagora/lgs/openpaas/linagora.esn.calendar/merge_requests/560).

## Motivation

- You can refer to the original user stories [here](https://ci.linagora.com/linagora/lgs/openpaas/linagora.esn.calendar/issues/1667). TL;DR: I'm rebuilding the frontend part of the planning view to support infinite scroll using Web Components since we don't really want to use AngularJS to build a new feature. The purpose of using Web Components here is that they will act as an interop layer that help glues UI frameworks/libraries together.

## Benefits

### Benefits of using Web Components in general

- **Interoperability**: Allowing us to use a UI library inside another. Of course, we'll have to include both libraries. For example, if we build Web Components using SolidJS and use them inside our AngularJS app, we'll have to include both SolidJS and AngularJS.
- **Reusability**: The web components we have built can be used anywhere. It is, after all, just an extended HTML Element. Even if we decide to migrate from VueJS to SomethingJS in the future, we won't have to rebuild those web components, which might help save a lot of time.

### Benefits of building Web Components with SolidJS

- **Great performance**: SolidJS has a performance close to that of VanillaJS as evidenced in the benchmark [here](https://krausest.github.io/js-framework-benchmark/current.html) (less than 10% slower). VueJS on average is approximately 100% slower than VanillaJS according to that benchmark.
- **Minimal bundle size**: The SolidJS core library _and_ `solid-element` weigh about 15.7kB minified, and 6.3kB minified & gzipped. You can see **Startup metrics** in the `js-framework-benchmark` above, which shows that SolidJS loads nearly as fast as VanillaJS (less than 4%).
- **Easy to use** (If you come from the React world): SolidJS uses JSX and its APIs are quite similar to those of React. In fact you can copy paste some ReactJS code and add some tweaks to make it work in SolidJS.

> My opinion is that if we build Web Components using a UI library whose:
> - Performance close to that of VanillaJS;
> - The impact on Startup Metrics is _really_ small;
> - The DX is good (good as in better than the current mainstream UI libraries).
> 
> ...then everything is settled. At that point, we would only be limited to the physics of JavaScript and the DOM themselves, and there would be hardly any need to touch those Web Components to improve performance or DX anymore.

## Caveats

- **Bundle size**: The SolidJS core library _and_ `solid-element` weigh about 15.7kB minified, and 6.3kB minified & gzipped. The component itself weighs about 6.6kB minified and 2.7kb minified & gzipped.
- **Styling**: There are some problems regarding using Web Components in a (UI) Design System. For example, how do you build a WC using SolidJS and you need to use a Material Button inside it? This can't be solved unless you also use Web Components to build the Material UI elements.
- **AngularJS 1.3.20** doesn't support `ng-prop-*` and `ng-on-*` which are great syntactic sugar for Web Components.
- For some really weird reason, this doesn't work on iPad Air 2 running iOS 11.2.6. Other iOS versions are fine.

## Notes

- Please share your thoughts and when agreed upon, I'll update them here so that everyone can see.

