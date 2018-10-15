import '@babel/polyfill';
import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import { JsDataProvider } from './react-js-data';
import Groups from './Groups';
import Group from './Group';
import store from './js-data-store';

function App() {
  return (
    <div className="App">
      <JsDataProvider store={store}>
        <Router>
          <Switch>
            <Route path="/group/:id" component={Group} />
            <Route path="/" component={Groups} />
          </Switch>
        </Router>
      </JsDataProvider>
    </div>
  );
}

const rootElement = document.getElementById('root');
ReactDOM.render(<App />, rootElement);
