import React from 'react';
import Ipfs from './../services/Ipfs';
import abi from 'ethereumjs-abi';
import SignDocu from './../services/SignDocu';
import Web3Services from '../services/Web3Services';
import SnapAccount from '../services/SnapAccount';
import Signup from './Signup';

const status = {
    WAITING: 'waiting',
    SUCCESS: 'success',
    ERROR: 'error',
    INPROGRESS: 'inprogress'
}

class CreateDocument extends React.Component {

    web3;
    contractAddress = SignDocu.contractAddress;

    constructor(props) {
        super(props);
        this.state = {
            account : this.props.account,
            fileAsBuffer : null,
            ipfsDocumentCID : null,
            fileBinaryDataFromIpfs : null,
            cid : null, // not neccessary
            creationProcessingHidden : 'hidden',
            password : '',
            confirmPassword : '',
            creationStatus : status.WAITING,
            documents : props.documents,
        }

        this.web3 = Web3Services.GetInstance().web3;
        this.handleFileLoading = this.handleFileLoading.bind(this);
        this.uploadAndCreateDocument = this.uploadAndCreateDocument.bind(this);
        this.putCIDInEthereum = this.putCIDInEthereum.bind(this);
        this.asymetricEncryptionPassword = this.asymetricEncryptionPassword.bind(this);
        this.signCreation = this.signCreation.bind(this);
        this.handlerPassword = this.handlerPassword.bind(this);
        this.handleConfirmPassword = this.handleConfirmPassword.bind(this);
    }

    uploadAndCreateDocument() {
        // Check inputed data

        if (this.state.password !== this.state.confirmPassword
            || !this.stringNotEmpty(this.state.password)
            || !this.stringNotNull(this.state.password)
            || !this.stringNotUndefined(this.state.password)) {
           alert('password not correct. Retry.');
           return;
       }

       var action = async () => {

            var encryptedfile = await SnapAccount.GetInstance().encryptFile(new Uint8Array(this.state.fileAsBuffer), this.state.password);
            Ipfs.GetInstance().IPFS.add(Buffer(encryptedfile)).then(async (result) => {
                var res = await SnapAccount.GetInstance().savePasswordAsCreator(result.path, this.state.password);
                var encryptedSecret = await SnapAccount.GetInstance().getEncryptedPassword(result.path);
                this.setState({
                    ipfsDocumentCID : result.path,
                    cid : result.cid,
                })

                this.putCIDInEthereum(result.path, encryptedSecret);

            }).catch((error) => {
                console.error(error);
            });
       }

       action();
    }

    async signCreation(cid, secret, sender) {
        var hash = "0x" + abi.soliditySHA3(
            ['string','string','address', 'uint256', 'address'],
            [cid, secret, sender, '0', this.contractAddress]
        ).toString("hex");

        hash = this.web3.utils.soliditySha3("\x19Ethereum Signed Message:\n32",hash);
        return await this.web3.eth.sign(hash, sender);
    }

    asymetricEncryptionPassword() {

    }

    async putCIDInEthereum(cid, encryptedSecret) {
        var secret = encryptedSecret;

        var sender = this.state.account;
        var signature = await this.signCreation(cid, secret, sender);

        this.setState({
            creationStatus : status.INPROGRESS
        });

        this.forceUpdate();
        console.log(cid);
        console.log(secret);
        console.log(sender);
        console.log(signature);
        SignDocu.GetInstance().createDocument(cid, secret, sender, signature, this.state.documents);
    }

    handleFileLoading(event) {
        var file = event.target.files[0];

        if (file == null || file == undefined) {
            alert('uploaded file is not correct. Retry.');
            return;
        }

        // Check if password is correct.

        var reader = new window.FileReader();

        reader.onloadend = async () => {
            this.setState({
                fileAsBuffer : reader.result
            })
        }
        reader.readAsArrayBuffer(file);
    }

    handlerPassword(event) {
        this.setState({
            password : event.target.value
        })
    }

    handleConfirmPassword(event) {
        this.setState({
            confirmPassword : event.target.value
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

    stringNotNull(value) {
        if (value == null || value === null) {
            return false;
        }
        return true;
    }

    stringNotUndefined(value) {
        if (value === undefined) {
            return false;
        }
        return true;
    }

    stringNotEmpty(value) {
        if(value === '') {
            return false;
        }
        return true;
    }

    render() {
        return (<div className="flex justify-center mt-10" >
            <div className="flex w-2/5 min-w-md rounded overflow-hidden shadow-xl">
                <div className="min-w-full px-5">
                    <label className="px-2 min-w-full text-blue-600 flex items-center justify-start text-2xl mb-2">Choose document</label>
                    <input type="file" accept=".pdf" className="px-3 flex w-full items-center justify-start text-xl text-blue-600 rounded border border-blue-500 mb-10" onChange={this.handleFileLoading}/>
                    <label className="px-2 min-w-full text-blue-600 flex items-center justify-start text-2xl mb-2">Password</label>
                    <input value={this.state.password} onChange={this.handlerPassword} className="px-3 flex w-full items-center justify-start text-xl text-blue-600 rounded border border-blue-500 mb-10" type="password" placeholder="Password"/>          
                    <label className="px-2 min-w-full text-blue-600 flex items-center justify-start text-2xl mb-2">Confirm Password</label>
                    <input value={this.state.confirmPassword} onChange={this.handleConfirmPassword} className="px-3 flex w-full items-center justify-start text-xl text-blue-600 rounded border border-blue-500 mb-10" type="password" placeholder="Confirm Password"/>          
                    <div className="flex items-center justify-end mt-20">
                        <button className={`mb-10 px-10 ${this.getButtonColor()} bg-blue-600 text-2xl hover:bg-blue-300 text-gray-200 hover:text-gray-100 font-semibold hover:font-bold py-2 px-6 border border-blue-500 hover:border-blue-300 rounded-full`} onClick={() => this.uploadAndCreateDocument()}>
                            Create File
                        </button>
                    </div>
                </div>
            </div>
        </div>);
    }
}

export default CreateDocument;