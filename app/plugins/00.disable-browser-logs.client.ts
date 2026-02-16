import { defineNuxtPlugin, useRuntimeConfig } from '#app'

export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig()
  const disable = config.public?.DISABLE_BROWSER_LOGS === true

  if (!disable) return

  const noop = () => {}
  const methods: Array<keyof Console> = [
    'log',
    'info',
    'warn',
    'error',
    'debug',
    'trace',
    'group',
    'groupCollapsed',
    'groupEnd',
    'table',
    'time',
    'timeEnd',
    'timeLog',
  ]

  for (const m of methods) {
    const fn = console[m]
    if (typeof fn === 'function') {
      // @ts-expect-error - Console methods are writable at runtime
      console[m] = noop
    }
  }
})

