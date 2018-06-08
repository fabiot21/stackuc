import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import Home from './components/Home';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import ReduxPromise from 'redux-promise';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import rootReducer from './reducers';
import registerServiceWorker from './registerServiceWorker';

import 'semantic-ui-css/semantic.min.css';


import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Question from './components/Question';
import Tutorial from './components/Tutorial';
import NewestList from './components/shared/NewestList';
import TagsNewestList from './components/shared/TagsNewestList';
const storeWithMiddleWare = applyMiddleware(ReduxPromise)(createStore);

ReactDOM.render(
  <Provider store={storeWithMiddleWare(rootReducer)}>
    <BrowserRouter>
      <div>
        <Header />
        <Sidebar />
        <div className="marginSide">
          <Switch>
            <Route exact path='/' component={Home}/>
            <Route exact path='/preguntas' component={() => <NewestList data="questions"/>}/>
            <Route exact path='/tutoriales' component={() => <NewestList data="tutorials"/>}/>
            <Route exact path='/preguntas/:preguntaid/:titulopregunta' component={Question} />
            <Route exact path='/tutoriales/:tutorialid/:titulotutorial' component={Tutorial} />
            <Route exact path='/tags/preguntas/:tag' component={() => <TagsNewestList data="questions"/>} />
            <Route exact path='/tags/tutoriales/:tag' component={() => <TagsNewestList data="tutorials"/>} />
          </Switch>
        </div>
      </div>
    </BrowserRouter>
  </Provider>, document.getElementById('root')
);
registerServiceWorker();
