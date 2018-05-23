import React, { Component } from 'react';
import { Grid,Statistic, Confirm, Icon, Segment, Label, Header,Form, Comment,Loader, Rating } from 'semantic-ui-react';
import ReactMarkdown from 'react-markdown';
import { base, fBase } from './Firebase';
import { auth } from './Firebase'

import DefaultAvatar from '../assets/default-avatar.png'

class Question extends Component {
  constructor(props) {
    super(props);

    this.state = {
      questionId: this.props.match.params.preguntaid,
      questionRating: 0,
      personalRating: 0,
      answerInput: '',
      answersData: [],
      confirmDialogOpen: false,
      hasVoted: false,
      answerRatings: {},
    }
  }

  componentDidMount() {
    this.fetchQuestionRating();
    this.fetchQuestionData();
    this.handleAuthStateChange();
    this.bindAnswers();
  }


  handleAuthStateChange(){
    auth.onAuthStateChanged((user) => {
      if (user) {
        this.fetchAnswerRatings() //Si se hace la request antes de que se obtenga la data del usuario asincronamente crashea, asi que lo hago cuando llegue la data
      }
    })
  }

  fetchQuestionData() {
    base.fetch('questions/' + this.state.questionId, {
      context: this,
      asArray: false,
      then(data){
        this.setState({ questionData: data })
        fBase.database().ref(`questions/${this.state.questionId}/views`).transaction((i) => {
          return i + 1;
        });
      }
    });
  }

  fetchQuestionRating() {
    base.fetch('questions/' + this.state.questionId, {
      context: this,
      asArray: false,
      then(data){
        if (data.votes !== 0) {
          this.setState({ questionRating: Math.round(data.points/data.votes) })
        }
      }
    });
    if (!auth.currentUser) {
      return false
    }
    base.fetch(`ratings/questions/${this.state.questionId}/users/${auth.currentUser.uid}`, {
      context: this,
      asArray: false,
      then(data){
        if (data.rating) {
          this.setState({ hasVoted: true, personalRating: data.rating })
        }
      }
    });
  }

  fetchAnswerRatings(){
    base.fetch('ratings/questions/' + this.state.questionId+'/users/' + auth.currentUser.uid +'/answers/',{
    context: this,
    asArray: false,
    then(data){
      this.setState({answerRatings: data})
    }
    });
  }

  handleSubmit() {
    if (this.state.answerInput === ''){
      return
    }

    base.push(`answers/${this.state.questionId}`, {
      data: {
        userEmail: auth.currentUser.email,
        content: this.state.answerInput,
        votes: 0,
        points: 0,
      }
    }).then(() => {
      fBase.database().ref(`questions/${this.state.questionId}/answers`).transaction((i) => {
        return i + 1;
      });
    })
    this.setState({ answerInput: '' })
  }

