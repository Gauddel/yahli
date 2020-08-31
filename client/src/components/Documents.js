import React from 'react';
import add from "./../images/add.png";
import CreateDocument from './CreateDocument';
import SignDocu from './../services/SignDocu';
import SnapAccount from '../services/SnapAccount';
import Ipfs from './../services/Ipfs';
import BufferList from 'bl/BufferList';
import Document from './Document';

class Documents extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            account : this.props.account,
            createDocumentView : false,
            documents : [],
            cidToApprove : '',
            signeeToApprove : ''
        }
        this.createDocument = this.createDocument.bind(this);
        this.getRender = this.getRender.bind(this);
        this.getDocuments = this.getDocuments.bind(this);
        this.getBackDocumentsView = this.getBackDocumentsView.bind(this);
        this.documentView = this.documentView.bind(this);
        // this.openDocument = this.openDocument.bind(this);
        this.getDocuments();
    }

    createDocument() {
        this.setState({
            createDocumentView : true,
        });
        this.forceUpdate();
    }

    getDocuments() {
        var callbackDocumentInformation = async (document) => {
            this.state.documents.push(document);
            console.log('Done');
            this.forceUpdate();
        }

        var callbackCreatedDocument = (getCreatedDocuments) => {
            this.setState({
                documents : []
            })
            for(var i=0; i < getCreatedDocuments.length; i++) {
                var cid = getCreatedDocuments[i];
                SignDocu.GetInstance().getDocumentInfo(cid, callbackDocumentInformation);
            }
        }

        SignDocu.GetInstance().getCreatedDocuments(callbackCreatedDocument);
    }
    
    getRender() {
        if(this.state.createDocumentView) {
            return this.createView();
        }
        return this.standardView();
    }

    createView() {
        return (<CreateDocument account={this.state.account} documents={this.getBackDocumentsView}/>);
    }

    getBackDocumentsView() {
        this.setState({
            createDocumentView : false,
        });
        this.getDocuments();
    }

    documentView() {
        return this.state.documents.map((document) => {
            console.log(document.state);
            return (
            <Document key={document.cid} cid={document.cid} owner={document.owner} signee={document.newSignee}/>
            );
        });
    }

    standardView() {
        return (<div>
            <div className="grid grid-cols-12 items-center justify-center my-5 w-full">
    <div className="col-start-3 col-end-11 flex min-w-full border-r border-b border-l border-gray-400 lg:border-l-0 lg:border-t lg:border-gray-400 bg-white rounded-b lg:rounded-b-none lg:rounded-r p-4 leading-normal">
            <div className="mb-8 flex justify-center items-center">
                <div className="col-start-1 col-end-2 align-middle my-8 mx-8 active:border-gray-500 opacity-100 hover:opacity-50 cursor-pointer" onClick={() => this.createDocument()}>
                    <img className="w-24" src={add}/>
                </div>
            </div>
            <p className="text-gray-900 font-bold text-3xl mb-2 flex justify-center items-center"> 
                Create a new Document.
            </p>
        </div>
    </div>
    {this.documentView()}
            </div>)
    }

    render() {
        return (<div>
            {this.getRender()}
        </div>)
    }
}

export default Documents;