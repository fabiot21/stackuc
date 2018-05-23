import React, { Component } from 'react';
import { Modal, Form } from 'semantic-ui-react'
import { withRouter } from 'react-router-dom';
import { base } from './Firebase';

class NewQuestionForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      title: '',
      content: '',
      tags: ''
    }
  }

  onFormSubmit(e) {
    e.preventDefault();
    base.push('questions', {
      data: {
        title: this.state.title,
        content: this.state.content,
        tags: this.state.tags,
        votes: 0,
        points: 0,
        answered: false,
        answers: 0,
        views: 0
      }
    }).then(() => {
      if (this.props.location.pathname === '/preguntas') {
        window.location.reload()
      } else {
        this.props.history.push('/preguntas')
        this.props.close()
      }
    })
  }

  render() {
    return (
        <Modal.Content>
          <Form
            onSubmit={(e) => this.onFormSubmit(e)}>
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
            <Form.Input
              fluid
              placeholder='Etiquetas (e.g: Machine Learning, Python, Big Data)'
              value={this.state.tags}
              onChange={(e) => this.setState({ tags: e.target.value})}
                />
              <Form.Button floated="right" primary>Enviar</Form.Button>
              <br />
              <br />
          </Form>
        </Modal.Content>
    )
  }
}

export default withRouter(NewQuestionForm);
