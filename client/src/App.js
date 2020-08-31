import React, { Component } from "react";
import Body from "./components/Body";
import Header from "./components/Header";

import "./App.css";

require('dotenv').config()

class App extends Component {

  state = { storageValue: 0, web3: null, accounts: null, contract: null };

  constructor(props) {
    super(props);
    this.state = {
      isHome : true,
      isConnected : false,
      isSigning : false,
      isDocument : false,
      isPayement : false,
      amount : 0,
      account : '',
      balance : 0,
    }

    this.home = this.home.bind(this);
    this.connect = this.connect.bind(this);
    this.disconnect = this.disconnect.bind(this);
    this.documents = this.documents.bind(this);
    this.signing = this.signing.bind(this);
    this.payement = this.payement.bind(this);
    this.updateBalance = this.updateBalance.bind(this);
  }

  componentDidMount = async () => {
  };

  runExample = async () => {
  };

  payement() {
    this.setState({
      isHome : false,
      isConnected : true,
      isSigning : false,
      isDocument : false,
      isPayement : true,
      amount : 0,
    })
  }

  home() {
    this.setState({
      isHome : true,
      isConnected : false,
      isSigning : false,
      isDocument : false,
      isPayement : true,
      amount : 0
    })
  }

  updateBalance(newBalance) {
    this.setState({
      balance : newBalance
    })
  }

  connect(account) {
    this.setState({
      isHome : true,
      isConnected : true,
      isSigning : false,
      isDocument : false,
      isPayement : false,
      amount : 0,
      account : account
    })
  }

  disconnect() {
    this.setState({
      isHome : true,
      isConnected : false,
      isSigning : false,
      isDocument : false,
      isPayement : false,
      amount : 0,
      account : ''
    })
  }

  documents() {
    this.setState({
      isHome : false,
      isConnected : true,
      isSigning : false,
      isDocument : true,
      isPayement : false,
      amount : 0,
    })
  }

  signing() {
    this.setState({
      isHome : false,
      isConnected : true,
      isSigning : true,
      isDocument : false,
      isPayement : false,
      amount : 0,
    })
  }

  render() {
    return (<div>
          <div className="App min-h-full">
            <Header isHome={this.state.isHome} connect={this.connect} updateBalance={this.updateBalance} isConnected={this.state.isConnected} balance={this.state.balance} account={this.state.account} isSigning={this.state.isSigning} isPayement={this.state.isPayement} isDocuments={this.state.isDocument} signing={this.signing} document={this.documents} payement={this.payement} disconnect={this.disconnect} home={this.home}></Header>
          </div>
          <Body amount={this.state.amount} connect={this.connect} updateBalance={this.updateBalance} isConnected={this.state.isConnected} isSigning={this.state.isSigning} account={this.state.account} isDocument={this.state.isDocument} isPayement={this.state.isPayement} isHome={this.state.isHome}/>
    </div>
    );
  }
}

export default App;
