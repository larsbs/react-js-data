import '@babel/polyfill';
import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import { JsDataProvider } from './react-js-data';
import Groups from './components/Groups';
import Group from './components/Group';
import User from './components/User';
import store from './js-data-store';

function App() {
  return (
    <div className="App">
      <JsDataProvider store={store}>
        <Router>
          <Switch>
            <Route path="/user/:id" component={User} />
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
