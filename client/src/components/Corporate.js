import React from 'react';
import copper from "./../images/copper.png";
import silver from "./../images/silver.png";
import gold from "./../images/gold.png";

// Should get Credit of the account from smart contract.

class Corporate extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            amount : 0,
        }

        this.handlerPlanStandard = this.handlerPlanStandard.bind(this);
        this.handlerPlanPremium = this.handlerPlanPremium.bind(this);
        this.handlerPlanAllIn = this.handlerPlanAllIn.bind(this);
        this.getCredit = this.getCredit.bind(this);
    }

    handlerPlanStandard() {
        this.setState({
            amount : 1
        });
        this.getCredit(1);
    }

    handlerPlanPremium() {
        this.setState({
            amount : 4
        });
        this.getCredit(4);
    }

    handlerPlanAllIn() {
        this.setState({
            amount : 8
        });
        this.getCredit(8);
    }

    getCredit(value) {
        this.props.payment(value);
    }

    render() {
        return (<div className="flex justify-around" >
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
                            <button onClick={() => this.handlerPlanStandard()} className="mb-10 px-10 bg-blue-600 text-xl hover:bg-blue-300 text-gray-200 hover:text-gray-100 font-semibold hover:font-bold py-2 px-6 border border-blue-500 hover:border-blue-300 rounded-full">Buy for 1 Ether</button>
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
                            <button onClick={() => this.handlerPlanPremium()} className="mb-10 px-10 bg-blue-600 text-xl hover:bg-blue-300 text-gray-200 hover:text-gray-100 font-semibold hover:font-bold py-2 px-6 border border-blue-500 hover:border-blue-300 rounded-full">Buy for 4 Ether</button>
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
                            <button onClick={() => this.handlerPlanAllIn()} className="mb-10 px-10 bg-blue-600 text-xl hover:bg-blue-300 text-gray-200 hover:text-gray-100 font-semibold hover:font-bold py-2 px-6 border border-blue-500 hover:border-blue-300 rounded-full">Buy for 8 Ether</button>
                        </div>
                </div>
            </div>
        </div>
    </div>);
    }
}

export default Corporate;
