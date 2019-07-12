# Rebuilding the planning view frontend using Web Component

A Web Component POC for the planning view with infinite scroll support.

## Why this POC

You can refer to the original user stories [here](https://ci.linagora.com/linagora/lgs/openpaas/linagora.esn.calendar/issues/1667) (but I recommend reading the summary below).

**TL;DR:** I'm rebuilding the frontend part of the planning view to support infinite scroll since the current planning view implementation uses `fullcalendar`, which doesn't support infinite scroll. However, we want to avoid building a new feature using AngularJS. That's where Web Components come into use.

## Why Web Components

- **Interoperability**: Web Components help you to use e.g. VueJS/StencilJS/Svelte/SomethingJS inside AngularJS/SomethingElseJS with ease. They are just (custom) HTML elements.
- **Reusability**: Should OpenPaaS become a multi-frontend-framework platform, we can reuse all the Web Components we have built across all frameworks.
  - For example, OpenPaaS has a mail composer built with AngularJS. How would you use it inside another module using VueJS? However, if you built the mail composer using Web Components then you would just use it like an HTML Element.
  - Even if we decide to migrate from VueJS to SomethingJS in the future, we won't have to rebuild those web components, which might help save a lot of time.

## Why using Web Components with a library

- A Web Component is just a shell/container, an empty HTML element with some _static_ template markup.
- A Web Component has some lifecycle methods to tell you when it is attached to the DOM, detached from the DOM, and when its attributes are changed.

Other than the things mentioned above, a Web Component doesn't know how to re-render when its properties, attributes (or sometimes, states) change unless you explicitly tell it how. You can manually do some Vanilla `document.querySelector`, `document.createElement`, `document.innerHTML`, `node.remove`, `node.cloneNode`, etc. For some simple cases, there should be no problem. But in more complicated cases it would become really tedious, hard to maintain, and you would certainly encounter some performance issues. At some point you would end up building your own rendering library. That's why I think we should build Web Components using a (minimal) library.

## How to consume a Web Component

### Passing down data

First, we must understand the difference between attributes and properties of a Web Component.

- An **attribute** is reflected on the HTML markup, and its value can only be a string.
- A **property** can have any type of value.

So, we can pass primitive, simple types of data via attributes/properties, but if we need to pass down complex types of data to a Web Component/Custom Element (objects, arrays, functions), we'll have to do it via properties, e.g.:

```html
<body>
  <div id="unique">
    <hello-element message="Hello"></hello-element>
  </div>

  <script>
    const helloEl = document.querySelector('#unique hello-element');
    helloEl.person = { name: 'Huy' };
    helloEl.sayhi = function() {
      alert('Hi!');
    }
  </script>
</body>
```

Popular frontend libraries/frameworks often provide some syntactic sugar for this. For example, in AngularJS 1.7.8, you can do this instead:

```html
<hello-element message="Hello" ng-prop-person="$ctrl.person" ng-prop-sayhi="$ctrl.sayHi"></hello-element>
```

For the list of libraries/frameworks that support this kind of syntactic sugar, you can visit [Custom Elements Everywhere](https://custom-elements-everywhere.com).

### Listening to events

Web Components/Custom Elements can dispatch their own custom events, and you can easily listen to them:

```html
<body>
  <div id="unique">
    <book-list></book-list>
  </div>

  <script>
    const bookListEl = document.querySelector('#unique book-list');
    bookListEl.addEventListener('bookadded', e => {
      // ...
    });
  </script>
</body>
```

Again, AngularJS 1.7.8 has some syntactic sugar for that:

```html
<book-list ng-on-bookadded="$ctrl.onBookAdded"></book-list>
```

## How to build Web Components with `solid-element`

### Reading properties

A Solid component is a function that takes in two parameters. The first one, `props`, is the object containing all properties of the Web Component. The second argument is the ref to the Web Component in the DOM.

```js
const InfiniteEvents = (props, { element: hostElement }) => {
  // ...
}
```
> [InfiniteEvents.jsx#L7](https://github.com/huy-ta/poc-pv-solid/blob/master/src/components/InfiniteEvents/InfiniteEvents.jsx#L7)

You can pass down functions from, let's say, AngularJS, and use it via the `props` object. However, the better way to communicate from a Web Component to AngularJS would be to dispatch events.

### Dispatching events

We have the ref to the Web Component via the second argument, as previously said. Dispatching events can be as easy as:

```js
hostElement.dispatchEvent(new CustomEvent('filter', { detail: { value } }));
```
> [InfiniteEvents.jsx#L18](https://github.com/huy-ta/poc-pv-solid/blob/master/src/components/InfiniteEvents/InfiniteEvents.jsx#L18)

## Benefits of building Web Components with SolidJS

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

## How to run this POC?

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

## Notes

- Please share your thoughts and when agreed upon, I'll update them here so that everyone can see.

