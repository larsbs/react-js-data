import { DataStore } from 'js-data';
import { HttpAdapter } from 'js-data-http';

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

  _callListeners(...args) {
    this._subscribeListeners.forEach((listener) => listener(...args));
  }

  _subscribeToEvents() {
    this.on('add', this._callListeners);
    this.on('remove', this._callListeners);
  }
}

const store = new ObservableDataStore();
const adapter = new HttpAdapter({
  basePath: 'https://yk9mo9r44v.sse.codesandbox.io/api',
});

store.registerAdapter('http', adapter, { default: true });

group(store);

export default store;
