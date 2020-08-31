import React from 'react';
import Web3Services from './../services/Web3Services';
import SnapAccount from '../services/SnapAccount';
import BufferList from 'bl/BufferList';
import Ipfs from './../services/Ipfs';
import SignDocu from '../services/SignDocu';
import abi from 'ethereumjs-abi';

class SignDocument extends React.Component {

    contractAddress = SignDocu.contractAddress;
    web3;

    constructor(props) {
        super(props);

        this.state = {
            owner : props.owner,
            cid : props.cid,
            state : props.state,
            secret : props.secret
        }

        this.getSigningButton = this.getSigningButton.bind(this);
        this.openDocument = this.openDocument.bind(this);
        this.signSignature = this.signSignature.bind(this);
    }

    async signature(cid, secret, sender) {
        
        console.log(cid)
        console.log(secret)
        console.log(sender)
        console.log(this.contractAddress)

        var hash = "0x" + abi.soliditySHA3(
            ['string','string','address','uint256', 'address'],
            [cid, secret, sender, '2', this.contractAddress]
        ).toString("hex");

        hash = Web3Services.GetInstance().web3.utils.soliditySha3("\x19Ethereum Signed Message:\n32", hash);
        return await Web3Services.GetInstance().web3.eth.sign(hash, sender);
    }

    signSignature() {
        var asyncMethod = async (cid, secret) => {
            var accounts = await Web3Services.GetInstance().web3.eth.getAccounts();
            var signature = await this.signature(cid, secret, accounts[0]);
            SignDocu.GetInstance().signDocument(cid, secret, accounts[0], signature);
        }
        asyncMethod(this.state.cid, this.props.secret);
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

        var saveIfNeeded = async(cid, secret) => {
            var metamaskSecret = SnapAccount.GetInstance().getEncryptedPassword(cid);
            if(metamaskSecret === null) {
                SnapAccount.GetInstance().savePasswordAsSignee(cid, secret);
            }
        }

        var openTab = async (cid) => {
            var encryptedFile = await getEncryptedDocFromIPFS(cid);
            var saveSecret = await saveIfNeeded(cid, this.props.secret);
            var decryptedFile = await SnapAccount.GetInstance().decryptFile(encryptedFile, cid);

            var blob = this.base64ToBlob(decryptedFile);
            var url = URL.createObjectURL(blob);
            window.open(url)
        }

        openTab(this.state.cid);
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

    getSigningButton() {

        console.log(this.state.state);

        if (this.state.state == 2) {
            return (
                <button onClick={() => this.signSignature()} className="bg-blue-500 hover:bg-blue-300 text-gray-200 hover:text-gray-500 font-semibold hover:font-bold py-2 px-4 border border-blue-500 hover:border-blue-300 rounded-full ml-2">
                        Sign
                </button>
            )
        }

        return (
            <div></div>
        )
    }

    render() {
        return (<div className="grid grid-cols-12 items-center justify-center my-10 w-full">
        <div className="col-start-3 col-end-11 flex border-r border-b border-l border-gray-400 lg:border-l-0 lg:border-t lg:border-gray-400 bg-white rounded-b lg:rounded-b-none lg:rounded-r p-4 justify-between leading-normal">
            <div className="mb-8">
            <p className="text-sm text-gray-600 flex items-center">
                Owner : {this.state.owner}
            </p>
    <div className="text-gray-900 font-bold text-xl mb-2">Cid : {this.state.cid}</div>
    </div>
    <div className="flex items-center">
    {this.getSigningButton()}
    <button onClick={() => this.openDocument()} className="bg-transparent hover:bg-gray-100 text-blue-500 hover:text-blue-300 font-semibold hover:font-bold py-2 px-4 border border-blue-500 hover:border-blue-300 rounded-full ml-2">
        Open Document
    </button>
    </div>
</div>
</div>);
    }
}

export default SignDocument;