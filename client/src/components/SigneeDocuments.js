import React from 'react';
import SignDocument from './SignDocument';
import abi from 'ethereumjs-abi';
import SnapAccount from '../services/SnapAccount';
import SignDocu from './../services/SignDocu';

class SigneeDocuments extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            //cid : props.cid,
            documents : [],
            secrets : []
            // encryptedPassword :
        }
        this.getView = this.getView.bind(this);
        this.getDocuments = this.getDocuments.bind(this);
        this.getDocuments();
    } 

    getSigneeDocuments() {

    }

    getDocuments() {
        var callback = async (documents) => {
            var updateDocuments = (documentInfo) => {
                this.state.documents.push(documentInfo);
                this.forceUpdate();
            }
            var updateSecrets = (cid, secret) => {
                this.state.secrets.push({cid : cid, secret : secret});
                this.forceUpdate();
            }
            for(var i=0; i < documents.length; i++) {
                var cid = documents[i];
                await SignDocu.GetInstance().getDocumentInfo(cid, updateDocuments);
                await SignDocu.GetInstance().getSecret(cid, updateSecrets);
            }
        };

        SignDocu.GetInstance().getMyDocuments(callback);
    }

    getView() {
        return this.state.documents.map((document) => {
            var secret = undefined;
            for(var i=0; i<this.state.secrets.length; i++) {
                if(this.state.secrets[i].cid == document.cid) {
                    secret = this.state.secrets[i].secret;
                    break;
                }
            }
            return (
                <SignDocument key={document.cid} owner={document.owner} cid={document.cid} state={document.state} secret={secret}></SignDocument>
            )
        })
    }

    render() {
        return (<div>
            {this.getView()}
        </div>)
    }
}

export default SigneeDocuments;