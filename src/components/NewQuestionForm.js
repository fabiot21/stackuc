import React, { Component } from 'react';
import { Modal, Form } from 'semantic-ui-react'

class NewQuestionForm extends Component {
  render() {
    return (
        <Modal.Content>
          <Form className="veryHeightForm">
            <Form.Input fluid placeholder='Título' />
            <Form.TextArea rows="20" placeholder='Descripción (lo más detallada posible)' />
            <Form.Button primary>Enviar</Form.Button>
          </Form>
        </Modal.Content>
    )
  }
}

export default NewQuestionForm;
