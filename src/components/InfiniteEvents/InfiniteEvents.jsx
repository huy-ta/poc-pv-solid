import { createState } from 'solid-js';
import { customElement } from 'solid-element';
import 'infinite-scroll-wc';

import style from './InfiniteEvents.scss';

const InfiniteEvents = (props, { element: hostElement }) => {
  const [state, setState] = createState({
    inputActive: false
  });

  let searchInputTimeout;
  function handleSearchInput({ target }) {
    if (searchInputTimeout) clearTimeout(searchInputTimeout);
    const value = target.value;

    searchInputTimeout = setTimeout(function() {
      hostElement.dispatchEvent(new CustomEvent('filter', { detail: { value } }));
    }, 300);
  };

  return (
    <>
      <style>{style}</style>
      <div class="infinite-events">
        <header class={(`infinite-events__header ${state.inputActive ? 'input-active' : ''}`)}>
            <h3>Event schedule</h3>
            <button class="material-icons search-button" onClick={() => setState({ inputActive: true })}>search</button>
            <input class="search-input" onInput={handleSearchInput} placeholder="Filter events..."></input>
        </header>
        <section class="infinite-events__body">
          <infinite-scroll loadmore={props.loadmore} hasmore={props.hasmore} usewindow={false}>
            <$ each={props.groupedevents}>
            {eventGroup =>
              <>
                <h5 class="event-group-header">{eventGroup.date}</h5>
                <hr />
                <$ each={eventGroup.events}>
                {(event, index) =>
                  <>
                    {index !== 0 && <hr />}
                    <div class="event-row">
                      <div class="event-dot">
                        <span style={{ backgroundColor: event.calendar.color }}></span>
                      </div>
                      <div class="event-time">
                        <span>{props.formatdate(event.start)} - {props.formatdate(event.end)}</span>
                      </div>
                      <div class="event-text">
                        <span>{event.title}</span>
                      </div>
                    </div>
                  </>
                }
                </$>
              </>
            }
            </$>
          </infinite-scroll>
          {(props.isloading && <slot name="loading"></slot>)}
          {(props.error && <slot name="error"></slot>)}
        </section>
      </div>
    </>
  );
}

customElement('s-infinite-events', {
  loadmore: null,
  isloading: false,
  error: '',
  hasmore: true,
  groupedevents: [],
  formatdate: date => date
}, InfiniteEvents);
