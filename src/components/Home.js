import React, { Component } from 'react';
import { Icon, Statistic, Grid, Label, Menu, Tab } from 'semantic-ui-react'
import { base } from "./Firebase";
import ShortNewestList from './shared/ShortNewestList'

class Home extends Component {
  constructor(props){
    super(props);

    this.state = {
      questions: [],
      tutorials: []
    }
  }
  componentDidMount(){
    base.fetch('questions', {
      context: this,
      asArray: true,
      then(data) {
        this.setState({ questions: data });
      }
    })

    base.fetch('tutorials', {
      context: this,
      asArray: true,
      then(data) {
        this.setState({ tutorials: data });
      }
    })
  }

  render() {
    return (
      <div className="container">
        <h1>Inicio</h1>
        <br />
        <Grid divided='vertically'>
          <Grid.Row columns={3}>
            <Grid.Column width={7}>
              <ShortNewestList data="questions"/>
            </Grid.Column>
            <Grid.Column width={2}>
            </Grid.Column>
            <Grid.Column width={7}>
              <ShortNewestList data="tutorials"/>
            </Grid.Column>
          </Grid.Row>
        </Grid>
        <Statistic.Group color='teal' widths='two'>
          <Statistic>
            <Statistic.Value>
              <Icon name='question circle' />
              {this.state.questions.length}
            </Statistic.Value>
            <Statistic.Label>Preguntas</Statistic.Label>
          </Statistic>

          <Statistic>
            <Statistic.Value>
              <Icon name='book' />
              {this.state.tutorials.length}
            </Statistic.Value>
            <Statistic.Label>Tutoriales</Statistic.Label>
          </Statistic>
        </Statistic.Group>
      </div>

    );
  }
}

export default Home;
