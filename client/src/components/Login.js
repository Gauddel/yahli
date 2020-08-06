import React from 'react';
import Web3Services from '../services/Web3Services';

class Login extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            userId : '',
            password : '',
        }

        this.login = this.login.bind(this);
        this.handlerUserId = this.handlerUserId.bind(this);
        this.handlerPassword = this.handlerPassword.bind(this);
    }

    handlerUserId(event) {
        // Check
        this.setState({
            userId : event.target.value
        });
    }

    handlerPassword(event) {
        // Check
        this.setState({
            password : event.target.value
        });
    }

    login() {
        var alert = '';

        if (!this.notAll(this.state.userId)) {
            alert = alert.concat('user name not correct. ');
        }
        if (!this.notAll(this.state.password)) {
            alert = alert.concat('user password not correct. ');
        }

        if(alert !== '') {
            window.alert(alert);
            return;
        }

        const load =  Web3Services.GetInstance().web3.eth.accounts.wallet.load(this.state.password);
        this.props.connect(load[0].address);
    }

    notAll(value) {
        return this.notnull(value) && this.notundefined(value) && this.notEmpty(value);
    }

    notnull(value) {
        if (value === null) {
            return false;
        }
        return true;
    }

    notundefined(value) {
        if (value === undefined) {
            return false;
        }
        return true;
    }

    notEmpty(value) {
        if(value === '') {
            return false;
        }
        return true;
    }

    render() {
        return (<div>
            <div className="flex justify-center mt-10" >
                <div className="flex w-2/5 min-w-md rounded overflow-hidden shadow-xl">
                    <div className="min-w-full px-5">
                        <label className="px-2 min-w-full text-blue-600 flex items-center justify-start text-2xl mb-2">User Identification</label>
                        <input value={this.state.userId} onChange={this.handlerUserId} className="px-3 flex w-full items-center justify-start text-xl text-blue-600 rounded border border-blue-500 mb-10" type="text" placeholder="User Identification"/>
                        <label className="px-2 min-w-full text-blue-600 flex items-center justify-start text-2xl mb-2">Password</label>
                        <input value={this.state.password} onChange={this.handlerPassword} className="px-3 flex w-full items-center justify-start text-xl text-blue-600 rounded border border-blue-500 mb-10" type="password" placeholder="Password"/>
                        <div className="flex items-center justify-end mt-20">
                            <button onClick={() => this.login()} className="mb-10 px-10 bg-blue-600 text-2xl hover:bg-blue-300 text-gray-200 hover:text-gray-100 font-semibold hover:font-bold py-2 px-6 border border-blue-500 hover:border-blue-300 rounded-full">Sign up</button>
                        </div>
                    </div>             
                </div>
            </div>
        </div>)
    }
}

export default Login;