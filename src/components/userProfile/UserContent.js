import React, { Component } from 'react';
import { Loader, Feed, Icon } from 'semantic-ui-react'
import { base } from '../Firebase'
import { connect } from 'react-redux'

class UserContent extends Component {

  constructor(props){
    super(props)
    this.state = {'data': [], 'contentStrings': {} }
    this.fetchDataFromFirebase = this.fetchDataFromFirebase.bind(this)
  }

  componentDidMount(){
    this.fetchDataFromFirebase()
    this.setContentStrings(this.props.contentType)
  }

  componentWillReceiveProps(nextProps){
    this.setContentStrings(nextProps.contentType)
  }

  setContentStrings(contentType){
    var contentStrings= {"action": "", "route": "", "icon": ""}
    switch(contentType){
      case "questions":
        contentStrings =  {"action": "Preguntaste ", "route": "preguntas",
                "icon": "question circle"}
        break
      case "tutorials":
        contentStrings =  {"action": "Escribiste el tutorial ", "route": "tutoriales",
                "icon": "pencil alternate"}
        break
        case "answers":
          contentStrings =  {"action": "Respondiste la pregunta ", "route": "preguntas",
                  "icon": "comment"}
          break
      default:
        break
    }
    this.setState({'contentStrings': contentStrings})
  }

  fetchDataFromFirebase(){
    base.fetch(this.props.contentType+'/', {
      context: this,
      asArray: true,
      queries: {
        orderByChild: 'author',
        equalTo: this.props.currentUser.userEmail
        },
      then(data){
        this.setState({'data': data})
      }
    });
  }

  redirectToContent(content){
    this.props.history.push('/' + this.state.contentStrings.route + '/' +
                          content.key + '/' + content.title.replace(/ /g, '-'))
  }

  renderContentFeed(content){
    const questionSummary = (this.state.contentStrings.action +content.title + "")
    return(
      <Feed.Event
        onClick = {()=>this.redirectToContent(content)}
        icon={this.state.contentStrings.icon}
        date='TODO: agregar fecha a todo'
        summary= {questionSummary}
      />
    )
  }

  renderAllContent(){
    const htmlData = this.state.data.map( (content) => {
      return this.renderContentFeed(content)
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
    this.fetchDataFromFirebase()
    return(
      <div>
        {this.renderAllContent()}
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
  { })(UserContent)
