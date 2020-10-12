import React, { Component } from 'react'
import { Button } from 'semantic-ui-react';

class Accounts extends Component {
  render() {
    const { sessions } = this.props;
    return (sessions.length)
      ? (
        sessions.map((s) => (
          <Button
            color="red"
            content={`Sign out (${s.actor})`}
            onClick={() => this.props.removeSession(s)}
          />
        ))
      )
      : (
        <Button
          content="Sign in"
          onClick={this.props.addAccount}
          primary
        />
      )
  }
}

export default Accounts;
