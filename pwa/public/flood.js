const Flood = Object.create(null);

Flood.Action = () => {
  const action = Object.create(null);
  action.emit = () => 0;
  action.bind = callback => {
    const emit = action.emit;
    action.emit = data => {
      emit(data);
      callback(data);
    };
    return action;
  };
  return action;
};

Flood.Dispatcher = actions => {
  const dispatcher = Object.create(null);
  actions.forEach(action => dispatcher[action] = Flood.Action());
  return dispatcher;
};

Flood.Store = initial => {
  const store = Flood.Dispatcher(['change']);
  store.state = initial;
  store.change.bind(state => store.state = state);
  return store;
};
