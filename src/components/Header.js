import React, { Component } from 'react';
import LoginForm from './LoginForm';
import NewQuestionForm from './NewQuestionForm';
import NewTutorialForm from './NewTutorialForm';
import { fLogout, auth } from './Firebase';
import { Link } from 'react-router-dom';
import { Input, Menu, Icon, Modal } from 'semantic-ui-react'
import { connect } from 'react-redux'

class Header extends Component {
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
        var userProfile;
        if (!this.props.currentUser || !this.props.currentUser.userName || (this.props.currentUser.userName=="")) {
          userProfile = <br/>;
        } else {
          userProfile = <Menu.Item name="perfil">
                        <Link style={{ color: "inherit" } } to={"/profile/" + this.props.currentUser.userName}>
                          <Icon name='user' />
                        </Link>
                      </Menu.Item>;
        }
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
          {userProfile}
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

function mapStateToProps({ currentUser }){
  return {
    currentUser
  }
}

export default connect(
  mapStateToProps,
  { })(Header)
