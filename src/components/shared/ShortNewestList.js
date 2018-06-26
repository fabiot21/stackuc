import React, { Component } from "react";
import { base, auth } from "../Firebase";
import {
  Container,
  Pagination,
  Icon,
  Statistic,
  Loader,
  Item,
  Label,
  Confirm
} from "semantic-ui-react";
import { withRouter } from "react-router-dom";

class NewestList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      list: null,
      activePage: 1,
      totalPages: 1,
      confirmDialogOpen: false
    };
    this.redirectTo = this.redirectTo.bind(this);
  }

  redirectTo(item) {
    if (this.props.data === "questions") {
      this.props.history.push(
        "/preguntas/" + item.key + "/" + item.title.replace(/ /g, "-")
      );
    } else {
      this.props.history.push(
        "/tutoriales/" + item.key + "/" + item.title.replace(/ /g, "-")
      );
    }
  }

  renderDeleteButton(key, i) {
    return (
      <div
        onClick={() => {
          var newState = {};
            newState[`dialogOpen${key}`] = true;
            this.setState(newState, console.log(this.state));
        }}
      >
        <Confirm
          dimmer="blurring"
          cancelButton="Cancelar"
          confirmButton="Si"
          content="¿Estás seguro que deseas eliminar esto?"
          open={this.state['dialogOpen'+key]}
          onCancel={() => {
            console.log(key);
            var newState = {};
            newState[`dialogOpen${key}`] = false;
            this.setState(newState);
          }}
          onConfirm={() => {
            base.remove(`${this.props.data}/${key}/`);
            this.fetchHandler()
          }}
        />
        <Icon color="red" name="delete" size="large" />
      </div>
    );
  }

  onClickTag(e) {
    e.stopPropagation();
    console.log(e.currentTarget.textContent);
    if (this.props.data === "questions") {
      this.props.history.push(
        "/tags/preguntas/" + e.currentTarget.textContent.replace(/ /g, "-")
      );
    } else {
      this.props.history.push(
        "/tags/tutoriales/" + e.currentTarget.textContent.replace(/ /g, "-")
      );
    }
  }

  componentDidMount() {
    this.fetchHandler();
  }

  fetchHandler(){
    base.fetch(this.props.data, {
      context: this,
      asArray: true,
      then(data) {
        this.setState({ list: data.reverse() });
        this.setState({ totalPages: Math.trunc((data.length - 1) / 5) + 1 });
        var newState = {};
        data.map(question => {
          newState["dialogOpen" + question.key];
        });
        this.setState(newState);
      }
    });
  }

  render() {
    if (!this.state.list) {
      return <Loader active inline="centered" />;
    }
    const list = this.state.list
      .slice(0, 3)
      .map((element, i) => {
        const tags = element.tags.split(",").map((tag, idx) => {
          return (
            <Label onClick={e => this.onClickTag(e)} key={idx} disabled={true}>
              {tag.trim()}
            </Label>
          );
        });
        return (
          <Item key={element.key}>
            <Item.Content onClick={() => this.redirectTo(element)}>
              <Item.Header as="a">{element.title}</Item.Header>
              <Item.Meta>
                <Icon name="eye" /> {element.views}
              </Item.Meta>
              <Item.Description>
                {element.content.slice(0, 120)} ...
              </Item.Description>
              <Item.Extra>{tags}</Item.Extra>
            </Item.Content>
            <div className="right pointer">
              {auth.currentUser && element.author === auth.currentUser.email? this.renderDeleteButton(element.key, i) : null}
            </div>
            <Statistic.Group size="mini">
              <Statistic color="blue">
                <Statistic.Value>
                  <Icon name="comments" />{" "}
                  {this.props.data === "questions"
                    ? element.answers
                    : element.comments}
                </Statistic.Value>
              </Statistic>
              <Statistic color="yellow">
                <Statistic.Value>
                  <Icon name="star" />{" "}
                  {element.votes !== 0
                    ? Math.round(element.points / element.votes)
                    : 0}
                </Statistic.Value>
              </Statistic>
            </Statistic.Group>
          </Item>
        );
      });
    return (
      <div className="container">
        {this.props.data === "questions" ? (
          <h3>Ultimas Preguntas</h3>
        ) : (
          <h3>Ultimos Tutoriales</h3>
        )}
        <Item.Group link divided>
          {list}
        </Item.Group>
        <Container
          style={{
            position: "fixed",
            bottom: "0",
            marginBottom: "40px",
            marginLeft: "20%"
          }}
          textAlign="center"
        >
        </Container>
      </div>
    );
  }
}

export default withRouter(NewestList);
