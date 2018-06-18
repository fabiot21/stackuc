import { base } from '../components/Firebase.js'
export const SET_CURRENT_USER = 'SET_CURRENT_USER';
export const REMOVE_CURRENT_USER = 'REMOVE_CURRENT_USER';

export function setUserInfo(userEmail) {
  const REQUEST = base.fetch('users/', {
        context: this,
        asArray: false,
        queries: {
          orderByChild: 'userEmail',
          equalTo: userEmail
          }
      })
      .then((response) => {console.log("HOLI", response); return response})
      .catch((error) => console.log(error))
  return {
    type: SET_CURRENT_USER,
    payload: REQUEST
  }
}

export function removeCurrentUser(){
  return {
    type: REMOVE_CURRENT_USER,
    payload: {}
  }
}
