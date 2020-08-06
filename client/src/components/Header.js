import React from 'react';
import logo from "./../images/Yahli-full.png";
import partner from "./../images/partner.png";
import deal from "./../images/deal.png";
import cryptocurrency from "./../images/cryptocurrency.png"
import power from "./../images/power.png"

class Header extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            //isHome : props.isHome
        }

        this.getHeaderElement = this.getHeaderElement.bind(this);
        this.signup = this.signup.bind(this);
        this.corporate = this.corporate.bind(this);
        this.login = this.login.bind(this);
        this.home = this.home.bind(this);
    }

    signup() {
        this.props.signup();
    }

    corporate() {
        this.props.corporate();
    }

    login() {
        this.props.login();
    }

    home() {
        this.props.home();
    }

    getAccount() {
        return this.props.account.toString()
    }

    getHeaderElement() {
        if (this.props.isHome) {
            return (<div className="bg-gradient-blue-to-purple">
                <header className="grid grid-cols-4 h-25">
                    <div className="col-start-1 col-end-2 align-middle my-8 mx-8">
                        <img className="w-32" src={logo}/>
                    </div>
                    <div className="flex col-start-4 col-end-4 items-center justify-center">
                        {/* <button onClick={() => this.corporate()} className="bg-transparent hover:bg-transparent text-gray-200 font-semibold py-2 px-4 border border-transparent hover:border-gray-200 rounded-full">
                        Corporate
                        </button> */}
                        <button onClick={() => this.signup()} className="bg-gray-200 hover:bg-gray-100 text-blue-500 font-semibold hover:font-bold py-2 px-4 border border-gray-200 hover:border-gray-300 rounded-full ml-2">
                        Sign up
                        </button>
                        <button onClick={() => this.login()} className="bg-transparent hover:bg-gray-100 text-gray-200 hover:text-blue-500 font-semibold hover:font-bold py-2 px-4 border border-gray-200 hover:border-gray-300 rounded-full ml-2">
                        Login
                        </button>
                    </div>
                </header>
                <div className="flex">
                    <div className="bg-cover md:w-5/6 xl:w-3/6">
                        {/* <img className="w-full invisible" src={img}>
                            
                        </img> */}
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
                <div className="flex items-center justify-center">
                    <button onClick={() => this.signup()} className="shadow-2xl mt-10 mb-20 px-10 bg-transparent hover:bg-gray-100 text-2xl text-gray-200 font-semibold hover:font-bold py-2 px-4 border border-gray-200 hover:border-gray-300 rounded-full ml-2">
                        Sign up
                    </button>
                </div>
            </div>)
        }

        if (this.props.isConnected) {
            return (<div className="bg-gradient-blue-to-purple">
            <header className="grid grid-cols-4 h-25">
                <div className="col-start-1 col-end-2 align-middle my-8 mx-8">
                    <img className="w-32" src={logo}/>
                </div>
                <div className="flex col-start-4 col-end-4 items-center justify-center">
                    <button onClick={() => this.corporate()} className="bg-transparent hover:bg-gray-100 text-gray-200 hover:text-blue-500 font-semibold hover:font-bold py-2 px-4 border border-gray-200 hover:border-gray-300 rounded-full ml-2">
                    Credit
                    </button>
                    <div className="flex items-center justify-center mx-3 active:border-gray-500 opacity-100 hover:opacity-50">
                            <img className="btn w-12  border-gray-300 focus:border-gray-100"  onClick={() => {navigator.clipboard.writeText(this.props.account)}} title={`${this.getAccount()}`} src={cryptocurrency}/>
                    </div>
                    <div className="flex items-center justify-center mx-3 active:border-gray-500 opacity-100 hover:opacity-50">
                            <img className="btn w-10" title="Disconnect" onClick={() => this.props.disconnect()} src={power}/>
                    </div>
                </div>
            </header>
        </div>);
        }

        return (<div className="bg-gradient-blue-to-purple">
                <header className="grid grid-cols-4 h-25">
                    <div className="col-start-1 col-end-2 align-middle my-8 mx-8">
                        <img className="w-32" src={logo}/>
                    </div>
                    <div className="flex col-start-4 col-end-4 items-center justify-center">
                        <button onClick={() => this.signup()} className="bg-gray-200 hover:bg-gray-100 text-blue-500 font-semibold hover:font-bold py-2 px-4 border border-gray-200 hover:border-gray-300 rounded-full ml-2">
                        Sign up
                        </button>
                        <button onClick={() => this.login()} className="bg-transparent hover:bg-gray-100 text-gray-200 hover:text-blue-500 font-semibold hover:font-bold py-2 px-4 border border-gray-200 hover:border-gray-300 rounded-full ml-2">
                        Login
                        </button>
                    </div>
                </header>
        </div>);
    }

    render() {
        return (<div>
            {this.getHeaderElement()}
        </div>);
    }
}

export default Header;