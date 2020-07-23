import React, { Component } from 'react';

import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card'
import Container from 'react-bootstrap/Container'
import Contract from "./contracts/OffChain.json";
import Form from 'react-bootstrap/Form'
import getWeb3 from "./getWeb3";

class App extends Component {
  state = {
    contract: null,
    selectedAccount: null,
    recipientAddress: null,
    id: null
  }
  async componentDidMount() {
    const web3 = await getWeb3();

    const accounts = await web3.eth.getAccounts();
    // Get the contract instance.
    const networkId = await web3.eth.net.getId();
    const deployedNetwork = Contract.networks[networkId];
    const instance = new web3.eth.Contract(
      Contract.abi,
      deployedNetwork && deployedNetwork.address,
    );

    this.setState({
      contract: instance,
      selectedAccount: accounts[0],
      web3: web3
    })

  }

  sendOwedMoney = async () => {
    const result = await this.state.contract.methods.payBack(this.state.id).send({
      from: this.state.selectedAccount, value: this.state.web3.utils.toWei("10", "ether"), gasPrice: 2100
    }, (err, hash) => console.log(err, hash))

  }

  sendMoneyToRecipient = async () => {
    const result = await this.state.contract.methods.sendMoney(this.state.recipientAddress).send({
      from: this.state.selectedAccount, value: this.state.web3.utils.toWei("10", "ether"), gasPrice: 2100
    }, (err, hash) => console.log(err, hash))

    alert('Patient ID is ' + result.events.lendingRegistered.returnValues[0]);
    console.log(result);
  }
  render() {
    console.log(this.state.selectedAccount);
    return (
      <div>
        <Container style={{ marginTop: "2rem", padding: '2rem' }}>
          <Card style={{ marginTop: '1rem' }}>
            <Card.Body>
              <Card.Title>Add Address to send money</Card.Title>
              <Form.Label>Recipient address</Form.Label>
              <Form.Control type="text" size="sm"
                placeholder="Enter recipient address" onChange={(val) =>
                  this.setState({ recipientAddress: val.target.value })} />
              <Button variant="outline-primary" size="sm" onClick={() => this.sendMoneyToRecipient()} style={{ marginTop: '1rem' }}>
                Send money</Button>
            </Card.Body>
          </Card>
          <Card style={{ marginTop: '1rem' }}>
            <Card.Body>
              <Card.Title>Pay back the lent</Card.Title>
              <Form.Label>Person to whom you owe money</Form.Label>
              <Form.Control type="text" size="sm"
                placeholder="Enter Id" onChange={(val) =>
                  this.setState({ id: val.target.value })} />
              <Button variant="outline-primary" size="sm" onClick={() => this.sendOwedMoney()} style={{ marginTop: '1rem' }}>
                Send money</Button>
            </Card.Body>
          </Card>
          <Card style={{ marginTop: '1rem' }}>
            <Card.Body>
              <Button variant="outline-primary" size="sm" onClick={() => this.sendOwedMoney()} style={{ marginTop: '1rem' }}>
                Send money</Button>
            </Card.Body>
          </Card>
        </Container>
      </div>
    );
  }
}

export default App;