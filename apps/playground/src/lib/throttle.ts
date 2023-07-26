export function throttle<TArgs extends any[]>(func: (...args: TArgs) => void, wait: number) {
  let timeout: ReturnType<typeof setTimeout> | undefined = undefined;

  let lastCallContext: any | undefined = undefined;
  let lastCallArgs: TArgs | undefined = undefined;

  const later = () => {
    if (lastCallArgs !== undefined) {
      func.apply(lastCallContext, lastCallArgs);
      lastCallContext = undefined;
      lastCallArgs = undefined;

      timeout = setTimeout(later, wait);
    } else {
      timeout = undefined;
    }
  };

  function wrapper(this: any, ...args: TArgs) {
    if (timeout !== undefined) {
      lastCallContext = this;
      lastCallArgs = args;
      return;
    }

    func.apply(this, args);
    timeout = setTimeout(later, wait);
  }

  wrapper.cancel = function cancel() {
    if (timeout !== undefined) {
      clearTimeout(timeout);
    }
  };

  return wrapper;
}
