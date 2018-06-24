import React, { Component } from 'react';
import { Card, Icon, Image, Grid} from 'semantic-ui-react'
import DefaultAvatar from '../../assets/default-avatar.png'
import UserInfo from './UserInfo'
import UserActivity from './UserActivity'
import { base } from '../Firebase'
import { connect } from 'react-redux'

class UserProfile extends Component {
  render(){
    return(
      <Grid>
        <Grid.Column width={13}>
          <UserActivity/>
        </Grid.Column>

        <Grid.Column width={3}>
            <UserInfo currentUser={this.props.currentUser}/>
        </Grid.Column>
    </Grid>
    )
  }
}


function mapStateToProps({ currentUser }){
  return {
    currentUser
  }
}

export default connect(
  mapStateToProps,
  { })(UserProfile)
