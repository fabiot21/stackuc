import React, { Component } from 'react';
import { Modal, Form } from 'semantic-ui-react'
import { withRouter } from 'react-router-dom';
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
    if (this.state.title === 0 || this.state.content === 0 || this.state.tags.length === 0) {
      return false
    }
    base.push('tutorials', {
      data: {
        title: this.state.title,
        content: this.state.content,
        tags: this.state.tags,
        votes: 0,
        points: 0,
        comments: 0,
        views: 0
      }
    }).then((data) => {
      if (this.props.location.pathname === '/tutoriales') {
        window.location.reload()
      } else {
        this.props.history.push('/tutoriales')
        this.props.close()
      }
      this.state.tags.split(',').map(tag => {
        return base.push(`tags/${tag.trim()}/tutorials/`, {
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
            rows="33"
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
         <br />
         <br />
      </Modal.Content>
    )
  }
}

export default withRouter(NewTutorialForm);
