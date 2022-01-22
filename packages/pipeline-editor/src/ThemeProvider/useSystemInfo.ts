/*
 * Copyright 2018-2022 Elyra Authors
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

import { useEffect, useMemo, useState } from "react";

function useSystemInfo() {
  const [mode, setMode] = useState<"dark" | "light">(
    window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
  );

  useEffect(() => {
    const darkMediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    try {
      // Chrome & Firefox
      darkMediaQuery.addEventListener("change", (e) => {
        if (e.matches) {
          setMode("dark");
        } else {
          setMode("light");
        }
      });
    } catch {
      try {
        // Old Safari
        darkMediaQuery.addListener((e) => {
          if (e.matches) {
            setMode("dark");
          } else {
            setMode("light");
          }
        });
      } catch {}
    }
  }, []);

  const platform = useMemo<"mac" | "win" | "other">(() => {
    if (window.navigator.platform.startsWith("Mac")) {
      return "mac";
    }
    if (window.navigator.platform.startsWith("Win")) {
      return "win";
    }
    return "other";
  }, []);

  return useMemo(() => ({ mode, platform }), [mode, platform]);
}

export default useSystemInfo;
