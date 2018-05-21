import React, { Component } from 'react';
import { Modal, Button, Form, Grid, Header, Segment } from 'semantic-ui-react';
import { fRegister } from './Firebase';

class Register extends Component {
  constructor(props) {
    super(props);

    this.state = {
      email: '',
      password: '',
      password2: ''
    }
  }

  onFormSubmit() {
    fRegister(this.state.email, this.state.password)
      .then((data) => {
        this.props.registerSuccess()
        console.log(data)
      });
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

export default Register;
