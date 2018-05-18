import React, { Component } from 'react';
import LoginForm from './LoginForm';
import { Input, Menu, Icon, Modal } from 'semantic-ui-react'

export default class MenuExampleSecondary extends Component {
  state = { activeItem: 'home' }

  handleItemClick = (e, { name }) => this.setState({ activeItem: name })

  render() {
    const { activeItem } = this.state

    return (
      <Menu className="container" secondary>
        <Menu.Item name="home" active={activeItem === 'home'} onClick={this.handleItemClick}>
          <Icon name='home' />
        </Menu.Item>
        <Menu.Item name='hacer pregunta' active={activeItem === 'hacer pregunta'} onClick={this.handleItemClick} />
        <Menu.Item name='crear tutoriales' active={activeItem === 'crear tutoriales'} onClick={this.handleItemClick} />
        <Menu.Menu position='right'>
          <Menu.Item>
            <Input icon='search' placeholder='Buscar...' />
          </Menu.Item>
          <Menu.Item name='Iniciar sesión' active={activeItem === 'logout'} onClick={this.handleItemClick}>
            <Modal trigger={<div>Iniciar Sesión</div>}>
              <LoginForm />
            </Modal>
          </Menu.Item>
          <Menu.Item name='Cerrar sesión' active={activeItem === 'logout'} onClick={this.handleItemClick} />
        </Menu.Menu>
      </Menu>
    )
  }
}
