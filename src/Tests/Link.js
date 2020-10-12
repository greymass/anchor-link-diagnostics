import React, { Component } from 'react'
import { Icon, Table } from 'semantic-ui-react'

const axios = require('axios').default;

class TestsLink extends Component {
  state = {
    error: false,
    result: false,
    valid: false,
  }
  constructor(props) {
    super(props)
    this.interval = setInterval(this.tick.bind(this), 15000)
    this.tick()
  }
  componentWillUnmount() {
    clearInterval(this.interval)
  }
  tick() {
    const t = this
    axios.get('https://cb.anchor.link/test/sample.txt')
      .then(function (response) {
        t.setState({
          result: response.data,
          valid: true,
        })
      })
      .catch(function (error) {
        console.log(error)
        t.setState({
          error,
          valid: false,
        })
      })
  }
  render() {
    const { error, result, valid } = this.state;
    return (
      <Table.Row>
        <Table.Cell textAlign="right">
          Link DNS:
        </Table.Cell>
        <Table.Cell textAlign="center">
          <Icon
            color={valid ? 'green' : 'red'}
            name={valid ? 'square check' : 'window close'}
            size="large"
          />
        </Table.Cell>
        <Table.Cell>
          {valid ? result : JSON.stringify(error)}
        </Table.Cell>
      </Table.Row>
    );
  }
}

export default TestsLink;
