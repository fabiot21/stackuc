import React, { Component } from 'react'
import Logo from '../assets/logoWhite.png'
import { Link } from 'react-router-dom';
import { Sidebar, Segment, Menu, Image, Icon } from 'semantic-ui-react'

class SidebarComponent extends Component {
  constructor(props) {
    super(props);

    let activeMenu;

    if (window.location.href.indexOf("preguntas") > -1) {
      activeMenu = 'questions'
    } else if (window.location.href.indexOf("tutoriales") > -1) {
      activeMenu = 'tutorials'
    } else {
      activeMenu = 'home'
    }

    this.state = {
      visible: true,
      active: activeMenu
     }
  }


  toggleVisibility = () => this.setState({ visible: !this.state.visible })

  render() {
    const { visible } = this.state
    return (
        <Sidebar.Pushable as={Segment} className="sidebar">
          <Sidebar as={Menu} animation='push' width='thin' visible={visible} vertical inverted>
            <Menu.Item className="logo" name="logo">
              <Image size="medium" src={Logo} />
            </Menu.Item>
            <Link to="/">
              <Menu.Item
                size="large"
                onClick={() => this.setState({ active: 'home' })}
                className="pointer" active={this.state.active === 'home'} name='inicio'>
                <Icon name='home' />
                Inicio
              </Menu.Item>
            </Link>
            <Link to="/preguntas">
              <Menu.Item
                onClick={() => this.setState({ active: 'questions' })}
                className="pointer"
                active={this.state.active === 'questions'}
                name='questions'>
                <Icon name='question' />
                Preguntas
              </Menu.Item>
            </Link>
            <Link to="/tutoriales">
              <Menu.Item
                onClick={() => this.setState({ active: 'tutorials' })}
                className="pointer"
                active={this.state.active === 'tutorials'}
                name='tutorials'>
                <Icon name='book' />
                Tutoriales
              </Menu.Item>
            </Link>
          </Sidebar>
        </Sidebar.Pushable>
    )
  }
}

export default SidebarComponent
