import React, { Component } from 'react';
import { Card, Icon, Image, Grid} from 'semantic-ui-react'
import DefaultAvatar from '../../assets/default-avatar.png'
import UserInfo from './UserInfo'
import UserActivity from './UserActivity'
import { base } from '../Firebase'
import { connect } from 'react-redux'

class UserProfile extends Component {

  constructor(props){
    super(props)
    this.state = {"userData": {"userName":"" , "userEmail":""}}
  }

  componentDidMount(){
    this.fetchUserEmail()
  }

  fetchUserEmail(){
    const userName= this.props.match.params.userName
      base.fetch('users/' + userName, {
        context: this,
        asArray: true,
        then(data){
          this.setState({"userData": {"userName": userName, "userEmail": data[0] }})
        }
      });
    }


  render(){
    return(
      <Grid>
        <Grid.Column width={13}>
          <UserActivity history={this.props.history} currentUser={this.state.userData}/>
        </Grid.Column>

        <Grid.Column width={3}>
            <UserInfo currentUser={this.state.userData}/>
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
