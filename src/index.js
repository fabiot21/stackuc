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
import { PersistGate } from 'redux-persist/integration/react'
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage' // defaults to localStorage for web and AsyncStorage for react-native
import { composeWithDevTools } from 'redux-devtools-extension'; //Firefox debug tools




import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Question from './components/Question';
import Tutorial from './components/Tutorial';
import NewestList from './components/shared/NewestList';
import TagsNewestList from './components/shared/TagsNewestList';
import UserProfile from './components/UserProfile';

const persistConfig = {
  key: 'root',
  storage,
}
const persistedReducer = persistReducer(persistConfig, rootReducer);

const storeWithMiddleWare = createStore(persistedReducer, composeWithDevTools(
  applyMiddleware(ReduxPromise),
));

ReactDOM.render(
  <Provider store={storeWithMiddleWare}>
  <PersistGate loading={null} persistor={persistStore(storeWithMiddleWare)}>
    <BrowserRouter>
      <div>
        <Header />
        <Sidebar />
        <div className="marginSide">
          <Switch>
            <Route exact path='/' component={Home}/>
            <Route exact path='/profile/:userName' component= {UserProfile}/>
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
    </PersistGate>
  </Provider>, document.getElementById('root')
);
registerServiceWorker();
