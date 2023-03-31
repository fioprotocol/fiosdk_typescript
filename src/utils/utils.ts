const PROMISE_TIMEOUT = 5000;

const snooze: Function = (ms: number) =>
  new Promise((resolve: (...args: any[]) => void) => setTimeout(resolve, ms))

export async function asyncWaterfall(
  asyncFuncs: Array<Function>,
  timeoutMs: number = PROMISE_TIMEOUT,
): Promise<any> {
  let pending = asyncFuncs.length
  const promises: Array<Promise<any>> = []
  for (const func of asyncFuncs) {
    const index = promises.length
    promises.push(
      func().catch((e: Error & { index: number }) => {
        e.index = index
        throw e
      }),
    )
    if (pending > 1) {
      promises.push(
        new Promise(resolve => {
          snooze(timeoutMs).then(() => {
            resolve('async_waterfall_timed_out')
          })
        })
      )
    }
    try {
      const result = await Promise.any(promises)
      if (result.isError) throw result.data
      if (result === 'async_waterfall_timed_out') {
        promises.pop()
        --pending
      } else {
        return result
      }
    } catch (error: any) {
      const i = error.index
      promises.splice(i, 1)
      promises.pop()
      --pending
      if (!pending) {
        throw error
      }
    }
  }
}
