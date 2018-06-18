import React, { Component } from 'react';
import LoginForm from './LoginForm';
import NewQuestionForm from './NewQuestionForm';
import NewTutorialForm from './NewTutorialForm';
import { fLogout, auth } from './FireBase';
import { Link } from 'react-router-dom';
import { Input, Menu, Icon, Modal } from 'semantic-ui-react'

export default class Header extends Component {
  state = {
    activeUser: false,
    newQuestionOpen: false,
    newTutorialOpen: false
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
    return (
      <Menu className="container" secondary>
        <Menu.Item name="home">
          <Link style={{ color: "inherit" } } to="/">
            <Icon name='home' />
          </Link>
        </Menu.Item>
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
          <NewQuestionForm close={() => this.setState({ newTutorialOpen: false })}/>
        </Modal>
        <Menu.Item name="crear tutorial">
          <Modal
            onOpen={() => this.setState({ newTutorialOpen: true })}
            onClose={() => this.setState({ newTutorialOpen: false })}
            open={this.state.newTutorialOpen}
            closeOnDimmerClick={false}
            size="large"
            dimmer="blurring"
            trigger={
              <Menu.Item name='crear tutorial'/>
            } closeIcon>
            <Modal.Header>Nuevo Tutorial</Modal.Header>
            <NewTutorialForm close={() => this.setState({ newTutorialOpen: false })}/>
          </Modal>
        </Menu.Item>
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
