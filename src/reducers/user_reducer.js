import { SET_CURRENT_USER } from '../actions/user_actions';
import { REMOVE_CURRENT_USER } from '../actions/user_actions'
const initialState = {"userName": "", "userEmail": ""};

export default function(state = initialState, action) {
  switch (action.type) {
    case SET_CURRENT_USER:
      const userNameValue = Object.keys(action.payload)[0]
      const userEmailValue = action.payload[Object.keys(action.payload)[0]].userEmail
      return { "userName": userNameValue, "userEmail": userEmailValue }
    case REMOVE_CURRENT_USER:
      return initialState;
    default:
      return state;
  }
}
