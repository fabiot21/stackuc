import React, { Component } from 'react';
import { base } from './Firebase';
import { Loader, Label } from 'semantic-ui-react';

class Tags extends Component {
  constructor(props) {
    super(props);

    this.state = {}
  }

  componentDidMount() {
    base.fetch('tags', {
      context: this,
      asArray: true,
      then(data){
        this.setState({ tags: data })
      }
    })
  }

  render() {
    if (!this.state.tags) {
      return (
        <Loader active inline='centered' />
      )
    }
    const tags = this.state.tags.map(tag => {
      return (
        <Label key={tag.key} className="pointer" size="huge">{tag.key}</Label>
      )
    })
    return (
      <div>
        <h1>Tags</h1>
        <br />
        {tags}
      </div>
    )
  }
}

export default Tags;
