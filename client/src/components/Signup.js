import React from 'react';
import Web3Services from '../services/Web3Services';

class Signup extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            userId : '',
            password : '',
            confirmPassword : '',
            randomPhrase : ''
        }

        this.register = this.register.bind(this);
        this.handlerUserId = this.handlerUserId.bind(this);
        this.handlerPassword = this.handlerPassword.bind(this);
        this.handlerConfirmPassword = this.handlerConfirmPassword.bind(this);
        this.handlerRandomPhrase = this.handlerRandomPhrase.bind(this);
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

    handlerConfirmPassword(event) {
        // Check
        this.setState({
            confirmPassword : event.target.value
        });
    }

    handlerRandomPhrase(event) {
        this.setState({
            randomPhrase : event.target.value
        })
    }

    register() {
        var alert = '';

        if (!this.notAll(this.state.userId)) {
            alert = alert.concat('user name not correct. ');
        }
        if (!this.notAll(this.state.password)) {
            alert = alert.concat('user password not correct. ');
        }
        if (!this.notAll(this.state.confirmPassword) || this.state.password !== this.state.confirmPassword) {
            alert = alert.concat('user password not match confirmation. ');
        }
        if (!this.notAll(this.state.randomPhrase)) {
            alert = alert.concat('user random phrase not correct. ');
        }

        if(alert !== '') {
            window.alert(alert);
            return;
        }

        const creation = Web3Services.GetInstance().web3.eth.accounts.wallet.create(1, this.state.randomPhrase);
        console.info(creation);
        const encrypt = Web3Services.GetInstance().web3.eth.accounts.wallet.encrypt(this.state.password);
        console.info(encrypt);
        const save = Web3Services.GetInstance().web3.eth.accounts.wallet.save(this.state.password);
        console.info(save);
        const load =  Web3Services.GetInstance().web3.eth.accounts.wallet.load(this.state.password);
        this.props.connect(load.address);
        console.info(load);
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
        return (
            <div>
                    <div className="flex justify-center my-10" >
                        <div className="flex w-4/5 min-w-md rounded overflow-hidden shadow-xl">
                                <div className="m-5 w-1/3">
                                    <label className="px-2 text-blue-600 flex items-center justify-start text-2xl mb-2">User Identification</label>
                                    <input value={this.state.userId} onChange={this.handlerUserId} className="px-3 flex w-full items-center justify-start text-xl text-blue-600 rounded border border-blue-500 mb-10" type="text" placeholder="User Identification"/>
                                    <label className="px-2 text-blue-600 flex items-center justify-start text-2xl mb-2">Password</label>
                                    <input value={this.state.password} onChange={this.handlerPassword} className="px-3 flex w-full items-center justify-start text-xl text-blue-600 rounded border border-blue-500 mb-10" type="password" placeholder="Password"/>
                                    <label className="px-2 text-blue-600 flex items-center justify-start text-2xl mb-2">Confirm Password</label>
                                    <input value={this.state.confirmPassword} onChange={this.handlerConfirmPassword} className="px-3 flex w-full items-center justify-start text-xl text-blue-600 rounded border border-blue-500 mb-5" type="password" placeholder="Confirm Password"/>
                                </div>
                                <div className="m-5 w-2/3">
                                    <label className="px-2 text-blue-600 flex items-center justify-start text-2xl mb-3">Random phrase to generate your ethereum identity</label>
                                    <textarea value={this.state.randomPhrase} onChange={this.handlerRandomPhrase} placeholder="Generate a random number, for the creation of the private key, by inputing a random (important) sentence!!!" className="px-3 flex w-full items-center justify-start text-xl text-blue-600 rounded border border-blue-500 mb-20" rows="9" cols="40"/>
                                    <div className="flex items-center justify-end mt-20">
                                        <button onClick={() => this.register()} className="mb-10 px-10 bg-blue-600 text-2xl hover:bg-blue-300 text-gray-200 hover:text-gray-100 font-semibold hover:font-bold py-2 px-6 border border-blue-500 hover:border-blue-300 rounded-full">Sign up</button>
                                    </div>
                                </div>
                        </div>
                    </div>
            </div>);
    }
}

export default Signup;