import React, { Component } from 'react';
import { Form } from 'semantic-ui-react'

import { base } from './Firebase';

class NewTutorialForm extends Component {
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
    base.push('tutorials', {
      data: {
        title: this.state.title,
        content: this.state.content,
        tags: this.state.tags,
        votes: 0,
        points: 0,
        comments: 0
      }
    }).then(() => {
      this.props.history.push('/tutoriales')
    })
  }

  render() {
    return (
      <div>
        <h1>Nuevo Tutorial</h1>
        <Form
          onSubmit={(e) => this.onFormSubmit(e)}>
          <Form.Input
            fluid
            placeholder='Título'
            value={this.state.title}
            onChange={(e) => this.setState({ title: e.target.value})}
            />
          <Form.TextArea
            rows="35"
            placeholder='Contenido'
            value={this.state.content}
            onChange={(e) => this.setState({ content: e.target.value})}
            />
          <Form.Input
            fluid
            placeholder='Etiquetas (e.g: Machine Learning, Python, Big Data)'
            value={this.state.tags}
            onChange={(e) => this.setState({ tags: e.target.value})}
            />
          <Form.Button floated="right" primary>Crear Tutorial</Form.Button>
         </Form>
      </div>
    )
  }
}

export default NewTutorialForm;
