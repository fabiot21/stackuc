import React, { Component } from 'react';
import { Modal, Form } from 'semantic-ui-react'
import { withRouter } from 'react-router-dom';
import { base, fBase } from './FireBase';

class NewQuestionForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      title: '',
      content: ''
    }
  }

  onFormSubmit(e) {
    e.preventDefault();
    base.push('questions', {
      data: {
        title: this.state.title,
        content: this.state.content,
        votes: 0,
        rating: 0,
        answered: false
      }
    }).then(() => {
      this.props.history.push('/preguntas')
      this.props.close()
    })
  }

  render() {
    return (
        <Modal.Content>
          <Form
            onSubmit={(e) => this.onFormSubmit(e)}
            className="veryHeightForm">
            <Form.Input
              fluid
              placeholder='Título'
              value={this.state.title}
              onChange={(e) => this.setState({ title: e.target.value})}
               />
            <Form.TextArea
              rows="10"
              placeholder='Descripción (lo más detallada posible)'
              value={this.state.content}
              onChange={(e) => this.setState({ content: e.target.value})}
               />
            <Form.Button primary>Enviar</Form.Button>
          </Form>
        </Modal.Content>
    )
  }
}

export default withRouter(NewQuestionForm);
