import React, { Component } from 'react';
import {
  Input,
  Grid,
  Statistic,
  Confirm,
  Icon,
  Segment,
  Label,
  Header,
  Form,
  Comment,
  Loader,
  Rating
} from 'semantic-ui-react';
import ReactMarkdown from 'react-markdown';
import { base, fBase } from './Firebase';
import { auth } from './Firebase'
import ClickableAuthor from './shared/ClickableAuthor'
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
      confirmDialogOpenComment: false,
      hasVoted: false,
      answerRatings: {},
      activateComment: false,
      commentValue: '',
      commentsData: []
    }
  }

  componentDidMount() {
    this.fetchQuestionRating();
    this.fetchQuestionData();
    this.handleAuthStateChange();
    this.bindAnswers();
    this.bindComments();
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

    base.listenTo('answers/' + this.state.questionId, {
      context: this,
      asArray: true,
      then(data){
        let newState = {}
        data.map(answer => {

          newState['activateComment' + answer.key] = false
          newState['commentValue' + answer.key] = ''
          newState['confirmDialogOpenAnswerComment' + answer.key] = false
          if (answer.comments !== undefined) {
            newState['commentsData' + answer.key] = answer.comments
          } else {
            newState['commentsData' + answer.key] = []
          }
          return true
        })
        this.setState(newState)
      }
    })
  }

  bindComments() {
    base.bindToState(`questions/${this.state.questionId}/comments`, {
      context: this,
      state: 'commentsData',
      asArray: true
    })
  }

  renderDeleteButton(key) {
    return (
      <div onClick={() => {
        var newState = {}
        newState[`confirmDialogOpen${key}`] = true
        this.setState(newState)
        }} >
        <Confirm
          dimmer="blurring"
          cancelButton = 'Cancelar'
          confirmButton = 'Si'
          content = '¿Estás seguro de borrar esta respuesta?'
          open={this.state[`confirmDialogOpen${key}`]}
          onCancel={() => {
            var newState = {}
            newState[`confirmDialogOpen${key}`] = false
            this.setState(newState)
          }}
          onConfirm={() => {
            fBase.database().ref(`questions/${this.state.questionId}/answers`).transaction((i) => {
              return i - 1;
            }).then(() => {
              var newState = {}
              newState[`confirmDialogOpen${key}`] = false
              this.setState(newState)
              base.remove(`answers/${this.state.questionId}/${key}`)
            });
          }}
        />
        <Icon color='red' name='delete' size='large'/>
      </div>
    )
  }

  renderCommentDeleteButton(key) {
    return (
      <div onClick={() => {
        var newState = {}
        newState[`confirmDialogOpenComment${key}`] = true
        this.setState(newState)
        }}>
        <Confirm
          dimmer="blurring"
          cancelButton = 'Cancelar'
          confirmButton = 'Si'
          content = '¿Estás seguro de borrar este comentario?'
          open={this.state[`confirmDialogOpenComment${key}`]}
          onCancel={() => {
            var newState = {}
            newState[`confirmDialogOpenComment${key}`] = false
            this.setState(newState)
          }}
          onConfirm={() => {
            var newState = {}
            newState[`confirmDialogOpenComment${key}`] = false
            this.setState(newState)
            base.remove(`questions/${this.state.questionId}/comments/${key}`)
          }}
        />

        <Icon color='red' name='delete'/>
      </div>
    )
  }

  renderAnswerCommentDeleteButton(keyAnswer, keyComment) {
    return (
      <div onClick={() => {
        var newState = {}
        newState[`confirmDialogOpenAnswerComment${keyComment}`] = true
        this.setState(newState)
      }} >
      <Confirm
        dimmer="blurring"
        cancelButton = 'Cancelar'
        confirmButton = 'Si'
        content = '¿Estás seguro de borrar este comentario?'
        open={this.state[`confirmDialogOpenAnswerComment${keyComment}`]}
        onCancel={() => {
          var newState = {}
          newState[`confirmDialogOpenAnswerComment${keyComment}`] = false
          this.setState(newState)
      }}
        onConfirm={() => {
          var newState = {}
          newState[`confirmDialogOpenAnswerComment${keyComment}`] = false
          this.setState(newState)
          base.remove(`answers/${this.state.questionId}/${keyAnswer}/comments/${keyComment}`)
        }}
      />
      <Icon color='red' name='delete'/>
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
    var ANSWERS;
    if (this.state.answersData.length === 0) {
      ANSWERS = (<div>No hay respuestas</div>)
    } else {
      ANSWERS = this.state.answersData.map(answer => {
        if (!this.state[`commentsData${answer.key}`]) {
          return null
        }
        const COMMENTS = Object.keys(this.state[`commentsData${answer.key}`]).map(key => {
          return (
            <div key={key}>
              <div className="right pointer">
                {auth.currentUser && this.state[`commentsData${answer.key}`][key].userEmail === auth.currentUser.email? this.renderAnswerCommentDeleteButton(answer.key, key) : null}
              </div>
              <Label color="teal" className="right" size="small">
                {this.state[`commentsData${answer.key}`][key].content} - {this.state[`commentsData${answer.key}`][key].userEmail}
              </Label>
              <br />
              <br />
            </div>
          )
        })
        return (
          <div key={answer.key}>
            <Segment>
              <Comment style={{ marginTop: '10px' }} >
                <Comment.Avatar src={DefaultAvatar}/>
                <div className="right pointer" >
                  {auth.currentUser && answer.userEmail === auth.currentUser.email? this.renderDeleteButton(answer.key) : null}
                </div>
                <Grid style={{ marginTop: '5px' }}>
                  <Statistic.Value><Icon name='star' /> {answer.votes===0? '' : Math.round(answer.points/answer.votes)}</Statistic.Value>
                  {(this.state.answerRatings) && this.state.answerRatings[answer.key]?(
                    <Rating icon='star' answerkey={answer.key} rating = {this.state.answerRatings[answer.key].rating} maxRating={5} onRate= {(e,ratingObject)=> {this.handleAnswerRating(e,ratingObject)}}/>
                  ):(
                    <Rating icon='star' answerkey={answer.key} rating = {0} maxRating={5} onRate= {(e,ratingObject)=> {this.handleAnswerRating(e,ratingObject)}}/>
                  )}
                </Grid>
                <Comment.Content style={{ marginTop: '25px' }}>
                  <Comment.Author as='a'><ClickableAuthor userEmail={answer.userEmail} history={this.props.history}/> </Comment.Author>
                  <Comment.Text>
                    <ReactMarkdown source={answer.content}/>
                  </Comment.Text>
                </Comment.Content>
              </Comment>
            </Segment>
            {COMMENTS}
            {!this.state[`activateComment${answer.key}`]? (
              <a onClick={() => {
                  var ObjActivateComment = {}
                  ObjActivateComment[`activateComment${answer.key}`] = true
                  this.setState(ObjActivateComment)}
                } className="pointer"><Icon name="add"/> comentario</a>
            ) : (
              <form
                onSubmit={(e) => this.onSubmitCommentAnswer(e, answer.key)}
                style={{ width: "70%" }}>
                <Input
                  fluid
                  onChange={(e) => {
                    var ObjCommentValue = {}
                    ObjCommentValue[`commentValue${answer.key}`] = e.target.value
                    this.setState(ObjCommentValue)
                  }}
                  value={this.state[`commentValue${answer.key}`]? this.state[`commentValue${answer.key}`] : ''}
                  icon='add'
                  autoFocus
                  placeholder='Comentario...' />
              </form>
            )}
            <br />
            <br />
            <br />
          </div>
        )
      })
    }

    return (
      <Comment.Group>
        <Header as='h2' dividing>Respuestas</Header>
        {ANSWERS}
        {auth.currentUser? (
          <Form reply onSubmit={() => this.handleSubmit()}>
            <Form.TextArea id='field_answer' name='answer' value={this.state.answerInput} onChange={(e) => this.setState({ answerInput: e.target.value })}/>
            <Form.Button content='Agregar Comentario' labelPosition='left' icon='edit' primary />
          </Form>
        ) : (<div>Debes estar logueado para responder</div>)}

      </Comment.Group>
    )
  }

  onSubmitComment(e) {
    e.preventDefault();

    base.push(`questions/${this.state.questionId}/comments`, {
      data: {
        content: this.state.commentValue,
        userEmail: auth.currentUser.email
      }
    }).then(() => this.setState({ activateComment: false, commentValue: '' }))
  }

  onSubmitCommentAnswer(e, key) {
    e.preventDefault();

    base.push(`answers/${this.state.questionId}/${key}/comments`, {
      data: {
        content: this.state[`commentValue${key}`],
        userEmail: auth.currentUser.email
      }
    }).then(() => {
      var newState = {}
      newState[`activateComment${key}`] = false
      newState[`commentValue${key}`] = ''
      this.setState(newState)
    })
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

    const COMMENTS = this.state.commentsData.map(comment => {
      return (
        <div key={comment.key}>
          <div className="right pointer">
            {auth.currentUser && comment.userEmail === auth.currentUser.email? this.renderCommentDeleteButton(comment.key) : null}
          </div>
          <Label color="blue" className="right" size="medium" key={comment.key}>
            {comment.content} - {comment.userEmail}
          </Label>
          <br />
          <br />
        </div>
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
        <p> Por <ClickableAuthor userEmail={this.state.questionData.author} history={this.props.history}/> </p>
        <br />
        {tags}
        <Segment>
          <ReactMarkdown source={this.state.questionData.content}/>
        </Segment>
        {COMMENTS}
        {!this.state.activateComment? (
          <a onClick={() => this.setState({ activateComment: true })} className="pointer"><Icon name="add"/> comentario</a>
        ) : (
          <form
            onSubmit={(e) => this.onSubmitComment(e)}
            style={{ width: "70%" }}>
            <Input
              fluid
              onChange={(e) => this.setState({ commentValue: e.target.value })}
              value={this.state.commentValue}
              icon='add'
              autoFocus
              placeholder='Comentario...' />

          </form>
        )}
        {this.renderCommentGroup()}
      </div>
    );
  }
}

export default Question;
