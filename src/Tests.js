import React, { Component } from 'react'
import { Icon, Table } from 'semantic-ui-react'

import TestsLink from './Tests/Link'
import TestsSocket from './Tests/Socket'

class Tests extends Component {
  render() {
    const { chain } = this.props;
    return (
      <Table definition>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell width={4} textAlign="right">
              Test Performed
            </Table.HeaderCell>
            <Table.HeaderCell collapsing>
              Test Result
            </Table.HeaderCell>
            <Table.HeaderCell>
              Test Details
            </Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          <TestsLink />
          <TestsSocket />
        </Table.Body>
      </Table>
    );
  }
}

export default Tests;
