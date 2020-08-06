import React from 'react';
import CryptoJS from 'crypto-js';
import Ipfs from './../services/Ipfs';
import BufferList from 'bl/BufferList';
import abi from 'ethereumjs-abi';
import SignDocu from './../services/SignDocu';
import Ecies from 'eth-ecies';
import Web3Services from '../services/Web3Services';

const status = {
    WAITING: 'waiting',
    SUCCESS: 'success',
    ERROR: 'error',
    INPROGRESS: 'inprogress'
}

class CreateDocument extends React.Component {

    web3;
    contractAddress = '0x37fF10282D1030EEE0002e49AD3241d2c30f05b8';

    constructor(props) {
        super(props);
        this.state = {
            fileAsBuffer : null,
            ipfsDocumentCID : null,
            fileBinaryDataFromIpfs : null,
            cid : null, // not neccessary
            creationProcessingHidden : 'hidden',
            password : '',
            creationStatus : status.WAITING
        }

        this.web3 = Web3Services.GetInstance().web3;
        this.handleFileLoading = this.handleFileLoading.bind(this);
        this.uploadAndCreateDocument = this.uploadAndCreateDocument.bind(this);
        this.getDoc = this.getDoc.bind(this);
        this.putCIDInEthereum = this.putCIDInEthereum.bind(this);
        this.asymetricEncryptionPassword = this.asymetricEncryptionPassword.bind(this);
        this.signCreation = this.signCreation.bind(this);
        this.handlerPassword = this.handlerPassword.bind(this);
    }

    uploadAndCreateDocument() {
        this.setState({
            creationProcessingHidden : '',
        });
        Ipfs.GetInstance().IPFS.add(this.state.fileAsBuffer).then((result) => {
            this.setState({
                ipfsDocumentCID : result.path,
                cid : result.cid,
            })

            // this.getDoc(); // To Remove dont need to see the documents here
            this.putCIDInEthereum(result.path);

        }).catch((error) => {
            console.error(error);
        });

    }

    async signCreation(cid, secret, sender, privateKey) {
        console.log(this.contractAddress)
        var hash = abi.soliditySHA3(
            ['string', 'string', 'address', 'uint256', 'address'],
            [cid, secret, sender, 0, this.contractAddress]
        );
        //hash = this.web3.utils.soliditySha3("\x19Ethereum Signed Message:\n32",hash);
        return await this.web3.eth.accounts.sign(hash, privateKey);
    }

    asymetricEncryptionPassword() {

    }

    async putCIDInEthereum(cid) {
        var secret = 'password';
        const load =  Web3Services.GetInstance().web3.eth.accounts.wallet.load(this.state.password);
        var account = load[0];
        var sender = account.address;
        console.log(sender);
        console.log(secret);
        console.log(sender);
        var signature = await this.signCreation(cid, secret, sender, account.privateKey);
        console.log(signature);
        var signTransaction = account.signTransaction;
        console.log(signTransaction);
        var pk = account.privateKey;
        this.setState({
            creationStatus : status.INPROGRESS
        })
        this.forceUpdate();
        SignDocu.GetInstance().createDocument(cid, secret, sender, signature.signature, signTransaction, pk, () => {
            this.setState({
                creationStatus : status.SUCCESS
            })
        });
        
    }

    getDoc() {
        var fct = async (hash) => {for await (const f of Ipfs.GetInstance().IPFS.get(hash)) {

            const content = new BufferList()
            for await (const chunk of f.content) {
                content.append(chunk)
            }

            var decrypt = CryptoJS.AES.decrypt(content.toString(), 'password');

            var result = decrypt.toString(CryptoJS.enc.Base64);

            this.setState({
                fileBinaryDataFromIpfs : result
            });
            this.forceUpdate();
        } }
        if(this.state.ipfsDocumentCID !== '')  {

            fct(this.state.ipfsDocumentCID.toString());
        }
    }

    handleFileLoading(event) {
        var file = event.target.files[0];

        // if(file || file == null) {
        //     this.setState({
        //         fileAsBuffer : null
        //     });
        //     return;
        // }

        var reader = new window.FileReader();
        reader.onloadend = () => {
            var wordArray = CryptoJS.lib.WordArray.create(reader.result);
            var encryptedData = CryptoJS.AES.encrypt(wordArray, 'password').toString();
            this.setState({
                fileAsBuffer : Buffer(encryptedData)
            })
        }
        reader.readAsArrayBuffer(file);
    }

    handlerPassword(event) {
        this.setState({
            password : event.target.value
        })
    }

    getButtonColor() {
        if(this.state.creationStatus == status.WAITING) {
            return 'bg-blue-600';
        }

        if(this.state.paymentStatus == status.SUCCESS) {
            return 'bg-green-600';
        }

        if(this.state.paymentStatus == status.INPROGRESS) {
            return 'bg-blue-600 opacity-50 cursor-not-allowed';
        }

        if(this.state.paymentStatus == status.ERROR) {
            return 'bg-red-600';
        }
    }

    render() {
        return (<div className="flex justify-center mt-10" >
            <div className="flex w-2/5 min-w-md rounded overflow-hidden shadow-xl">
                <div className="min-w-full px-5">
                    <label className="px-2 min-w-full text-blue-600 flex items-center justify-start text-2xl mb-2">Choose document</label>
                    <input type="file" accept=".pdf" className="px-3 flex w-full items-center justify-start text-xl text-blue-600 rounded border border-blue-500 mb-10" onChange={this.handleFileLoading}/>
                    <label className="px-2 min-w-full text-blue-600 flex items-center justify-start text-2xl mb-2">Password</label>
                    <input value={this.state.password} onChange={this.handlerPassword} className="px-3 flex w-full items-center justify-start text-xl text-blue-600 rounded border border-blue-500 mb-10" type="password" placeholder="Password"/>          
                    <div className="flex items-center justify-end mt-20">
                        <button className={`mb-10 px-10 ${this.getButtonColor()} bg-blue-600 text-2xl hover:bg-blue-300 text-gray-200 hover:text-gray-100 font-semibold hover:font-bold py-2 px-6 border border-blue-500 hover:border-blue-300 rounded-full`} onClick={() => this.uploadAndCreateDocument()}>
                            {/* <svg className={`${this.state.creationProcessingHidden}animate-spin h-5 w-5 mr-3`} viewBox="0 0 24 24">
                            </svg> */}
                            Create File
                        </button>
                    </div>
                </div>
            </div>
        </div>);
    }
}

export default CreateDocument;