// React and UI components for demo
import React, { Component } from 'react'
import { Button, Container, Header, Segment } from 'semantic-ui-react'

// The required anchor-link includes
import AnchorLink from 'anchor-link'
import AnchorLinkBrowserTransport from 'anchor-link-browser-transport'

// Optional interfaces to import from anchor-link
import { PermissionLevel } from 'anchor-link'

// ecc library for validation (optional)
import ecc from 'eosjs-ecc'

// React components for this demo, not required
import { find } from 'lodash'
import blockchains from './assets/blockchains.json'
import Accounts from './Accounts.js'
import Blockchains from './Blockchains.js'
import SigningError from './SigningError.js'
import Tests from './Tests.js'
import Response from './Response.js'

class App extends Component {
  // Demo initialization code
  constructor(props) {
    super(props)
    // Add the ability to retrieve the chainId from the URL
    const search = window.location.search
    const params = new URLSearchParams(search)
    const chainId = params.get('chainId') || 'aca376f206b8fc25a6ed44dbdc66547c36c6c33e3a119ffbeaef943642f0e906'
    // Set initial blank application state
    this.state = {
      error: undefined,
      response: undefined,
      session: undefined,
      sessions: [],
      chainId,
    }
  }
  componentDidMount() {
    // Configure anchor-link when this component mounts
    this.establishLink()
  }
  componentDidUpdate(prevProps, prevState) {
    // If the chainId changes in state, reconfigure anchor-link for that chain
    if (this.state.chainId !== prevState.chainId) {
      this.establishLink()
    }
  }
  addAccount = async () => {
    const { chainId } = this.state
    try {
      // Use the anchor-link login method with the chain id to establish a session
      const identity = await this.link.login('anchor-link-demo-multipass')
      // (optional) pull values useful for identity proofs from the results of login
      const identityProofTransaction = identity.serializedTransaction
      const identityProofSignature = identity.signatures[0]
      const identityProofSignedWith = identity.signerKey
      const identityProofBuffer = Buffer.concat([
        Buffer.from(chainId, 'hex'),
        Buffer.from(identityProofTransaction),
        Buffer.alloc(32),
      ])
      // (optional) verify the user signature is valid to the identity being returned
      const proofValid = ecc.verify(identityProofSignature, identityProofBuffer, identityProofSignedWith)
      // (optional) Retrieve the public key used during the proof
      const proofKey = ecc.recover(identityProofSignature, identityProofBuffer)
      // Retrieve a list of all available sessions to update demo state
      const sessions = await this.link.listSessions('anchor-link-demo-multipass')
      // Update state with the current session and all available sessions
      this.setState({
        error: undefined,
        response: undefined,
        proofKey,
        proofValid,
        session: identity.session,
        sessions,
      })
    } catch(e) {
      console.log(e)
    }
  }
  establishLink = async () => {
    // Load the current chainId from state
    const { chainId } = this.state
    // Find the blockchain and retrieve the appropriate API endpoint for the demo
    const blockchain = find(blockchains, { chainId })
    const rpc = blockchain.rpcEndpoints[0]
    // Initialize anchor-link using the local storage persist module
    this.link = new AnchorLink({
      // Specify the target chainId
      chainId,
      // Set the API to use
      rpc: `${rpc.protocol}://${rpc.host}:${rpc.port}`,
      // client: `${rpc.protocol}://${rpc.host}:${rpc.port}`,
      // Optional: Set the callback service, which will default to https://cb.anchor.link
      service: 'https://cb.anchor.link',
      // Pass in the browser transport
      transport: new AnchorLinkBrowserTransport({
        // Optional: Fuel by default is used to sign transactions for users with low resources.
        //            This can be disabled by setting disableGreymassFuel to true.
        // disableGreymassFuel: true,
        // Optional: Disable the browser transport success/failure messages to serve your own
        // requestStatus: false
      }),
    })
    // Attempt to restore the last used session for this particular chainId
    const session = await this.link.restoreSession('anchor-link-demo-multipass')
    // Load all existing sessions for this chain
    const sessions = await this.link.listSessions('anchor-link-demo-multipass')
    // Save current chainId and session into application state
    this.setState({
      chainId,
      error: undefined,
      session,
      sessions,
    })
    // Return in the event we need to immediately use
    return this.link
  }
  signTransaction = async () => {
    // Retrieve current session from state
    const { session } = this.state
    try {
      // Reset our response state to clear any previous transaction data
      this.setState({ response: undefined })
      const action = {
        account: 'eosio',
        name: 'voteproducer',
        authorization: [session.auth],
        data: {
          producers: [],
          // proxy: 'greymassvote',
          proxy: 'waaaaaaaaaat',
          voter: session.auth.actor
        }
      }
      // Call transact on the session (compatible with eosjs.transact)
      const response = await session.transact({
        actions: [action]
      }, {
        // Optional: Prevent anchor-link from broadcasting this transaction (default: True)
        //
        //    The wallet/signer connected to this app will NOT broadcast the transaction
        //    as is defined by the anchor-link protocol. Broadcasting is the responsibility
        //    of anchor-link running inside an application (like this demo).
        //
        //    For this demo specifically we do NOT want the transaction to ever be broadcast
        //    to the blockchain, so we're disabling it here.
        //
        //    For all normal applications using anchor-link, you can omit this.
        //
        broadcast: false,
      })
      console.log(response, this.state)
      // Update application state with the responses of the transaction
      this.setState({
        error: undefined,
        response,
      })
    } catch(e) {
      console.log(e)
      this.setState({ error: e })
    }
  }
  // React State Helper to update chainId while switching blockchains
  setChainId = (e, { value }) => this.setState({
    chainId: value,
    error: undefined,
    response: undefined,
  }, () => {
    const searchParams = new URLSearchParams(window.location.search)
    searchParams.set('chainId', value)
    window.history.pushState(null, null, `?${searchParams.toString()}`)
  })
  // React State Helper to update sessions while switching accounts
  setSession = async (auth:PermissionLevel) => {
    // Restore a specific session based on an auth (e.g. {actor: 'foo', permission: 'bar'})
    const session = await this.link.restoreSession('anchor-link-demo-multipass', auth)
    // Update application state with new session and reset response data
    this.setState({
      error: undefined,
      response: undefined,
      session,
    })
  }
  // React State Helper to remove/delete a session
  removeSession = async (auth:PermissionLevel) => {
    // Remove from local storage based on an auth (e.g. {actor: 'foo', permission: 'bar'})
    await this.link.removeSession('anchor-link-demo-multipass', auth)
    // Remove from local application state
    const { session, sessions } = this.state
    // If this was the currently active account, remove the session
    if (session && session.auth.actor === auth.actor && session.auth.permission === auth.permission) {
      this.setState({ session: undefined });
    }
    this.setState({
      sessions: sessions.filter(s => !(s.actor === auth.actor && s.permission === auth.permission))
    })
  }
  render() {
    // Load state for rendering
    const {
      chainId,
      error,
      session,
      sessions,
      response,
    } = this.state
    // Find the blockchain information (rpc, name, etc) for UI purposes
    const chain = find(blockchains, { chainId })
    // Return the UI
    return (
      <Container
        style={{ paddingTop: '2em' }}
      >
        <Header attached="top" block size="huge">
          Anchor - Diagnostics Tool
          <Header.Subheader>
            A tool to help diagnose issues while using Anchor and associated protocols.
          </Header.Subheader>
        </Header>
        <Segment>
          <p>The following tests have been performed:</p>
          <Tests
            chain={chain}
          />
        </Segment>
        <Segment attached padded>
          <Header>
            Test Performing a Transaction
            <Header.Subheader>
              This transaction WILL NOT be broadcast to the blockchain. It is only used for testing purposes.
            </Header.Subheader>
          </Header>
          <div style={{ padding: '0.5em' }}>
            <Blockchains
              chain={chain}
              onChange={this.setChainId}
            />
          </div>
          <div style={{ padding: '0.5em' }}>
            <Accounts
              addAccount={this.addAccount}
              chain={chain}
              session={session}
              sessions={sessions}
              setSession={this.setSession}
              removeSession={this.removeSession}
            />
          </div>
          <div style={{ padding: '0.5em' }}>
            {(session)
              ? (
                <Button
                  content="Sign Test Transaction"
                  disabled={!session}
                  icon="external"
                  onClick={this.signTransaction}
                  primary
                  size="huge"
                />
              )
              : false
            }
          </div>
        </Segment>
        <Segment attached="bottom" padded>
          {(error)
            ? (
              <SigningError
                error={error}
              />
            )
            : false
          }
          {(response)
            ? (
              <Response
                response={response}
              />
            )
            : false
          }
        </Segment>
      </Container>
    )
  }
}

export default App
