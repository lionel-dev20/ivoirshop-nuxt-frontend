import { defineNuxtPlugin } from "#app";
import { Collapse, Ripple, initTWE } from "tw-elements";

export default defineNuxtPlugin(() => {
  if (process.client) {
    initTWE({ Collapse, Ripple });
  }
});
