import { DataStore } from 'js-data';
import { HttpAdapter } from 'js-data-http';


const store = new DataStore();
const adapter = new HttpAdapter({
  basePath: 'api',
});


store.registerAdapter('http', adapter, { default: true });


store.defineMapper('group');


store.find('group').then((group) => console.log(group));