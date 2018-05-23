import React, { Component } from 'react';
import { Statistic, Confirm, Icon, Segment, Label, Header,Form, Comment,Loader, Rating } from 'semantic-ui-react';
import ReactMarkdown from 'react-markdown';
import { base, fBase } from './Firebase';
import { auth } from './Firebase'

import DefaultAvatar from '../assets/default-avatar.png'

class Tutorial extends Component {
  constructor(props) {
    super(props);

    this.state = {
      tutorialId: this.props.match.params.tutorialid,
      tutorialRating: 0,
      personalRating: 0,
      commentInput: '',
      commentsData: [],
      confirmDialogOpen: false,
      hasVoted: false
    }
  }

  componentDidMount() {
    this.fetchTutorialData();
    this.fetchTutorialRating();
    this.bindComments();
  }

  fetchTutorialData() {
    base.fetch('tutorials/' + this.state.tutorialId, {
      context: this,
      asArray: false,
      then(data){
        this.setState({ tutorialData: data })
        fBase.database().ref(`tutorials/${this.state.tutorialId}/views`).transaction((i) => {
          return i + 1;
        });
      }
    });
  }

  fetchTutorialRating() {
    base.fetch('tutorials/' + this.state.tutorialId, {
      context: this,
      asArray: false,
      then(data){
        if (data.votes !== 0) {
          this.setState({ tutorialRating: Math.round(data.points/data.votes) })
        }
      }
    });

    if (!auth.currentUser) {
      return false
    }

    base.fetch(`ratings/tutorials/${this.state.tutorialId}/users/${auth.currentUser.uid}/rating`, {
      context: this,
      asArray: false,
      then(data){
        this.setState({ hasVoted: true, personalRating: data })

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
    }).then(() => {
      fBase.database().ref(`tutorials/${this.state.tutorialId}/comments`).transaction((i) => {
        return i + 1;
      });
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

  submitRating(e, { rating }) {
    if (!auth.currentUser) {
      return false
    }
    fBase.database().ref().transaction(root => {
      if (root && root.tutorials && root.ratings && auth.currentUser) {
        if (this.state.hasVoted) {
          root.tutorials[this.state.tutorialId].votes -= 1
          root.tutorials[this.state.tutorialId].points -= this.state.personalRating
        }
        root.tutorials[this.state.tutorialId].votes += 1
        root.tutorials[this.state.tutorialId].points += rating
      }
      return root;
    }).then(() => {
      base.update(`ratings/tutorials/${this.state.tutorialId}/users/${auth.currentUser.uid}`, {
        data: {
          rating: rating,
          userEmail: auth.currentUser.email
        }
      }).then(() => this.fetchTutorialRating())
    });
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
        <Statistic size="tiny" className="right" color="yellow">
          <Statistic.Value><Icon name='star' /> {this.state.tutorialRating}</Statistic.Value>
        </Statistic>
        <h1> {this.state.tutorialData.title} </h1>
        <Rating className = '' icon='star' rating={this.state.personalRating} maxRating={5} onRate={(e, values) => this.submitRating(e, values)} />
        <br />
        <br />
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
