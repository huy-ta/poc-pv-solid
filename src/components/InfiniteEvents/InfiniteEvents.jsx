import { createState } from 'solid-js';
import { customElement } from 'solid-element';
import 'infinite-scroll-wc';

import style from './InfiniteEvents.scss';

const InfiniteEvents = props => {
  const [state, setState] = createState({
    inputActive: false
  });

  function formatDate(dateAsNumber) {
    const date = new Date(parseInt(dateAsNumber));

    return date.toLocaleTimeString(navigator.language, {
      hour: '2-digit',
      minute:'2-digit'
    });
  }

  return (
    <>
      <style>{style}</style>
      <div class="infinite-events">
        <header class={(`infinite-events__header ${state.inputActive ? 'input-active' : ''}`)}>
            <h3>Event schedule</h3>
            <button class="material-icons search-button" onClick={() => setState({ inputActive: true })}>search</button>
            <input class="search-input" onInput={props.handlesearchinput} placeholder="Filter events..."></input>
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
                        {/* <span>{formatDate(event.start)} - {formatDate(event.end)}</span> */}
                        <span>{performance.now()}</span>
                      </div>
                      <div class="event-text">
                        <span>{event.summary}</span>
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
  handlesearchinput: null,
  isloading: false,
  error: '',
  hasmore: true,
  groupedevents: []
}, InfiniteEvents);
