import React, { Component } from "react";
import SimpleStorageContract from "./contracts/SimpleStorage.json";
import Web3Services from './services/Web3Services';
import DownloadDocument from "./components/DownloadDocument";
import UploadDocument from "./components/UploadDocument";
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
      isSignup : false,
      isLogin : false,
      isCorporate : false,
      isPayment : false,
      amount : 0,
      account : ''
    }
    Web3Services.GetInstance();
    this.signup = this.signup.bind(this);
    this.corporate = this.corporate.bind(this);
    this.login = this.login.bind(this);
    this.home = this.home.bind(this);
    this.payment = this.payment.bind(this);
    this.connect = this.connect.bind(this);
    this.disconnect = this.disconnect.bind(this);
  }


  componentDidMount = async () => {
  };

  runExample = async () => {
  };

  payment(amount) {
    this.setState({
      isSignup : false,
      isCorporate : false,
      isLogin : false,
      isHome : false,
      isConnected : false,
      isPayment :  true,
      amount : amount
    })
  }

  signup() {
    this.setState({
      isSignup : true,
      isCorporate : false,
      isLogin : false,
      isHome : false,
      isConnected : false,
      isPayment :  false,
      amount : 0
    })
  }

  corporate() {
    this.setState({
      isCorporate : true,
      isSignup : false,
      isLogin : false,
      isHome : false,
      isConnected : false,
      isPayment :  false,
      amount : 0
    })
  }

  login() {
    this.setState({
      isCorporate : false,
      isSignup : false,
      isLogin : true,
      isHome : false,
      isConnected : false,
      isPayment :  false,
      amount : 0
    })
  }

  home() {
    this.setState({
      isCorporate : false,
      isSignup : false,
      isLogin : false,
      isHome : true,
      isConnected : false,
      isPayment :  false,
      amount : 0
    })
  }

  connect(account) {
    this.setState({
      isCorporate : false,
      isSignup : false,
      isLogin : false,
      isHome : false,
      isConnected : true,
      isPayment :  false,
      amount : 0,
      account : account
    })
  }

  disconnect() {
    this.setState({
      isCorporate : false,
      isSignup : false,
      isLogin : false,
      isHome : true,
      isConnected : false,
      isPayment :  false,
      amount : 0,
      account : ''
    })
  }

  render() {
    return (<div>
          <div className="App min-h-full">
            <Header isHome={this.state.isHome} isConnected={this.state.isConnected} account={this.state.account} disconnect={this.disconnect} home={this.home}  signup={this.signup} corporate={this.corporate} login={this.login}></Header>
          </div>
          <Body amount={this.state.amount} connect={this.connect} isConnected={this.state.isConnected}  isHome={this.state.isHome} isLogin={this.state.isLogin} payment={this.payment} isPayment={this.state.isPayment} isSignup={this.state.isSignup} isCorporate={this.state.isCorporate}/>
    </div>
    );
  }
}

export default App;
