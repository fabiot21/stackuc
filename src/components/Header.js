import React, { Component } from 'react';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';
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
        <Menu.Item name="home" onClick={this.handleItemClick}>
          <Image size="small" src={Logo} />
        </Menu.Item>
        <Menu.Item name='hacer pregunta' active={activeItem === 'hacer pregunta'} onClick={this.handleItemClick} />
        <Menu.Item name='crear tutoriales' active={activeItem === 'crear tutoriales'} onClick={this.handleItemClick} />
        <Menu.Menu position='right'>
          <Menu.Item>
            <Input icon='search' placeholder='Buscar...' />
          </Menu.Item>
          {!this.state.activeUser? (
              <Menu.Item name='login' active={activeItem === 'login'} onClick={this.handleItemClick}>
                <Modal trigger={<div>Iniciar Sesión</div>}>
                  <LoginForm />
                </Modal>
              </Menu.Item>
          ) : (
            <Menu.Item name='logout' active={activeItem === 'logout'} onClick={() => this.logout()} />
          )}
          {!this.state.activeUser? (
            <Menu.Item name='register' active={activeItem === 'register'} onClick={this.handleItemClick}>
              <Modal trigger={<div>Registrarse</div>}>
                <RegisterForm />
              </Modal>
            </Menu.Item>
          ) : null}
        </Menu.Menu>
      </Menu>
    )
  }
}
