import React from 'react';
import logo from "./../images/Yahli-full.png";
import partner from "./../images/partner.png";
import deal from "./../images/deal.png";
import cryptocurrency from "./../images/cryptocurrency.png";
import bussiness from "./../images/bussiness.png";
import power from "./../images/power.png";
import Web3Services from '../services/Web3Services';
import SnapAccount from '../services/SnapAccount';
import SignDocu from '../services/SignDocu';
import abi from 'ethereumjs-abi';

class Header extends React.Component {

    contractAddress = SignDocu.contractAddress;
    web3;

    constructor(props) {
        super(props);
        this.state = {
            isLoading : false,
            accountCreated : false
        }
        this.getHeaderElement = this.getHeaderElement.bind(this);
        this.login = this.login.bind(this);
        this.home = this.home.bind(this);
        this.connect = this.connect.bind(this);
        this.connectToEthereumNetworkConnexionProvider = this.connectToEthereumNetworkConnexionProvider.bind(this);
        this.bigLogin = this.bigLogin.bind(this);
        this.createButtton = this.createButtton.bind(this);
        this.createAccount = this.createAccount.bind(this);
        this.signAccountCreation = this.signAccountCreation.bind(this);
        this.getCredit = this.getCredit.bind(this);
        this.balanceView = this.balanceView.bind(this);
        this.getBalance = this.getBalance.bind(this);
    }

    home() {
        this.props.home();
    }

    getAccount() {
        return this.props.account.toString()
    }

    documents() {
        if(!this.props.isConnected) {
            return;
        }
        return (<button onClick={() => this.props.document()} className="bg-gray-200 hover:bg-gray-100 text-blue-500 font-semibold hover:font-bold py-2 px-4 border border-gray-200 hover:border-gray-300 rounded-full ml-2">
                        Docs
    </button>);
    }

    sign() {
        if(!this.props.isConnected) {
            return;
        }
        return (<button onClick={() => this.props.signing()} className="flex items-center justify-center bg-transparent hover:bg-gray-100 text-gray-200 hover:text-blue-500 font-semibold hover:font-bold py-2 px-4 border border-gray-200 hover:border-gray-300 rounded-full ml-2">
                        Sign
            </button>);
    }

    async signAccountCreation(sender, publicKey) {
        this.web3 = Web3Services.GetInstance().web3;
        var hash = "0x" + abi.soliditySHA3(
            ['address','string', 'uint256', 'address'],
            [sender, publicKey, 3, this.contractAddress]
        ).toString("hex");

        hash = this.web3.utils.soliditySha3("\x19Ethereum Signed Message:\n32",hash);
        return await this.web3.eth.sign(hash, sender);
    }

    login() {
        if(this.props.isConnected) {
            return;
        }
        if (this.state.isLoading) {
            return (<button onClick={() => this.connect()} className="flex items-center justify-center bg-transparent hover:bg-gray-100 text-gray-200 hover:text-blue-500 font-semibold hover:font-bold py-2 px-4 border border-gray-200 hover:border-gray-300 rounded-full ml-2">
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor"></circle> <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
            Login
            </button>)
        }
        return (<button onClick={() => this.connect()} className="bg-transparent hover:bg-gray-100 text-gray-200 hover:text-blue-500 font-semibold hover:font-bold py-2 px-4 border border-gray-200 hover:border-gray-300 rounded-full ml-2">
            Login
        </button>)
    }

    getCredit() {
        if(this.props.isConnected) {
            return (<div className='ml-10 cursor-pointer'>
                <img className="btn w-12 border-gray-300 focus:border-gray-100" onClick={() => this.props.payement()} src={bussiness}/>
            </div>
            );
        }
        return;
    }

    getBalance() {
        var callback = (balance) => {
            this.props.updateBalance(Web3Services.GetInstance().web3.utils.fromWei(String(balance), 'milliether'));
        }

        if(this.props.isConnected) {
            SignDocu.GetInstance().getBalance(callback);
        }
    }

    balanceView() {
        if(this.props.isConnected) {
            return (<div className="ml-5 flex items-center justify-center text-3xl text-white font-semibold">{this.props.balance} Credit</div>);
        }  
    }

    createAccount() {
        var createAccountIfNotExist = async () => {
            this.sleep(1000).then(() => {
                var callback = async (accountExist) => {
                    if(accountExist === '') {
                        var publicKey = await SnapAccount.GetInstance().getPublicKey();
                        Web3Services.GetInstance().web3.eth.getAccounts().then(async (accounts) => {
                            this.signAccountCreation(accounts[0], publicKey).then((signature) => {
                                var successCallback = () => {
                                    console.log('Success Account Creation');
                                }
                                SignDocu.GetInstance().createAccount(accounts[0], String(publicKey), signature, successCallback);
                            });
                        })
                    }
                    else {
                        this.setState({
                            accountCreated : true,
                        });
                    }
                }
                SignDocu.GetInstance().accountExist(callback);
            })
        }

        createAccountIfNotExist();
    }

