import React, { Component } from 'react';
import { HashRouter, Route, Redirect, Switch } from 'react-router-dom';
import SchedulePage from './SchedulePage'

class App extends Component {
    render() {
        return (
          <div>
            <HashRouter>
                <Switch>
                    <Route exact path="/" render={() => <Redirect to="/start"/>} />
                    <Route path="/start" component={SchedulePage} />
                </Switch>
            </HashRouter>
          </div>
        );
    }
}

export default App;