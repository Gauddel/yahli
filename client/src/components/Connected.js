import React from 'react';
import CreateDocument from './CreateDocument';
import SignDocument from './SignDocument';

class Connected extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isCreate : true,
            isSigning : false
        }
        
        this.sign = this.sign.bind(this);
        this.document = this.document.bind(this);
        this.getView = this.getView.bind(this);
    }

    sign() {
        this.setState({
            isCreate : false,
            isSigning : true
        })
    }

    document() {
        this.setState({
            isCreate : true,
            isSigning : false
        })
    }

    getView() {
        if(this.state.isCreate) {
            return (<CreateDocument/>);
        }
        return (<SignDocument/>);
    }

    render() {
        return (<div>
           <ul className="flex">
                <li className="w-1/2 btn btn-blue flex border-solid border-4 border-blue-600 items-center justify-center py-4 bg-gray-100 hover:bg-gray-300 hover:text-blue-800">
                    <a className="text-xl text-blue-500" onClick={() => this.document()} href="#">Documents</a>
                </li>
                <li className="w-1/2 flex btn btn-blue border-solid border-4 border-blue-600 items-center justify-center py-4 hover:bg-gray-300 hover:text-blue-800">
                    <a className="text-xl text-blue-500" onClick={() => this.sign()}  href="#">Sign</a>
                </li>
            </ul>
            {this.getView()}
        </div>);
    }
}

export default Connected;