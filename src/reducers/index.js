import {combineReducers} from 'redux';
import userReducer from './user_reducer';


const rootReducer = combineReducers({
  currentUser: userReducer
});

export default rootReducer;
