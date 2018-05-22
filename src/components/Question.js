import React, { Component } from 'react';
import { base } from './Firebase';
import { Confirm, Icon, Segment, Label, Header,Form,Button, Comment,Loader, Divider, Rating } from 'semantic-ui-react';
import DefaultAvatar from '../assets/default-avatar.png'
import { auth } from './Firebase'

const ReactMarkdown = require('react-markdown')

class Question extends Component {

  constructor(props){
    super(props)
    this.state= {
      questionId: this.props.match.params.preguntaid,
      questionTitle: this.props.match.params.titulopregunta,
      confirmDialogOpen: false,
      questionRating: 0
    }
  }

  componentDidMount(){
    this.fetchQuestions()
    this.bindAnswers()
    this.handleAuthStateChange()
  }

  handleAuthStateChange(){
    auth.onAuthStateChanged((user) => {
      if (user) {
      }
      this.fetchPreviousRating() //Si se hace la request antes de que se obtenga la data del usuario asincronamente crashea, asi que lo hago cuando llegue la data
    })
  }

  fetchPreviousRating = ()=>{
    console.log('ratings/questions' + this.state.questionId + '/users/' + auth.currentUser.uid)
    base.fetch('ratings/questions/' + this.state.questionId+'/users/' + auth.currentUser.uid ,{
    context: this,
    asArray: false,
    then(data){
      console.log("DATAAA", data.rating)
      this.setState({questionRating: data.rating})
    }
      });
  }

  fetchQuestions = ()=>{
    base.fetch('questions/' + this.state.questionId, {
    context: this,
    asArray: false,
    then(data){
      this.setState({questionData: data})
    }
      });
  }

  bindAnswers = () =>
      base.bindToState('answers/' + this.state.questionId, {
      context: this,
      state: 'answersData',
      asArray: false
      });

  deleteAnswer = (commentKey) => {
    base.remove('answers/'+this.state.questionId+'/'+commentKey);
    //Falta manejar errores acá
  }

  handleQuestionRating = (e,{ rating, maxRating} ) =>{
    this.setState({questionRating: rating})
    base.post('ratings/questions/'+this.state.questionId+'/users/'+auth.currentUser.uid, {
      data: {
        userEmail : auth.currentUser.email,
        rating: rating
            }
    })
  }

  handleChange = (e, {name,value}) => this.setState({'answer' : value})

  handleSubmit = () => {
        if(!this.state.answer || this.state.answer===''){
          return
        }
        base.push('answers/'+this.state.questionId, {
        data: {
          userEmail: auth.currentUser.email,
          content: this.state.answer,
          votes: 0,
          points: 0,
        }
      })
      document.getElementById('field_answer').value = ''
        };

  renderDelete = (comment,commentKey) =>{
    if(comment.userEmail === auth.currentUser.email){
      return(
            <Button icon size='tiny' circular onClick={() => this.setState({confirmDialogOpen: true})} >
            <Confirm
              cancelButton = 'Cancelar'
              confirmButton = 'Si'
              content = '¿Estás seguro de borrar esta respuesta?'
              open={this.state.confirmDialogOpen}
              onCancel={() => this.setState({confirmDialogOpen: false})}
              onConfirm={()=>{
                this.setState({confirmDialogOpen: false}) ;
                this.deleteAnswer(commentKey) }}
            />

            <Icon color = 'red' name='delete' size='large'/>
            </Button>
      )}
  }

  renderCommentGroup = () => {
    if (!this.state.answersData) {
      return (
        <Loader active inline='centered' />
      )
    }
    const comments = Object.keys(this.state.answersData).map((key, index) => (
      this.renderComment(this.state.answersData[key],key)
    ));

    return(
    <Comment.Group>
      <Header as='h2' dividing>Respuestas</Header>
      {comments}
      <Form reply onSubmit={this.handleSubmit}>
        <Form.TextArea id='field_answer' name='answer' onChange= {this.handleChange}/>
        <Form.Button content='Agrega una respuesta' labelPosition='left' icon='edit' primary />
      </Form>
    </Comment.Group>
    )
  }

  renderComment = (comment,commentKey) => {
      return(
        <Segment>
          <Comment>
            <Comment.Avatar src={DefaultAvatar}/>
            <Comment.Content>
              <Comment.Author as='a'>{comment.userEmai}</Comment.Author>
              <Comment.Metadata>
                <Rating icon='star' defaultRating={0} maxRating={5} />
                {this.renderDelete(comment,commentKey)}
              </Comment.Metadata>
              <Comment.Text>
                <ReactMarkdown source={comment.content}/>
              </Comment.Text>
            </Comment.Content>
          </Comment>
        </Segment>
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
        <Rating className = 'right' icon='star' defaultRating={0} rating={this.state.questionRating} maxRating={5} onRate={this.handleQuestionRating} />
        <h1> {this.state.questionData.title} </h1>
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
