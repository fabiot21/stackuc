import React, { Component } from 'react';
import { Modal, Form } from 'semantic-ui-react'
import { withRouter } from 'react-router-dom';
import { base, auth } from './Firebase';

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
    if (this.state.title === 0 || this.state.content === 0 || this.state.tags.length === 0 || !auth.currentUser) {
      return false
    }
    const userEmail = auth.currentUser.email || null;
    base.push('questions', {
      data: {
        author: userEmail,
        title: this.state.title,
        content: this.state.content,
        tags: this.state.tags,
        votes: 0,
        points: 0,
        answered: false,
        answers: 0,
        views: 0,
        author: auth.currentUser.email
      }
    }).then((data) => {
      if (this.props.location.pathname === '/preguntas') {
        window.location.reload()
      } else {
        this.props.history.push('/preguntas')
        this.props.close()
      }
      this.state.tags.split(',').map(tag => {
        return base.push(`tags/${tag.trim()}/questions/`, {
          data: {
            key: data.key
          }
        })
      })

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
