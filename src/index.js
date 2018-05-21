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
import Questions from './components/Questions';
import NewTutorialForm from './components/NewTutorialForm';
import Tutorials from './components/Tutorials';
import Question from './components/Question';
import Tutorial from './components/Tutorial';
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
            <Route exact path='/preguntas' component={Questions}/>
            <Route exact path='/creartutorial' component={NewTutorialForm}/>
            <Route exact path='/tutoriales' component={Tutorials}/>
            <Route exact path='/preguntas/:preguntaid/:titulopregunta' component={Question} />
            <Route exact path='/tutoriales/:tutorialid/:titulotutorial' component={Tutorial} />
          </Switch>
        </div>
      </div>
    </BrowserRouter>
  </Provider>, document.getElementById('root')
);
registerServiceWorker();
