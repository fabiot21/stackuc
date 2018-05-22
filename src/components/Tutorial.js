import React, { Component } from 'react';
import { Confirm, Icon, Segment, Label, Header,Form, Comment,Loader, Rating } from 'semantic-ui-react';
import ReactMarkdown from 'react-markdown';
import { base } from './Firebase';
import { auth } from './Firebase'

import DefaultAvatar from '../assets/default-avatar.png'

class Tutorial extends Component {
  constructor(props) {
    super(props);

    this.state = {
      tutorialId: this.props.match.params.tutorialid,
      tutorialRating: 0,
      commentInput: '',
      commentsData: [],
      confirmDialogOpen: false
    }
  }

  componentDidMount() {
    this.fetchTutorialData();
    this.bindComments();
  }

  fetchTutorialData() {
    base.fetch('tutorials/' + this.state.tutorialId, {
      context: this,
      asArray: false,
      then(data){
        this.setState({ tutorialData: data })
      }
    });
  }

  handleSubmit() {
    if (this.state.commentInput === ''){
      return
    }

    base.push(`comments/${this.state.tutorialId}`, {
    data: {
      userEmail: auth.currentUser.email,
      content: this.state.commentInput
    }
    })

    this.setState({ commentInput: '' })
  }

  bindComments() {
    base.bindToState('comments/' + this.state.tutorialId, {
      context: this,
      state: 'commentsData',
      asArray: true
    })

  }

  renderDeleteButton(key) {
    return (
      <div onClick={() => this.setState({confirmDialogOpen: true})} >
        <Confirm
          dimmer="blurring"
          cancelButton = 'Cancelar'
          confirmButton = 'Si'
          content = '¿Estás seguro de borrar esta respuesta?'
          open={this.state.confirmDialogOpen}
          onCancel={() => this.setState({confirmDialogOpen: false})}
          onConfirm={() => {
            this.setState({confirmDialogOpen: false}) ;
            base.remove(`comments/${this.state.tutorialId}/${key}`)

          }}
        />

        <Icon color='red' name='delete' size='large'/>
      </div>
    )
  }

  renderCommentGroup() {
    var COMMENTS;
    if (this.state.commentsData.length === 0) {
      COMMENTS = (<div>No hay comentarios</div>)
    } else {
      COMMENTS = this.state.commentsData.map(comment => {
        return (
          <Segment key={comment.key}>
            <Comment>
              <Comment.Avatar src={DefaultAvatar}/>
              <div className="right pointer">
                {auth.currentUser && comment.userEmail === auth.currentUser.email? this.renderDeleteButton(comment.key) : null}
              </div>
              <Comment.Content>
                <Comment.Author as='a'>{comment.userEmail}</Comment.Author>
                <Comment.Text>
                  <ReactMarkdown source={comment.content}/>
                </Comment.Text>
              </Comment.Content>
            </Comment>
          </Segment>
        )
      })
    }
    return (
      <Comment.Group>
        <Header as='h2' dividing>Comentarios</Header>
        {COMMENTS}
        {auth.currentUser? (
          <Form reply onSubmit={() => this.handleSubmit()}>
            <Form.TextArea id='field_answer' name='comment' value={this.state.commentInput} onChange={(e) => this.setState({ commentInput: e.target.value })}/>
            <Form.Button content='Agregar Comentario' labelPosition='left' icon='edit' primary />
          </Form>
        ) : (<div>Debes estar logueado para comentar</div>)}

      </Comment.Group>
    )
  }

  render() {
    if (!this.state.tutorialData) {
      return (
        <Loader active inline='centered' />
      )
    }

    const tags = this.state.tutorialData.tags.split(',').map((tag, idx) => {
      return (
        <Label key={idx} disabled={true}>{tag}</Label>
      )
    })


    return (
      <div className="container">
        <Rating className = 'right' icon='star' rating={this.state.tutorialRating} maxRating={5} onRate={() => {}} />
        <h1> {this.state.tutorialData.title} </h1>
        {tags}
        <Segment>
          <ReactMarkdown source={this.state.tutorialData.content}/>
        </Segment>
        {this.renderCommentGroup()}
      </div>
    );
  }
}

export default Tutorial;
