import React, { Component } from 'react';
import { base } from '../Firebase';
import { Container, Pagination, Icon, Statistic, Loader, Item, Label } from 'semantic-ui-react';
import { withRouter } from 'react-router-dom';

class NewestList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      list: null,
      activePage: 1,
      totalPages: 1
    }
    this.redirectTo = this.redirectTo.bind(this);
  }

  redirectTo(item){
    console.log(item)
    if(this.props.data==='questions'){
      this.props.history.push('preguntas/' + item.key + '/' + item.title)
    }
    else{
      this.props.history.push('tutoriales/' + item.key + '/' + item.title)
    }
    }

  componentDidMount() {
    base.fetch(this.props.data, {
    context: this,
    asArray: true,
    then(data){
      console.log(data);
      this.setState({ list: data.reverse() })
      this.setState({ totalPages: Math.trunc((data.length - 1) / 6) + 1 })
    }
  });
  }
  handlePaginationChange = (e, { activePage }) => this.setState({ activePage })

  render() {
    if (!this.state.list) {
      return (
        <Loader active inline='centered' />
      )
    }
    const list = this.state.list.slice((this.state.activePage - 1)*6, this.state.activePage*6).map(element => {
      const tags = element.tags.split(',').map((tag, idx) => {
        return (
          <Label key={idx} disabled={true}>{tag}</Label>
        )
      })
      return (
        <Item key={element.key}>
          <Item.Content onClick={()=>this.redirectTo(element)}>
            <Item.Header as='a'>{element.title}</Item.Header>
            <Item.Description>{element.content.slice(0, 120)} ...</Item.Description>
            <Item.Extra>{tags}</Item.Extra>
          </Item.Content>
          <Statistic.Group size='mini'>
            <Statistic>
              <Statistic.Value><Icon name='comments' /> {this.props.data === 'questions'? element.answers : element.comments}</Statistic.Value>
            </Statistic>
            <Statistic>
              <Statistic.Value><Icon name='star' /> {element.votes !== 0? Math.round(element.points/element.votes) : 0}</Statistic.Value>
            </Statistic>
          </Statistic.Group>

        </Item>
      )
    })
    return (
      <div className="container">
        <Item.Group link divided>
          {list}
        </Item.Group>
        <Container style={{ position: "fixed", bottom: "0", marginBottom: "40px", marginLeft: "20%" }} textAlign="center">
          <Pagination activePage={this.state.activePage} onPageChange={this.handlePaginationChange} totalPages={this.state.totalPages} />
        </Container>
      </div>
    )
  }
}

export default withRouter(NewestList);