  bindAnswers() {
    base.bindToState('answers/' + this.state.questionId, {
      context: this,
      state: 'answersData',
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
            fBase.database().ref(`questions/${this.state.questionId}/answers`).transaction((i) => {
              return i - 1;
            }).then(() => {
              this.setState({confirmDialogOpen: false}) ;
              base.remove(`answers/${this.state.questionId}/${key}`)
            });
          }}
        />

        <Icon color='red' name='delete' size='large'/>
      </div>
    )
  }

  submitQuestionRating(e, { rating }) {
    if (!auth.currentUser) {
      return false
    }
    fBase.database().ref().transaction(root => {
      if (root && root.questions && auth.currentUser) {
        if (this.state.hasVoted) {
          root.questions[this.state.questionId].votes -= 1
          root.questions[this.state.questionId].points -= this.state.personalRating
        }
        root.questions[this.state.questionId].votes += 1
        root.questions[this.state.questionId].points += rating
      }
      return root;
    }).then(() => {
      base.update(`ratings/questions/${this.state.questionId}/users/${auth.currentUser.uid}`, {
        data: {
          rating: rating,
          userEmail: auth.currentUser.email
        }
      }).then(() => this.fetchQuestionRating())
    });
  }

  checkIfUserRatedAnswer(answerKey){
    console.log(this.state.answerRatings[answerKey])
    console.log(!(!this.state.asnwerRatings || !this.state.answerRatings[answerKey]))
    return !(!this.state.answerRatings || !this.state.answerRatings[answerKey]);
  }

  handleAnswerRating(e,ratingObject ){
    if (!auth.currentUser) {
      return false
    }
    fBase.database().ref().transaction(root => {
      if (root && root.answers && auth.currentUser) {
        if (this.checkIfUserRatedAnswer(ratingObject.answerkey)) {
          root.answers[this.state.questionId][ratingObject.answerkey].votes -= 1
          root.answers[this.state.questionId][ratingObject.answerkey].points -= this.state.answerRatings[ratingObject.answerkey].rating
        }
        root.answers[this.state.questionId][ratingObject.answerkey].votes += 1
        root.answers[this.state.questionId][ratingObject.answerkey].points += ratingObject.rating
      }
      return root;
    }).then(() => {
      var newState = Object.assign({}, this.state)
      newState.answerRatings[ratingObject.answerkey] = {rating: ratingObject.rating}
      this.setState(newState)
      base.post('ratings/questions/' + this.state.questionId + '/users/'+auth.currentUser.uid + '/answers/'+ratingObject.answerkey, {
        data: {
          userEmail : auth.currentUser.email,
          rating: ratingObject.rating
              }
      })
    })
  }

  renderCommentGroup() {
    var COMMENTS;
    if (this.state.answersData.length === 0) {
      COMMENTS = (<div>No hay respuestas</div>)
    } else {
      COMMENTS = this.state.answersData.map(answer => {
        return (
          <Segment key={answer.key}>
            <Comment>
              <Comment.Avatar src={DefaultAvatar}/>
              <div className="right pointer">
                {auth.currentUser && answer.userEmail === auth.currentUser.email? this.renderDeleteButton(answer.key) : null}
              </div>

              <Grid>
              <Grid.Column key={1}>
                  <Statistic.Value><Icon name='star' /> {answer.votes===0? '-' : Math.round(answer.points/answer.votes)}</Statistic.Value>
              </Grid.Column>

                <Grid.Column key={2}>
                  {(this.state.answerRatings) && this.state.answerRatings[answer.key]?(
                    <Rating icon='star' answerkey={answer.key} rating = {this.state.answerRatings[answer.key].rating} maxRating={5} onRate= {(e,ratingObject)=> {this.handleAnswerRating(e,ratingObject)}}/>
                  ):(
                    <Rating icon='star' answerkey={answer.key} rating = {0} maxRating={5} onRate= {(e,ratingObject)=> {this.handleAnswerRating(e,ratingObject)}}/>
                      )}
                </Grid.Column>
              </Grid>

              <Comment.Content>
                <Comment.Author as='a'>{answer.userEmail}</Comment.Author>
                <Comment.Text>
                  <ReactMarkdown source={answer.content}/>
                </Comment.Text>
              </Comment.Content>
            </Comment>
          </Segment>
        )
      })
    }

    return (
      <Comment.Group>
        <Header as='h2' dividing>Respuestas</Header>
        {COMMENTS}
        {auth.currentUser? (
          <Form reply onSubmit={() => this.handleSubmit()}>
            <Form.TextArea id='field_answer' name='answer' value={this.state.answerInput} onChange={(e) => this.setState({ answerInput: e.target.value })}/>
            <Form.Button content='Agregar Comentario' labelPosition='left' icon='edit' primary />
          </Form>
        ) : (<div>Debes estar logueado para responder</div>)}

      </Comment.Group>
    )
  }

  render() {
    if (!this.state.questionData) {
      return (
        <Loader active inline='centered' />
      )
    }

    const tags = this.state.questionData.tags.split(',').map((tag, idx) => {
      return (
        <Label key={idx} disabled={true}>{tag}</Label>
      )
    })


    return (
      <div className="container">
        <Statistic size="tiny" className="right" color="yellow">
          <Statistic.Value><Icon name='star' /> {this.state.questionRating}</Statistic.Value>
        </Statistic>
        <h1> {this.state.questionData.title} </h1>
        <Rating icon='star' rating={this.state.personalRating} maxRating={5} onRate={(e, values) => this.submitQuestionRating(e, values)} />
        <br />
        <br />
        {tags}
        <Segment>
          <ReactMarkdown source={this.state.questionData.content}/>
        </Segment>
        {this.renderCommentGroup()}
      </div>
    );
  }
}

export default Question;
