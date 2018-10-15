import { DataStore } from 'js-data';

import { GraphQLAdapter } from './js-data-graphql';
import group from './models/group';

class ObservableDataStore extends DataStore {
  _subscribeListeners = [];

  constructor(...args) {
    super(...args);
    this._callListeners = this._callListeners.bind(this);
    this._subscribeToEvents();
  }

  subscribe(listener) {
    this._subscribeListeners.push(listener);
  }

  unsubscribe(listener) {
    this._subscribeListeners = this._subscribeListeners.filter(
      (l) => l !== listener,
    );
  }

  _callListeners(...args) {
    this._subscribeListeners.forEach((listener) => listener(...args));
  }

  _subscribeToEvents() {
    this.on('add', this._callListeners);
    this.on('remove', this._callListeners);
  }
}

const store = new ObservableDataStore();
const adapter = new GraphQLAdapter({
  basePath: 'http://localhost:5000/api',
  graphqlPath: 'http://localhost:5000/graphql',
});

store.registerAdapter('http', adapter, { default: true });

group(store);

export default store;
