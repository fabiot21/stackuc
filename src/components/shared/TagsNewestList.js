import React, { Component } from 'react';
import { base } from '../Firebase';
import { Container, Pagination, Icon, Statistic, Loader, Item, Label } from 'semantic-ui-react';
import { withRouter } from 'react-router-dom';

class TagsNewestList extends Component {
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
    if(this.props.data==='questions'){
      this.props.history.push('/preguntas/' + item.key + '/' + item.title.replace(/ /g, '-'))
    }
    else{
      this.props.history.push('/tutoriales/' + item.key + '/' + item.title.replace(/ /g, '-'))
    }
  }

  onClickTag(e) {
    e.stopPropagation();
    if(this.props.data==='questions'){
      this.props.history.push('/tags/preguntas/' + e.currentTarget.textContent.replace(/ /g, '-'))
    }
    else{
      this.props.history.push('/tags/tutoriales/' + e.currentTarget.textContent.replace(/ /g, '-'))
    }
    window.location.reload()
  }

  componentDidMount() {
    base.fetch(this.props.data, {
    context: this,
    asArray: true,
    then(data){
      const filterList = data.filter(elem => elem.tags.split(',').map(tag => tag.trim().toLowerCase()).indexOf(this.props.match.params.tag.replace('-', ' ').toLowerCase()) !== -1)
      this.setState({ list: filterList.reverse() })
      this.setState({ totalPages: Math.trunc((filterList.length - 1) / 5) + 1 })
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
    const list = this.state.list.slice((this.state.activePage - 1)*5, this.state.activePage*5).map(element => {
      const tags = element.tags.split(',').map((tag, idx) => {
        return (
          <Label
            onClick={(e) => this.onClickTag(e)}
            key={idx} disabled={true}>{tag.trim()}</Label>
        )
      })
      return (
        <Item key={element.key}>
          <Item.Content onClick={()=>this.redirectTo(element)}>
            <Item.Header as='a'>{element.title}</Item.Header>
            <Item.Meta><Icon name='eye' /> {element.views}</Item.Meta>
            <Item.Description>{element.content.slice(0, 120)} ...</Item.Description>
            <Item.Extra>{tags}</Item.Extra>
          </Item.Content>
          <Statistic.Group size='mini'>
            <Statistic color='blue'>
              <Statistic.Value><Icon name='comments' /> {this.props.data === 'questions'? element.answers : element.comments}</Statistic.Value>
            </Statistic>
            <Statistic color='yellow'>
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

export default withRouter(TagsNewestList);
