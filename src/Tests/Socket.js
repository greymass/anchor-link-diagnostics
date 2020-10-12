import React, { Component } from 'react'
import { Icon, Table } from 'semantic-ui-react'

const axios = require('axios').default;

const url = 'cb.anchor.link/00000000-0000-0000-0000-000000000000'

class TestsLink extends Component {
  state = {
    error: false,
    message: false,
    result: false,
    valid: false,
  }
  constructor(props) {
    super(props)
    this.connect()
  }
  componentWillUnmount() {
    this.websocket.close()
  }
  connect() {
    const websocket = new WebSocket(`wss://${url}`);
    websocket.onopen = (e) => this.onopen(e)
    websocket.onclose = (e) => this.onclose(e)
    websocket.onmessage = (e) => this.onmessage(e)
    websocket.onerror = (e) => this.onerror(e)
    this.websocket = websocket
    this.interval = setInterval(this.tick, 15000)
    this.tick()
  }
  tick() {
    const data = {
      ts: new Date().toLocaleString()
    }
    axios.post(`https://${url}`, data)
  }
  onopen(e) {
    console.log('onopen', e)
    this.setState({
      valid: true
    })
  }
  onclose(e) {
    console.log('onclose', e)
    this.setState({
      error: e,
      valid: false
    })
  }
  onmessage(e) {
    console.log('onmessage', e)
    const reader = new FileReader();
    reader.onload = () => {
      this.setState({message: reader.result})
    };
    reader.readAsText(e.data);
  }
  onerror(e) {
    this.setState({
      error: e,
      valid: false
    })
  }
  render() {
    const { error, message, valid } = this.state;
    return (
      <React.Fragment>
        <Table.Row>
          <Table.Cell textAlign="right">
            Link connection:
          </Table.Cell>
          <Table.Cell textAlign="center">
            <Icon
              color={valid ? 'green' : 'red'}
              name={valid ? 'square check' : 'window close'}
              size="large"
            />
          </Table.Cell>
          <Table.Cell>
            {valid ? 'Connected!' : JSON.stringify({
              code: error.code,
              isTrusted: error.isTrusted,
              reason: error.reason,
            })}
          </Table.Cell>
        </Table.Row>
        <Table.Row>
          <Table.Cell textAlign="right">
            Link messages:
          </Table.Cell>
          <Table.Cell textAlign="center">
            <Icon
              color={message ? 'green' : 'red'}
              name={message ? 'square check' : 'window close'}
              size="large"
            />
          </Table.Cell>
          <Table.Cell>
            {message}
          </Table.Cell>
        </Table.Row>
      </React.Fragment>
    );
  }
}

export default TestsLink;
