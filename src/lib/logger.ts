// Minimal environment-aware logger. Debug/info only output in dev to avoid leaking data in production.
export const logger = {
  debug: (...args: any[]) => {
    try {
      const dev = (import.meta as any)?.env?.DEV;
      if (dev) {
        // eslint-disable-next-line no-console
        console.debug('[debug]', ...args);
      }
    } catch (e) {
      // swallow — logger must not throw
    }
  },
  info: (...args: any[]) => {
    try {
      const dev = (import.meta as any)?.env?.DEV;
      if (dev) {
        // eslint-disable-next-line no-console
        console.info('[info]', ...args);
      }
    } catch (e) {
      // swallow
    }
  },
  warn: (...args: any[]) => {
    try {
      // eslint-disable-next-line no-console
      console.warn('[warn]', ...args);
    } catch (e) {
      // swallow
    }
  },
  error: (...args: any[]) => {
    try {
      // eslint-disable-next-line no-console
      console.error('[error]', ...args);
    } catch (e) {
      // swallow
    }
  }
};
