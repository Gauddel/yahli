import React from 'react';
import copper from "./../images/copper.png";
import silver from "./../images/silver.png";
import gold from "./../images/gold.png";
import SignDocu from "./../services/SignDocu";
import Web3Services from "./../services/Web3Services";
import abi from 'ethereumjs-abi';

// Should get Credit of the account from smart contract.

class Corporate extends React.Component {

    contractAddress = SignDocu.contractAddress;

    constructor(props) {
        super(props);
        this.state = {
            amount : 0,
            allowedAccount : ''
        }

        this.getCredit = this.getCredit.bind(this);
        this.increaseBalance = this.increaseBalance.bind(this);
        this.approveAccountCreation = this.approveAccountCreation.bind(this);
        this.handleAllowedAccount = this.handleAllowedAccount.bind(this);
    }

    increaseBalance(ether) {
        var callback = () => {
            var updateBalance = (balance) => {
                this.props.updateBalance(Web3Services.GetInstance().web3.utils.fromWei(String(balance), 'milliether'));
            }

            SignDocu.GetInstance().getBalance(updateBalance);
        }

        SignDocu.GetInstance().increaseBalance(ether, callback);
    }

    async signature(sender, allowedAccount) {
        var hash = "0x" + abi.soliditySHA3(
            ['address','address','uint256', 'address'],
            [sender, allowedAccount, '4', this.contractAddress]
        ).toString("hex");

        hash = Web3Services.GetInstance().web3.utils.soliditySha3("\x19Ethereum Signed Message:\n32", hash);
        return await Web3Services.GetInstance().web3.eth.sign(hash, sender);
    }

    approveAccountCreation() {
        var asyncAllowAccountCreation = async (allowedAccount) => {
            var accounts = await Web3Services.GetInstance().web3.eth.getAccounts();
            var sender  = accounts[0];
            var signature = await this.signature(sender, allowedAccount);
            SignDocu.GetInstance().allowAccountCreation(sender, allowedAccount, signature);
        }
        console.log(this.state.allowedAccount)
        asyncAllowAccountCreation(this.state.allowedAccount);
    }

    handleAllowedAccount(event) {
        console.log(event.target.value)
        if(! Web3Services.GetInstance().web3.utils.isAddress(event.target.value)) {
            window.alert("Input value isn't an address.");
        }
        this.setState({
            allowedAccount : event.target.value
        })
    }

    getCredit(value) {
        this.props.payment(value);
    }

    render() {
        return (<div>
        <div className="flex justify-around" >
            <div className="w-1/4">
                <div className="m-5 p-5 bg-gray-200 max-w-sm rounded overflow-hidden shadow-2xl">
                    <div className="flex items-center justify-center">
                        <img className="w-56" src={copper} alt="Sunset in the mountains"/>
                    </div>
                    <div className="px-6 py-4">
                        <div className="flex items-center justify-center">
                            <div className="font-bold text-xl mb-2 text-blue-600">Standard Plan</div>
                        </div>
                        
                            <div className="flex items-center justify-center">
                                <p className="text-gray-700 text-sm">
                                    Estimated <span className="font-bold ">100 </span> clients transaction include.
                                </p>
                            </div>

                                <br/>
                            <div className="flex items-center justify-center">
                                <button onClick={() => this.increaseBalance(1)} className="mb-10 px-10 bg-blue-600 text-xl hover:bg-blue-300 text-gray-200 hover:text-gray-100 font-semibold hover:font-bold py-2 px-6 border border-blue-500 hover:border-blue-300 rounded-full">Buy for 1 Ether</button>
                            </div>
                    </div>
                </div>
            </div>
            <div className="w-1/4">
                <div className="m-5 p-5 bg-gray-200 max-w-sm rounded overflow-hidden shadow-2xl">
                    <div className="flex items-center justify-center">
                        <img className="w-56" src={silver} alt="Sunset in the mountains"/>
                    </div>
                    <div className="px-6 py-4">
                        <div className="flex items-center justify-center">
                            <div className="font-bold text-xl mb-2 text-blue-600">Premium Plan</div>
                        </div>
                        
                            <div className="flex items-center justify-center">
                                <p className="text-gray-700 text-sm">
                                    Estimated <span className="font-bold ">1000 </span> clients transaction include.
                                </p>
                            </div>

                                <br/>
                            <div className="flex items-center justify-center">
                                <button onClick={() => this.handlerPlanPremium(4)} className="mb-10 px-10 bg-blue-600 text-xl hover:bg-blue-300 text-gray-200 hover:text-gray-100 font-semibold hover:font-bold py-2 px-6 border border-blue-500 hover:border-blue-300 rounded-full">Buy for 4 Ether</button>
                            </div>
                    </div>
                </div>
            </div>
            <div className="w-1/4">
                <div className="m-5 p-5 bg-gray-200 max-w-sm min-h-xl rounded overflow-hidden shadow-2xl">
                    <div className="flex items-center justify-center">
                        <img className="w-56" src={gold} alt="Sunset in the mountains"/>
                    </div>
                    <div className="px-6 py-4">
                        <div className="flex items-center justify-center">
                            <div className="font-bold text-xl mb-2 text-blue-600">All in Plan</div>
                        </div>
                        
                            <div className="flex items-center justify-center">
                                <p className="text-gray-700 text-sm">
                                    Estimated <span className="font-bold ">10000 </span> clients transaction include.
                                </p>
                            </div>

                                <br/>
                            <div className="flex items-center justify-center">
                                <button onClick={() => this.handlerPlanAllIn(8)} className="mb-10 px-10 bg-blue-600 text-xl hover:bg-blue-300 text-gray-200 hover:text-gray-100 font-semibold hover:font-bold py-2 px-6 border border-blue-500 hover:border-blue-300 rounded-full">Buy for 8 Ether</button>
                            </div>
                    </div>
                </div>
            </div>
        </div>
        <div className="grid grid-cols-12 items-center justify-center my-16 w-full">
                        <div className="col-start-2 col-end-12 flex border-r border-b border-l border-gray-400 lg:border-l-0 lg:border-t lg:border-gray-400 bg-white rounded-b lg:rounded-b-none lg:rounded-r p-4 justify-between leading-normal">
                            <div className="flex items-center justify-center w-3/4">
                            <div className="flex items-center justify-center w-full">
                                <input value={this.state.allowedAccount} onChange={this.handleAllowedAccount} value={this.state.newSignee} className="px-5 flex w-full items-center justify-start text-xl text-blue-600 rounded border border-blue-500" type="text" placeholder="Client Account Address"/>
                            </div>
                    </div>
                    <div className="flex items-center w-1/4">
                    <button onClick={() => this.approveAccountCreation()} className="bg-transparent hover:bg-gray-100 text-blue-500 hover:text-blue-300 font-semibold hover:font-bold py-2 px-4 border border-blue-500 hover:border-blue-300 rounded-full ml-2">
                       Approve Creation Account
                    </button>
                    </div>
                </div>
            </div>
    </div>);
    }
}

export default Corporate;
