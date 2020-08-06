import React from 'react';
import lock from './../images/padlock.png';
import lightning from './../images/lightning.png';
import shield from './../images/shield.png';
import Signup from './Signup';
import Login from './Login';
import Corporate from './Corporate';
import Payment from './Payment';
import Connected from './Connected';

require('dotenv').config()

class Body extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
        }

        this.getBody = this.getBody.bind(this);
        this.getHome = this.getHome.bind(this);
        this.getCorporate = this.getCorporate.bind(this);
        this.getSignup = this.getSignup.bind(this);
        this.getLogin = this.getLogin.bind(this);
        this.getPayment = this.getPayment.bind(this);
    }

    getHome() {
        return (<div className="flex justify-around" >
        <div className="w-1/4">
            <div className="m-5 p-5 bg-gray-200 max-w-sm rounded overflow-hidden shadow-2xl">
                <div className="flex items-center justify-center">
                    <img className="w-56" src={lock} alt="Sunset in the mountains"/>
                </div>
                <div className="px-6 py-4">
                    <div className="font-bold text-xl mb-2">Encryption</div>
                        <p className="text-gray-700 text-sm">
                            <span className="font-bold">Store encrypted data</span> on Interplanetary File System.
                        </p>
                        <br/>
                        <p className="text-gray-700 text-sm">
                            Only you and your conterparty can read the encrypted document.
                        </p>
                </div>
            </div>
        </div>
        <div className="w-1/4">
            <div className="m-5 p-5 bg-gray-200 max-w-sm rounded overflow-hidden shadow-2xl">
                <div className="flex items-center justify-center">
                    <img className="w-56" src={lightning} alt="Sunset in the mountains"/>
                </div>
                <div className="px-6 py-4">
                    <div className="font-bold text-xl mb-2">Lightning Fast</div>
                        <p className="text-gray-700 text-sm">
                            Use Ethereum blockchain to <span className="font-bold">sign instantaneously</span>.
                        </p>
                        <br/>
                        <p className="text-gray-700 text-sm">
                            Optimistic rollup technology will be used by Yahli.
                        </p>
                </div>
            </div>
        </div>
        <div className="w-1/4">
            <div className="m-5 p-5 bg-gray-200 max-w-sm min-h-xl rounded overflow-hidden shadow-2xl">
                <div className="flex items-center justify-center">
                    <img className="w-56" src={shield} alt="Sunset in the mountains"/>
                </div>
                <div className="px-6 py-4">
                    <div className="font-bold text-xl mb-2">Unfalsifiable deal</div>
                    <p className="text-gray-700 text-sm">
                            Don't need to thrust an third party for storing data.
                        </p>
                        <br/>
                        <p className="text-gray-700 text-sm">
                            Deal's data <span className="font-bold">can not be falsifiable by malicious actor.</span>
                        </p>
                </div>
            </div>
        </div>
    </div>);
    }

    getCorporate() {
        return (<Corporate payment={this.props.payment}/>);
    }

    getSignup() {
        return (<Signup connect={this.props.connect}/>);
    }

    getLogin() {
        return (<Login connect={this.props.connect}/>);
    }

    getPayment() {
        return  (<Payment amount={this.props.amount}/>);
    }

    getConnect() {
        return (<Connected/>);
    }

    getBody() {
        if (this.props.isHome) {
            return this.getHome();
        }
        if (this.props.isCorporate) {
            return this.getCorporate();
        }
        if (this.props.isSignup) {
            return this.getSignup();
        }
        if (this.props.isLogin) {
            return this.getLogin();
        }
        if(this.props.isPayment) {
            return  this.getPayment();
        }
        if(this.props.isConnected) {
            return this.getConnect();
        }
    }

    render() {
        return (<div>{this.getBody()}</div>);
    }
}

export default Body;