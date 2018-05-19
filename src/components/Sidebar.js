import React, { Component } from 'react'
import Logo from '../assets/logoWhite.png'
import { Sidebar, Segment, Button, Menu, Image, Icon, Header } from 'semantic-ui-react'

class SidebarComponent extends Component {
  state = { visible: true }

  toggleVisibility = () => this.setState({ visible: !this.state.visible })

  render() {
    const { visible } = this.state
    return (
        <Sidebar.Pushable as={Segment} className="sidebar">
          <Sidebar as={Menu} animation='push' width='thin' visible={visible} vertical inverted>
            <Menu.Item className="logo" name="logo">
              <Image size="medium" src={Logo} />
            </Menu.Item>
            <Menu.Item className="pointer" name='question'>
              <Icon name='question' />
              Preguntas
            </Menu.Item>
            <Menu.Item className="pointer" name='book'>
              <Icon name='book' />
              Tutoriales
            </Menu.Item>
            <Menu.Item className="pointer" name='tag'>
              <Icon name='tag' />
              Tags
            </Menu.Item>
          </Sidebar>
        </Sidebar.Pushable>
    )
  }
}

export default SidebarComponent
