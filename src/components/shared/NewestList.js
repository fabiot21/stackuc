import React, { Component } from 'react';
import { base } from '../Firebase';
import { Container, Pagination, Icon, Statistic, Loader, Item, Label } from 'semantic-ui-react';

class NewestList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      list: null,
      activePage: 1,
      totalPages: 1
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
    const list = this.state.list.slice((this.state.activePage - 1)*6, this.state.activePage*6).map(question => {
      const tags = question.tags.split(',').map((tag, idx) => {
        return (
          <Label key={idx} disabled={true}>{tag}</Label>
        )
      })
      return (
        <Item key={question.key}>
          <Item.Content>
            <Item.Header as='a'>{question.title}</Item.Header>
            <Item.Description>{question.content.slice(0, 120)} ...</Item.Description>
            <Item.Extra>{tags}</Item.Extra>
          </Item.Content>
          <Statistic.Group size='mini'>
            <Statistic>
              <Statistic.Value><Icon name='comments' /> {question.answers}</Statistic.Value>
            </Statistic>
            <Statistic>
              <Statistic.Value><Icon name='star' /> {question.votes !== 0? Math.round(question.points/question.votes) : 0}</Statistic.Value>
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

export default NewestList;
