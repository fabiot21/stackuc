import React, { Component } from 'react';
import { Modal, Button, Form, Grid, Header, Segment } from 'semantic-ui-react';
import {auth,base } from './Firebase';
import { setUserInfo } from '../actions/user_actions.js'
import { connect } from 'react-redux'

class Register extends Component {
  constructor(props) {
    super(props);

    this.state = {
      email: '',
      password: '',
      password2: '',
      userName: '',
    }
  }

  onFormSubmit() {
    this.checkIfUserNameExistThenCreateAccount()
  }

  checkIfUserNameExistThenCreateAccount(){
    base.fetch('users/' + this.state.userName, {
      context: this,
      asArray: false,
      then(data){
        if(!data || Object.keys(data).length===0){ //Crear cuenta solo si el userName no existe de antemano
          this.createAccount()
        }
      }
    });
  }

  createAccount(){
    auth.createUserWithEmailAndPassword(this.state.email, this.state.password).then((authUser)=>this.props.registerSuccess())
    base.post('users/'+this.state.userName, {
      data: {
        userEmail: this.state.email
      }
    }).then(() => {
       this.props.registerSuccess()
       this.props.setUserInfo(this.state.email)
    })
  }


  render() {
    return (
      <Modal.Content>
        <div className='login-form'>
          <Grid
            textAlign='center'
            style={{ height: '100%' }}
            verticalAlign='middle'
            >
            <Grid.Column style={{ maxWidth: 450 }}>
              <Header as='h2' color='black' textAlign='center'>
                Registro
              </Header>
              <Form
                onSubmit={() => this.onFormSubmit()}
                size='large'>
                <Segment stacked>
                  <Form.Input
                    fluid
                    icon='user'
                    iconPosition='left'
                    placeholder='Nombre de usuario'
                    value={this.state.userName}
                    onChange={(e) => this.setState({ userName: e.target.value })}
                    />
                  <Form.Input
                    fluid
                    icon='mail'
                    iconPosition='left'
                    placeholder='E-mail'
                    value={this.state.email}
                    onChange={(e) => this.setState({ email: e.target.value })}
                    />
                  <Form.Input
                    fluid
                    icon='lock'
                    iconPosition='left'
                    placeholder='Contraseña'
                    type='password'
                    value={this.state.password}
                    onChange={(e) => this.setState({ password: e.target.value })}
                    />
                  <Form.Input
                    fluid
                    icon='lock'
                    iconPosition='left'
                    placeholder='Confirmar Contraseña'
                    type='password'
                    value={this.state.password2}
                    onChange={(e) => this.setState({ password2: e.target.value })}
                    />
                  <Button color='blue' fluid size='large'>Registrar</Button>
                </Segment>
              </Form>
            </Grid.Column>
          </Grid>
        </div>
      </Modal.Content>
    )
  }
}

function mapStateToProps({ currentUser , setUserInfo}){
  return {
    currentUser, setUserInfo
  }
}

export default connect(
  mapStateToProps,
  { setUserInfo })(Register)
