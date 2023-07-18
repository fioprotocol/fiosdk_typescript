import { AbortController, AbortSignal } from 'abort-controller';

const DEFAULT_REQUEST_TIMEOUT = 60000;

export async function asyncWaterfall({
  asyncFuncs,
  requestTimeout = DEFAULT_REQUEST_TIMEOUT,
}: {
  asyncFuncs: Array<(signal: AbortSignal) => Promise<any>>;
  requestTimeout?: number;
}): Promise<any> {
  const timeoutIds: NodeJS.Timeout[] = [];

  try {
    for (let i = 0; i < asyncFuncs.length; i++) {
      const func = asyncFuncs[i];
      const abortController = new AbortController();
      let timeoutId: NodeJS.Timeout | undefined;

      const timeoutPromise = new Promise<void>((_, reject) => {
        timeoutId = setTimeout(() => {
          abortController.abort();
          reject(new Error('request_timeout'));
        }, requestTimeout);
        timeoutIds.push(timeoutId!);
      });

      try {
        const result = await Promise.race([func(abortController.signal), timeoutPromise]);
        clearTimeout(timeoutId!);
        if (result.isError) {
          throw result.data;
        }
        if (result !== undefined) {
          return result;
        }
      } catch (error: any) {
        clearTimeout(timeoutId!);
        if (i === asyncFuncs.length - 1) {
          throw error;
        }
      }
    }
  } finally {
    timeoutIds.forEach((timeoutId) => clearTimeout(timeoutId));
  }
}
