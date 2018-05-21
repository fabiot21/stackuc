import React, { Component } from 'react';
import { base } from './Firebase';
import { Label, Header,Form,Button, Comment,Loader, Divider, Rating } from 'semantic-ui-react';
import DefaultAvatar from '../assets/default-avatar.png'

class Question extends Component {

  constructor(props){
    super(props)
    this.state= {
      questionId: this.props.match.params.preguntaid,
      questionTitle: this.props.match.params.titulopregunta,
    }
  }

  componentDidMount(){
    base.fetch('questions/' + this.state.questionId, {
    context: this,
    asArray: false,
    then(data){
      this.setState({questionData: data})
    }
      });
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
        <Rating className = 'right' icon='star' defaultRating={0} maxRating={5} />
        <h1> {this.state.questionData.title} </h1>
        {tags}
        <Divider />
        <p> {this.state.questionData.content} </p>
        <Divider />
        <Comment.Group>
          <Header as='h2' dividing>Respuestas</Header>
          <Comment>
            <Comment.Avatar src={DefaultAvatar}/>
            <Comment.Content>
              <Comment.Author as='a'>El choro</Comment.Author>
              <Comment.Metadata>
                <div>Today at 5:42PM</div>
              </Comment.Metadata>
              <Comment.Text>Blablablablablablabla</Comment.Text>
            </Comment.Content>
          </Comment>
          <Comment>
            <Comment.Avatar src={DefaultAvatar}/>
            <Comment.Content>
              <Comment.Author as='a'>El pulento</Comment.Author>
              <Comment.Metadata>
                <div>Today at 5:50PM</div>
              </Comment.Metadata>
              <Comment.Text>Está pulentoso</Comment.Text>
            </Comment.Content>
          </Comment>

          <Form reply>
            <Form.TextArea />
            <Button content='Add Reply' labelPosition='left' icon='edit' primary />
          </Form>

        </Comment.Group>



      </div>
    );
  }
}

export default Question;
