type Listener = () => void;

function createEventBus() {
  const listeners = new Set<Listener>();

  return {
    subscribe(fn: Listener) {
      listeners.add(fn);
      return () => {
        listeners.delete(fn);
      };
    },
    emit() {
      listeners.forEach((fn) => fn());
    },
  };
}

export const dbEvents = createEventBus();
