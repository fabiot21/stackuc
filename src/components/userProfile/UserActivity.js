import React, { Component } from 'react';
import { Feed, Card, Icon, Image } from 'semantic-ui-react'
import DefaultAvatar from '../../assets/default-avatar.png'


class UserInfo extends Component {
  render(){
    return(
        <Feed>
          <Feed.Event
            icon='pencil'
            date='Today'
            summary="You posted on your friend Stevie Feliciano's wall."
          />
        </Feed>
    )
  }
}

export default UserInfo;
