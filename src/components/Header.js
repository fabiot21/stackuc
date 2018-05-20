import React, { Component } from 'react';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';
import NewQuestionForm from './NewQuestionForm';
import { fLogout, auth } from './FireBase';
import Logo from '../assets/logo.png';
import { Link } from 'react-router-dom';
import { Input, Menu, Icon, Modal, Image } from 'semantic-ui-react'

export default class Header extends Component {
  state = {
    activeItem: 'home',
    activeUser: false,
    newQuestionOpen: false
   }

  componentDidMount() {
    auth.onAuthStateChanged((user) => {
      if (user) {
        this.setState({ activeUser: true })
      } else {
        this.setState({ activeUser: false })
      }
    })
  }

  logout() {
    fLogout()
  }

  render() {
    const { activeItem } = this.state

    return (
      <Menu className="container" secondary>
        <Link to="/">
          <Menu.Item name="home">
            <Icon name='home' />
          </Menu.Item>
        </Link>
        <Modal
          onOpen={() => this.setState({ newQuestionOpen: true })}
          onClose={() => this.setState({ newQuestionOpen: false })}
          open={this.state.newQuestionOpen}
          closeOnDimmerClick={false}
          size="large"
          dimmer="blurring"
          trigger={
            <Menu.Item name='hacer pregunta'/>
          } closeIcon>
          <Modal.Header>Hacer Pregunta</Modal.Header>
          <NewQuestionForm close={() => this.setState({ newQuestionOpen: false })}/>
        </Modal>
        <Menu.Item name='crear tutorial' />
        <Menu.Menu position='right'>
          <Menu.Item>
            <Input icon='search' placeholder='Buscar...' />
          </Menu.Item>
          {!this.state.activeUser? (
            <Modal dimmer="blurring" trigger={
                <Menu.Item name='Iniciar Sesión'/>
              }>
              <LoginForm register={false}/>
            </Modal>
          ) : (
            <Menu.Item name='Cerrar Sesión' onClick={() => this.logout()} />
          )}
          {!this.state.activeUser? (
            <Modal dimmer="blurring"
              trigger= {
                <Menu.Item name='Registrate'/>
              }>
              <LoginForm register={true}/>
            </Modal>
          ) : null}
        </Menu.Menu>
      </Menu>
    )
  }
}
