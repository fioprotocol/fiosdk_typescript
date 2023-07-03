import { AbortController, AbortSignal } from 'abort-controller';

const PROMISE_TIMEOUT = 5000;
const DEFAULT_REQUEST_TIMEOUT = 60000;

const snooze: Function = (ms: number) =>
  new Promise((resolve: (...args: any[]) => void) => setTimeout(resolve, ms))

export async function asyncWaterfall({
  asyncFuncs,
  timeoutMs = PROMISE_TIMEOUT,
  requestTimeout = DEFAULT_REQUEST_TIMEOUT,
}: {
  asyncFuncs: Array<(signal: AbortSignal) => Promise<any>>,
  timeoutMs?: number,
  requestTimeout?: number,
}): Promise<any> {
  let pending = asyncFuncs.length
  const promises: Array<{ promise: Promise<any>; abortController?: AbortController }> = [];

  for (const func of asyncFuncs) {
    const abortController = new AbortController();

    const timeoutPromise = snooze(requestTimeout).then(() => {
      abortController.abort();
      throw new Error('request_timeout');
    });

    const index = promises.length

    const promise = Promise.race([func(abortController.signal), timeoutPromise])
      .catch((e) => {
        e.index = index;
        throw e;
      });

    promises.push({ promise, abortController });

    if (pending > 1) {
      promises.push({
        promise: new Promise(resolve => {
          snooze(timeoutMs).then(() => {
            resolve('async_waterfall_timed_out')
          })
        })
      })
    }

    try {
      const result = await Promise.race(promises.map(p => p.promise));
      if (result.isError) throw result.data
      if (result === 'async_waterfall_timed_out') {
        promises.pop()
        --pending
      } else {
        return result
      }
    } catch (error: (any & { index: number } | AggregateError & { index: number })) {
      const rejectHandling = (handledError: Error & { index: number }) => {
        const i = handledError.index;
        promises.splice(i, 1);
        promises.pop();
        --pending;
        if (!pending) {
          throw error;
        }
      };

      if (error instanceof AggregateError) {
        rejectHandling(error.errors[0]);
      } else {
        rejectHandling(error);
      }
    }
  }
}