    createButtton() {
        if(this.props.isConnected) {
            return (<button onClick={() => this.createAccount()} className="bg-transparent hover:bg-gray-100 text-gray-200 hover:text-blue-500 font-semibold hover:font-bold py-2 px-4 border border-gray-200 hover:border-gray-300 rounded-full ml-2">
            Yahli Account
        </button>);
        }

        return (<div></div>);
    }

    bigLogin() {
        if(this.props.isConnected) {
            return;
        }
        return (<div className="flex items-center justify-center">
        <button onClick={() => this.connect()} className="shadow-2xl mt-10 mb-20 px-10 bg-transparent hover:bg-gray-100 text-2xl text-gray-200 font-semibold hover:font-bold py-2 px-4 border border-gray-200 hover:border-gray-300 rounded-full ml-2">
            Login
        </button>
    </div>);
    }

    connect() {
        this.setState({
            isLoading : true
        })
        Web3Services.GetInstance();
        SnapAccount.GetInstance().connect().then(() => {
        });
        this.connectToEthereumNetworkConnexionProvider();
    }

    connectionInfo() {
        if(!this.props.isConnected) {
            return;
        }
        return (
            <div className="flex col-start-4 col-end-4 items-center justify-center">
            {this.createButtton()}
            {this.documents()}
            {this.sign()}
            <div className="flex items-center justify-center mx-3 active:border-gray-500 opacity-100 hover:opacity-50 cursor-pointer">
            <img className="btn w-12 border-gray-300 focus:border-gray-100"  onClick={() => {navigator.clipboard.writeText(this.props.account)}} title={`${this.getAccount()}`} src={cryptocurrency}/>
        </div>
        <div className="flex items-center justify-center mx-3 active:border-gray-500 opacity-100 hover:opacity-50 cursor-pointer">
            <img className="btn w-10" title="Disconnect" onClick={() => this.props.disconnect()} src={power}/>
        </div>
        </div>)
    }
    
    async connectToEthereumNetworkConnexionProvider() {
        if(Web3Services.GetInstance().web3 === undefined) {
            this.sleep(500).then(() => {
                this.connectToEthereumNetworkConnexionProvider();
            });
            return;
        }
        this.setState({
            isLoading : false,
        })
        Web3Services.GetInstance().web3.eth.getAccounts().then(accounts => {
            this.props.connect(accounts[0]);
            this.getBalance();
        });
    }

    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
      

    getHeaderElement() {
        if(this.props.isDocuments || this.props.isSigning || this.props.isPayement) {
            return (<div className="bg-gradient-blue-to-purple">
            <header className="grid grid-cols-4 h-25">
                <div className="flex col-start-1 col-end-3 align-middle my-8 mx-8">
                    <img className="w-32" src={logo}/>
                    {this.getCredit()}
                    {this.balanceView()}
                </div>
                    {this.connectionInfo()}
            </header>
            </div>);
        }

            return (<div className="bg-gradient-blue-to-purple">
                <header className="grid grid-cols-4 h-25">
                    <div className="flex col-start-1 col-end-3 align-middle my-8 mx-8">
                        <img className="w-32" src={logo}/>
                        {this.getCredit()}
                        {this.balanceView()}
                    </div>
                    <div className="flex col-start-4 col-end-4 items-center justify-end mr-10">
                        {this.login()}
                        {this.connectionInfo()}
                    </div>
                </header>
                <div className="flex">
                    <div className="bg-cover md:w-5/6 xl:w-3/6">
                        <div className="flex items-center justify-center text-left my-20 py-10 px-20 mx-10">
                                <h1 className="text-lg text-gray-200">
                                    <span className="text-4xl font-bold ">Yahli </span>
                                    <br/>
                                    signing documents in a confidential and secure way with blockchain technology
                                </h1>
                        </div>
                    </div>
                    <div className="bg-cover md:w-5/6 xl:w-3/6 flex items-center justify-center">
                        <div className="col-start-1 col-end-2 align-middle my-8 mx-8">
                            <img className="w-64" src={partner}/>
                        </div>
                        <div className="col-start-1 col-end-2 align-middle my-8 mx-8">
                            <img className="w-64" src={deal}/>
                        </div>
                    </div>
                </div>
                {this.bigLogin()}
            </div>)
    }

    render() {
        return (<div>
            {this.getHeaderElement()}
        </div>);
    }
}

export default Header;