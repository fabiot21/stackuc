import React, { Component } from 'react';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';
import NewQuestionForm from './NewQuestionForm';
import { fLogout, auth } from './FireBase';
import Logo from '../assets/logo.png';
import { Input, Menu, Icon, Modal, Image } from 'semantic-ui-react'

export default class Header extends Component {
  state = {
    activeItem: 'home',
    activeUser: false
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

  handleItemClick = (e, { name }) => this.setState({ activeItem: name })

  logout() {
    fLogout()
  }

  render() {
    const { activeItem } = this.state

    return (
      <Menu className="container" secondary>
        <Menu.Item name="home" active={activeItem === 'home'} onClick={this.handleItemClick}>
          <Icon name='home' />
        </Menu.Item>
        <Modal closeOnDimmerClick={false} size="large" dimmer="blurring" trigger={
            <Menu.Item name='hacer pregunta' active={activeItem === 'hacer pregunta'} onClick={this.handleItemClick} />
          } closeIcon>
          <Modal.Header>Hacer Pregunta</Modal.Header>
          <NewQuestionForm />
        </Modal>
        <Menu.Item name='crear tutorial' active={activeItem === 'crear tutorial'} onClick={this.handleItemClick} />
        <Menu.Menu position='right'>
          <Menu.Item>
            <Input icon='search' placeholder='Buscar...' />
          </Menu.Item>
          {!this.state.activeUser? (
            <Modal dimmer="blurring" trigger={
                <Menu.Item name='Iniciar Sesión' active={activeItem === 'Iniciar Sesión'} onClick={this.handleItemClick}/>
              }>
              <LoginForm register={false}/>
            </Modal>
          ) : (
            <Menu.Item name='Cerrar Sesión' active={activeItem === 'Cerrar Sesión'} onClick={() => this.logout()} />
          )}
          {!this.state.activeUser? (
            <Modal dimmer="blurring"
              trigger= {
                <Menu.Item name='Registrate' active={activeItem === 'Registrate'} onClick={this.handleItemClick}/>
              }>
              <LoginForm register={true}/>
            </Modal>
          ) : null}
        </Menu.Menu>
      </Menu>
    )
  }
}
