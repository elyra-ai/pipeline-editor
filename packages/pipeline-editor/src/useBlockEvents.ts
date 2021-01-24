import { useEffect, useRef } from "react";

function blockEvent(e: Event) {
  e.stopPropagation();
}

function useBlockEvents(events: { [key: string]: boolean | undefined }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;

    // Setting `capture` to `true` will capture the event before drilling
    // through the DOM nodes to our target. This is what allows us to block the
    // event. Since we are stoping propagation, we must have `passive` set to
    // `false`.
    const options = { passive: false, capture: true };

    for (const [key, val] of Object.entries(events)) {
      if (val) {
        el?.addEventListener(key, blockEvent, options);
      }
    }

    // The canvas steals focus on mount, which causes a jarring scroll to the
    // element. Scrolling to (0, 0) seems to prevent that, but this is really
    // just a bandaid on the issue and could have unintended effects.
    window.scrollTo(0, 0);

    return () => {
      for (const [key, val] of Object.entries(events)) {
        if (val) {
          el?.removeEventListener(key, blockEvent);
        }
      }
    };
  }, [events]);

  return ref;
}

export default useBlockEvents;
