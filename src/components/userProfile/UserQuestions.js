import React, { Component } from 'react';
import { Loader, Feed, Icon } from 'semantic-ui-react'
import { base } from '../Firebase'
import { connect } from 'react-redux'

class UserQuestions extends Component {

  constructor(props){
    super(props)
    this.state = {'questions': [] }
    this.fetchQuestionsFromFirebase = this.fetchQuestionsFromFirebase.bind(this)
  }

  componentDidMount(){
    this.fetchQuestionsFromFirebase()
  }

  fetchQuestionsFromFirebase(){
    base.fetch('questions/', {
      context: this,
      asArray: true,
      queries: {
        orderByChild: 'author',
        equalTo: this.props.currentUser.userEmail
        },
      then(data){
        this.setState({'questions': data})
      }
    });
  }

  redirectToQuestion(question){
    this.props.history.push('/preguntas/' + question.key + '/' + question.title.replace(/ /g, '-'))
  }

  renderQuestionFeed(question){
    const questionSummary = ("Preguntaste " +question.title + "")
    return(
      <Feed.Event
        onClick = {()=>this.redirectToQuestion(question)}
        icon='question circle'
        date='TODO: agregar fecha a todo'
        summary= {questionSummary}
      />
    )
  }

  renderAllQuestions(){
    const htmlData = this.state.questions.map( (question) => {
      return this.renderQuestionFeed(question)
    } )
    if(htmlData.length === 0 ){
      return  <Loader active>Cargando</Loader>
    }
    return(
      <Feed>
        {htmlData}
      </Feed>
    )
  }

  render(){
    return(
      <div>
        {this.renderAllQuestions()}
      </div>
    )
  }
}


function mapStateToProps({ currentUser }){
  return {
    currentUser
  }
}

export default connect(
  mapStateToProps,
  { })(UserQuestions)
