import { DataStore } from 'js-data';
import { HttpAdapter } from 'js-data-http';

import group from './models/group';

const store = new DataStore();
const adapter = new HttpAdapter({
  basePath: 'https://yk9mo9r44v.sse.codesandbox.io/api',
});

store.registerAdapter('http', adapter, { default: true });

group(store);

export default store;