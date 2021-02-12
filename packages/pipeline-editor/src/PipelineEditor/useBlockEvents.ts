/*
 * Copyright 2018-2021 Elyra Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { useEffect, useRef } from "react";

interface Options {
  wheel?: boolean;
  contextmenu?: boolean;
}

function blockEvent(e: Event) {
  e.stopPropagation();
}

// Setting `capture` to `true` will capture the event before drilling
// through the DOM nodes to our target. This is what allows us to block the
// event. Since we are stoping propagation, we must have `passive` set to
// `false`.
const options = { passive: false, capture: true };

function useBlockEvents(events: Options) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // The canvas steals focus on mount, which causes a jarring scroll to the
    // element. Scrolling to (0, 0) seems to prevent that, but this is really
    // just a bandaid on the issue and could have unintended effects.
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const el = ref.current;

    if (events.wheel) {
      el?.addEventListener("wheel", blockEvent, options);
    }

    return () => {
      if (events.wheel) {
        el?.removeEventListener("wheel", blockEvent, options);
      }
    };
  }, [events.wheel]);

  useEffect(() => {
    const el = ref.current;

    if (events.contextmenu) {
      ref.current?.addEventListener("contextmenu", blockEvent, options);
    }

    return () => {
      if (events.contextmenu) {
        el?.removeEventListener("contextmenu", blockEvent, options);
      }
    };
  }, [events.contextmenu]);

  return ref;
}

export default useBlockEvents;
