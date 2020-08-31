import React from 'react';
import Web3Services from './../services/Web3Services';
import BufferList from 'bl/BufferList';
import Ipfs from './../services/Ipfs';
import SnapAccount from '../services/SnapAccount';
import SignDocu from './../services/SignDocu';
import abi from 'ethereumjs-abi';
import { toBuffer } from 'ethereumjs-util';

class Document extends React.Component {

    contractAddress = SignDocu.contractAddress;

    constructor(props) {
        super(props);
        this.state = {
            cid : this.props.cid,
            owner : this.props.owner,
            signee : this.props.signee,
            newSignee : '',
            disableApprove : true
        }

        this.openDocument = this.openDocument.bind(this);
        this.approveDocumentSigning = this.approveDocumentSigning.bind(this);
        this.handleSigneeAddress = this.handleSigneeAddress.bind(this);
        this.getApproveButton = this.getApproveButton.bind(this);
        this.getApproveInput = this.getApproveInput.bind(this);
        this.doApprove = this.doApprove.bind(this);
    }

    openDocument() {
        var getEncryptedDocFromIPFS =  async (hash) => {
            const content = new BufferList()

            for await (const f of Ipfs.GetInstance().IPFS.get(hash)) {

                for await (const chunk of f.content) {
                    content.append(chunk)
                }

            }
            return content.toString();
        }
        var openTab = async (cid) => {
            var encryptedFile = await getEncryptedDocFromIPFS(cid);
            var decryptedFile = await SnapAccount.GetInstance().decryptFile(encryptedFile, cid);

            var blob = this.base64ToBlob(decryptedFile);
            var url = URL.createObjectURL(blob);
            window.open(url)
        }

        openTab(this.state.cid);
    }

    approveDocumentSigning() {
        this.setState({
            disableApprove : false
        });
        this.forceUpdate();
    }

    getApproveInput() {
        if (this.state.disableApprove) {
            return (
                <input disabled value={this.state.newSignee} onChange={this.handleSigneeAddress} className="px-3 flex w-full items-center justify-start text-xl text-blue-600 rounded border border-blue-500 mb-10" type="text" placeholder={this.state.signee}/>          
            )
        }
        return (
            <input value={this.state.newSignee} onChange={this.handleSigneeAddress} className="px-3 flex w-full items-center justify-start text-xl text-blue-600 rounded border border-blue-500 mb-10" type="text" placeholder={this.state.signee}/>          
        )
    }

    doApprove() {
        if(!Web3Services.GetInstance().web3.utils.isAddress(String(this.state.newSignee))) {
            console.error('Inputed value isn t a ethereum address.');
            window.alert('Inputed value isn t a ethereum address.');
        }
        var action = async (pubKey) => {
            console.log(pubKey);
            if (pubKey === '') {
                window.alert('Signee pubKey not created.');
            }
            var publicKey = toBuffer(pubKey);
            var encryptedPassword = await SnapAccount.GetInstance().encryptWithCounterpartyPublicKey(this.state.cid, publicKey);
            var signature = await this.signApprove(this.state.cid, this.state.owner, this.state.newSignee, encryptedPassword);

            var callback = () =>  {
                console.log('Success');
            }

            SignDocu.GetInstance().approveToSign(this.state.cid, this.state.owner, this.state.newSignee, encryptedPassword, signature, callback);
        }

        SignDocu.GetInstance().accountExist(action);
    }

    getApproveButton() {
        if (this.state.disableApprove) {
            return (
                <button onClick={() => this.approveDocumentSigning()} className="bg-blue-500 hover:bg-blue-300 text-gray-200 hover:text-gray-500 font-semibold hover:font-bold py-2 px-4 border border-blue-500 hover:border-blue-300 rounded-full ml-2">
                        Approve
                    </button>
            )
        }
        return (
            <button onClick={() => this.doApprove()} className="bg-blue-500 hover:bg-blue-300 text-gray-200 hover:text-gray-500 font-semibold hover:font-bold py-2 px-4 border border-blue-500 hover:border-blue-300 rounded-full ml-2">
                        Do Approve
            </button>
        )
    }

    handleSigneeAddress(event) {
        this.setState({
            newSignee : event.target.value
        })
    }

    base64ToBlob(base64) {
        const binaryString = window.atob(base64);
        const len = binaryString.length;
        const bytes = new Uint8Array(len);
        for (let i = 0; i < len; ++i) {
          bytes[i] = binaryString.charCodeAt(i);
        }
      
        return new Blob([bytes], { type: 'application/pdf' });
    };

    async signApprove(cid, sender, newSignee, secret) {
        var hash = "0x" + abi.soliditySHA3(
            ['string','address','address','string', 'uint256', 'address'],
            [cid, sender, newSignee, secret,  '1', this.contractAddress]
        ).toString("hex");

        hash = Web3Services.GetInstance().web3.utils.soliditySha3("\x19Ethereum Signed Message:\n32",hash);
        return await Web3Services.GetInstance().web3.eth.sign(hash, sender);
    }

    render() {
        return (
        <div className="grid grid-cols-12 items-center justify-center my-10 w-full">
                        <div className="col-start-3 col-end-11 flex border-r border-b border-l border-gray-400 lg:border-l-0 lg:border-t lg:border-gray-400 bg-white rounded-b lg:rounded-b-none lg:rounded-r p-4 justify-between leading-normal">
                            <div className="mb-8">
                            <p className="text-sm text-gray-600 flex items-center">
                                Owner : {this.state.owner}
                            </p>
                    <div className="text-gray-900 font-bold text-xl mb-2">Cid : {this.state.cid}</div>
                    <p className="text-gray-700 text-base">Next Signee : {this.getApproveInput()}
                    </p>
                    </div>
                    <div className="flex items-center">
                    {this.getApproveButton()}
                    <button onClick={() => this.openDocument()} className="bg-transparent hover:bg-gray-100 text-blue-500 hover:text-blue-300 font-semibold hover:font-bold py-2 px-4 border border-blue-500 hover:border-blue-300 rounded-full ml-2">
                        Open Document
                    </button>
                    </div>
                </div>
            </div>);
    }
}

export default Document;