import React, { Component } from 'react'
import Register from './RegisterForm';
import { fLogin, auth } from './Firebase';
import { Modal, Button, Form, Grid, Header, Message, Segment } from 'semantic-ui-react'
import { connect } from 'react-redux'
import { setUserInfo } from '../actions/user_actions.js'

class LoginForm extends Component {
  constructor(props){
    super(props);

    this.state = {
      register: props.register,
      email: '',
      password: '',
      loading: false,
      error: false
    }
  }

  onLoginFormSubmit() {
    this.setState({ loading: true })
    fLogin(this.state.email, this.state.password)
      .then((data) => {
        this.props.setUserInfo(this.state.email)
        this.setState({ loading: false, error: false })
      })
      .catch(err => {
        console.log(err)
        this.setState({ error: true, loading: false })
      })
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
                    {this.state.error? (
                      <Message negative>
                        <p>Usuario inválido</p>
                      </Message>
                    ) : null}
                    <Button loading={this.state.loading} color='blue' fluid size='large'>Entrar</Button>
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

function mapStateToProps({ currentUser , setUserInfo}){
  return {
    currentUser, setUserInfo
  }
}

export default connect(
  mapStateToProps,
  { setUserInfo })(LoginForm)
