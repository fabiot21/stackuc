import React, { Component } from 'react';
import { base, auth, fBase } from '../Firebase';
import { Container, Pagination, Icon, Statistic, Loader, Item, Label, Confirm
 } from 'semantic-ui-react';
import { withRouter } from 'react-router-dom';

class NewestList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      list: null,
      activePage: 1,
      totalPages: 1,
      confirmDialogOpen: false
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
  
  renderDeleteButton(key, i) {
    return (
      <div onClick={() => {
        console.log(key)
        console.log(i)
        this.setState({confirmDialogOpen: true})
        }}>
        <Confirm
          dimmer="blurring"
          cancelButton = 'Cancelar'
          confirmButton = 'Si'
          content = {key}
          open={this.state.confirmDialogOpen}
          onCancel={() => {
            this.setState({confirmDialogOpen: false})
            console.log(key)
            console.log(i)}}
          onConfirm={() => {
            console.log(key)
            console.log(i)
            this.setState({confirmDialogOpen: false})
            //let question = fBase.database().ref('questions/' + keyDeleted+"/");
            //console.log(question)
            //question.remove();
            //base.remove(`questions/${this.state.list[i].key}}`)

          }}
        />
        <Icon color='red' name='delete' size='large'/>
      </div>
    )
  }

  onClickTag(e) {
    e.stopPropagation();
    console.log(e.currentTarget.textContent);
    if(this.props.data==='questions'){
      this.props.history.push('/tags/preguntas/' + e.currentTarget.textContent.replace(/ /g, '-'))
    }
    else{
      this.props.history.push('/tags/tutoriales/' + e.currentTarget.textContent.replace(/ /g, '-'))
    }
  }

  componentDidMount() {
    base.fetch(this.props.data, {
    context: this,
    asArray: true,
    then(data){
      this.setState({ list: data.reverse() })
      this.setState({ totalPages: Math.trunc((data.length - 1) / 5) + 1 })
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
    const list = this.state.list.slice((this.state.activePage - 1)*5, this.state.activePage*5).map((element, i) => {
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
          <div className="right pointer">
            {this.renderDeleteButton(element.key, i)}
          </div>
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
        {this.props.data === 'questions'? (
          <h1>Preguntas Recientes</h1>
        ) : (
          <h1>Tutoriales Recientes</h1>
        )}
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
