import React from 'react';
import Web3Services from '../services/Web3Services';

const status = {
    WAITING: 'waiting',
    SUCCESS: 'success',
    ERROR: 'error',
    INPROGRESS: 'inprogress'
}

class Payment extends React.Component {

    constructor(props) {
        super(props);

        console.log(process.env.REACT_APP_STRIPE_SECRET_KEY)

        this.state = {
            amount : props.amount,
            password : '',
            userId : '',
            paymentStatus :status.WAITING,
        }

        this.handlerUserId = this.handlerUserId.bind(this);
        this.handlerPassword = this.handlerPassword.bind(this);
    }

    handlerPassword(event) {
        this.setState({
            password : event.target.value
        })
    }

    handlerUserId(event) {
        this.setState({
            userId : event.target.value
        })
    }

    handleFormSubmit() {
        this.setState({
            paymentStatus : status.INPROGRESS
        });

        const load =  Web3Services.GetInstance().web3.eth.accounts.wallet.load(this.state.password);
        console.info(load[0]);
    }

    getButtonColor() {
        if(this.state.paymentStatus == status.WAITING) {
            return 'bg-blue-600';
        }

        if(this.state.paymentStatus == status.SUCCESS) {
            return 'bg-green-600';
        }

        if(this.state.paymentStatus == status.INPROGRESS) {
            return 'bg-blue-600 opacity-50 cursor-not-allowed';
        }

        if(this.state.paymentStatus == status.ERROR) {
            return 'bg-red-600';
        }
    }

    render() {
        return (<div>
            <div className="flex justify-center my-10" >
                <div className="flex w-3/5 min-w-md rounded overflow-hidden shadow-xl">
                    <div className="w-full p-10">
                        <label className="px-2 min-w-full text-blue-600 flex items-center justify-start text-2xl mb-2">User Identification</label>
                        <input value={this.state.userId} onChange={this.handlerUserId} className="px-3 flex w-full items-center justify-start text-xl text-blue-600 rounded border border-blue-500 mb-10" type="text" placeholder="User Identification"/>
                        <label className="px-2 min-w-full text-blue-600 flex items-center justify-start text-2xl mb-2">Password</label>
                        <input value={this.state.password} onChange={this.handlerPassword} className="px-3 flex w-full items-center justify-start text-xl text-blue-600 rounded border border-blue-500 mb-10" type="password" placeholder="Password"/>
                        <div className="flex items-center justify-end mt-20">
                            <button onClick={() => this.handleFormSubmit()} className={`mb-10 px-10 ${this.getButtonColor()} text-2xl hover:bg-blue-300 text-gray-200 hover:text-gray-100 font-semibold hover:font-bold py-2 px-6 border border-blue-500 hover:border-blue-300 rounded-full`}>Pay {this.props.amount} Ether</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>);
    }
}

export default Payment;