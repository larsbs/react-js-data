import '@babel/polyfill';
import React from 'react';
import ReactDOM from 'react-dom';

import { JsDataProvider } from './react-js-data';
import Groups from './Groups';
import store from './js-data-store';

function App() {
  return (
    <div className="App">
      <JsDataProvider store={store}>
        <Groups />
      </JsDataProvider>
    </div>
  );
}

const rootElement = document.getElementById('root');
ReactDOM.render(<App />, rootElement);
