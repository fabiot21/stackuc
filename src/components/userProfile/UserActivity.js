import React, { Component } from 'react';
import { Menu, Feed, Card, Icon, Image } from 'semantic-ui-react'
import DefaultAvatar from '../../assets/default-avatar.png'
import UserQuestions from './UserQuestions'

class UserInfo extends Component {

  constructor(props){
    super(props)
    this.state = {optionPicked: "preguntas"}
    this.handleItemClick = this.handleItemClick.bind(this)
  }

  handleItemClick(e, { name }){
      this.setState({optionPicked: name})
      console.log(name)
  }

  renderContent(){
    switch(this.state.optionPicked){
      case "preguntas":
        return <UserQuestions/>
      case "tutoriales":
        return <div> Tutoriales </div>
      case "respuestas":
        return <div> Respuestas </div>
      default:
        return
    }
  }
  render(){
    return(
      <div>
      <Menu pointing secondary>
        <Menu.Item name='preguntas' active={this.state.optionPicked === 'preguntas'} onClick={this.handleItemClick} />
        <Menu.Item
          name='tutoriales'
          active={this.state.optionPicked === 'tutoriales'}
          onClick={this.handleItemClick}
        />
        <Menu.Item
          name='respuestas'
          active={this.state.optionPicked === 'respuestas'}
          onClick={this.handleItemClick}
        />
      </Menu>
      {this.renderContent()}
      </div>
    )
  }
}

export default UserInfo;
