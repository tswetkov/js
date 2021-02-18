export function createMachine(initailConfig) {
  const config = { ...initailConfig };
  let state = config.initial;

  return {
    call(event) {
      if (event) {
        state = config.states[state].on[event];
      }
      return state;
    },
  };
}

export function interpret(machine) {
  const callbacks = [];

  return {
    onTransition(cb) {
      callbacks.push(cb);

      return this;
    },
    send(event, payload) {
      const state = machine.call(event);
      callbacks.forEach((cb) => cb(state, payload));
    },
  };
}
