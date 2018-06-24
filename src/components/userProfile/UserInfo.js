import React, { Component } from 'react';
import { Card, Icon, Image } from 'semantic-ui-react'
import DefaultAvatar from '../../assets/default-avatar.png'


class UserInfo extends Component {
  render(){
    return(
      <Card>
        <Image src={DefaultAvatar} />
        <Card.Content>
          <Card.Header>{this.props.currentUser.userName}</Card.Header>
          <Card.Meta>
            <span className='date'>{this.props.currentUser.userEmail}</span>
          </Card.Meta>
        </Card.Content>
      </Card>
    )
  }
}

export default UserInfo;
