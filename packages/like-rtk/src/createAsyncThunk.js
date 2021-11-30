import { createAction } from "./createAction";

export function createAsyncThunk(typePrefix, payloadCreator, options) {
  const fulfilled = createAction(
    typePrefix + '/fulfilled',
    (
      payload,
      requestId,
      arg,
      meta
    ) => ({
      payload,
      meta: {
        ...((meta as any) || {}),
        arg,
        requestId,
        requestStatus: 'fulfilled',
      },
    })
  );


  const pending = createAction(
    typePrefix + '/pending',
    (requestId, arg, meta) => ({
      payload: undefined,
      meta: {
        ...(meta|| {}),
        arg,
        requestId,
        requestStatus: 'pending',
      },
    })
  )

  const rejected = createAction(
    typePrefix + '/rejected',
    (
      error,
      requestId,
      arg,
      payload,
      meta
    ) => ({
      payload,
      error: ((options && options.serializeError) || miniSerializeError)(
        error || 'Rejected'
      ),
      meta: {
        ...(meta|| {}),
        arg,
        requestId,
        rejectedWithValue: !!payload,
        requestStatus: 'rejected',
        aborted: error?.name === 'AbortError',
        condition: error?.name === 'ConditionError',
      },
    })
  )

  let displayedWarning = false

  const AC =
    typeof AbortController !== 'undefined'
      ? AbortController
      : class {
          signal = {
            aborted: false,
            addEventListener() {},
            dispatchEvent() {
              return false
            },
            onabort() {},
            removeEventListener() {},
          }
          abort() {}
        }

  function actionCreator(arg) {
    return (dispatch, getState, extra) => {
      let abortReason;

      const abortController = new AC()

      const abortedPromise = new Promise((_, reject) =>
        abortController.signal.addEventListener('abort', () =>
          reject({ name: 'AbortError', message: abortReason || 'Aborted' })
        )
      )

      let started = false
      function abort(reason) {
        if (started) {
          abortReason = reason
          abortController.abort()
        }
      }

      const promise = (async function() {
        let finalAction;
        try {
          started = true
          dispatch(
            pending()
          )

          finalAction = await Promise.race([
            abortedPromise,
            Promise.resolve(
              payloadCreator(arg)
            )
          ])
        }
      })()

      return Object.assign(promise, {
        abort,
        requestId,
        arg,
        unwrap() {
          return promise.then<any>(unwrapResult)
        },
      })

    }
  }


  return Object.assign(
    actionCreator,
    {
      pending,
      rejected,
      fulfilled,
      typePrefix,
    }
  )
}