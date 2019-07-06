import { customElement } from 'solid-element';

import style from './Hello.scss';

const Hello = props => (
  <>
    <style>{style}</style>
    <h1>Hello {(props.name)}</h1>
  </>
);

customElement('s-hello', { name: ''  }, Hello);
