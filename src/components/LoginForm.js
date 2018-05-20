import React, { Component } from 'react'
import Register from './RegisterForm';
import { fLogin, auth } from './FireBase';
import { Modal, Button, Form, Grid, Header, Image, Message, Segment } from 'semantic-ui-react'

class LoginForm extends Component {
  constructor(props){
    super(props);

    this.state = {
      register: props.register,
      email: '',
      password: ''
    }
  }

  onLoginFormSubmit() {
    fLogin(this.state.email, this.state.password)
      .then((data) => console.log(auth.currentUser));
  }

  render() {
    if (this.state.register) {
      return (
        <Register registerSuccess={() => this.setState({ register: false })}/>
      )
    }
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
                  Iniciar Sesión
                </Header>
                <Form
                  onSubmit={() => this.onLoginFormSubmit()}
                  size='large'>
                  <Segment stacked>
                    <Form.Input
                      fluid
                      icon='user'
                      iconPosition='left'
                      placeholder='E-mail address'
                      value={this.state.email}
                      onChange={(e) => this.setState({ email: e.target.value })}
                      />
                    <Form.Input
                      fluid
                      icon='lock'
                      iconPosition='left'
                      placeholder='Password'
                      type='password'
                      value={this.state.password}
                      onChange={(e) => this.setState({ password: e.target.value })}
                      />

                    <Button color='blue' fluid size='large'>Entrar</Button>
                  </Segment>
                </Form>
                <Message>
                  Eres nuevo? <a className="pointer" onClick={() => this.setState({ register: true })}>Registrate!</a>
              </Message>
            </Grid.Column>
          </Grid>
        </div>
      </Modal.Content>
    )
  }
}

export default LoginForm
