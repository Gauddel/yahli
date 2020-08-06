import truffle from '@truffle/contract';
import SignDocuTest from './../contracts/SignDocuTest.json';
import Web3Services from './Web3Services';

//const contractABI = [{"inputs": [{"internalType": "string","name": "_cid","type": "string"},{"internalType": "address","name": "_newSignee","type": "address"}],"name": "approveToSign","outputs": [],"stateMutability": "nonpayable","type": "function"},{"inputs": [{"internalType": "string","name": "_cid","type": "string"},{"internalType": "address","name": "_signee","type": "address"},{"internalType": "string","name": "_secret","type": "string"}],"name": "createAndApproveDocument","outputs": [],"stateMutability": "nonpayable","type": "function"},{"inputs": [{"internalType": "string","name": "_cid","type": "string"},{"internalType": "string","name": "_secret","type": "string"}],"name": "createDocument","outputs": [],"stateMutability": "nonpayable","type": "function"},{"inputs": [],"stateMutability": "nonpayable","type": "constructor"},{"anonymous": false,"inputs": [{"indexed": false,"internalType": "string","name": "cid","type": "string"},{"indexed": false,"internalType": "address","name": "creator","type": "address"}],"name": "DocumentCreated","type": "event"},{"inputs": [{"internalType": "string","name": "_cid","type": "string"}],"name": "sign","outputs": [],"stateMutability": "nonpayable","type": "function"},{"anonymous": false,"inputs": [{"indexed": false,"internalType": "string","name": "cid","type": "string"},{"indexed": false,"internalType": "address","name": "signee","type": "address"}],"name": "Signature","type": "event"},{"inputs": [{"internalType": "string","name": "_cid","type": "string"},{"internalType": "address","name": "_signee","type": "address"}],"name": "documentIsSigned","outputs": [{"internalType": "bool","name": "","type": "bool"}],"stateMutability": "view","type": "function"},{"inputs": [{"internalType": "string","name": "_cid","type": "string"}],"name": "getDocument","outputs": [{"components": [{"internalType": "string","name": "cid","type": "string"},{"internalType": "address","name": "owner","type": "address"},{"internalType": "address[]","name": "oldsSignees","type": "address[]"},{"internalType": "address","name": "newSignee","type": "address"},{"internalType": "string","name": "secret","type": "string"}],"internalType": "struct Document","name": "","type": "tuple"}],"stateMutability": "view","type": "function"},{"inputs": [{"internalType": "string","name": "_cid","type": "string"},{"internalType": "address","name": "_newOwner","type": "address"}],"name": "transferOwnership","outputs": [],"stateMutability": "view","type": "function"}]

// Application Global Constants.
const contractAddress = '0xb75D851adD1044685Bc91ecfD2e6DE1C6034267D';
const infuraLink = 'https://ropsten.infura.io/v3/78b81a219f784c5d8e2ed652c46b8ef9'; 

const configureGSN = require('@opengsn/gsn/dist/src/relayclient/GSNConfigurator').configureGSN;
const Gsn = require('@opengsn/gsn/dist/src/relayclient/');

const RelayProvider = Gsn.RelayProvider;

class SignDocu {

    web3;
    contract;
    account;
    signedDocuments;
    createdDocuments;
    documents;
    gsnConfig;
    gsnProvider
    static Instance;
    jsonInterface = truffle(SignDocuTest);

    static GetInstance() {
        if (SignDocu.Instance == null) {
            SignDocu.Instance = new SignDocu();
        }
        return SignDocu.Instance;
    }

    constructor() {
            this.conf = {
                ourContract: contractAddress,
                paymaster:   '0x663946D7Ea17FEd07BF1420559F9FB73d85B5B03',// '0x666650667A73DFafa5Dda07F1da25F715BB34271',
                relayhub:    '0xEF46DD512bCD36619a6531Ca84B188b47D85124b',
                stakemgr:    '0x41c7C7c1Bf501e2F43b51c200FEeEC87540AC925',
                gasPrice:  20000000000   // 20 Gwei
            }

            this.gsnConfig = configureGSN({
                relayHubAddress : this.conf.relayhub,
                paymasterAddress : this.conf.paymaster,
                stakeManagerAddress : this.conf.stakemgr,
                gasPriceFactorPercent : 70,
                methodSuffix : '_v4',
                jsonStringifyRequest : true,
                chainId : 42,
                relayLookupWindowBlocks : 1e5
                });

            this.gsnProvider = new RelayProvider(Web3Services.GetInstance().web3.currentProvider, this.gsnConfig);
            Web3Services.GetInstance().setProvider(this.gsnProvider);
            this.web3 = Web3Services.GetInstance().web3;
            this.contract = new this.web3.eth.Contract(this.jsonInterface.abi, contractAddress);
            this.web3.eth.getAccounts().then((accounts) => {
                this.account = accounts[0];
            });
    }

    createDocument(cid, secret, sender, signature, signTransaction, secret_Key, callback) {
        // console.log(secret_Key)
        // console.log(infuraLink)
        // this.gsnProvider = new GSNProvider(infuraLink, { signKey: secret_Key });
        // this.web3.setProvider(this.gsnProvider);

        // this.contract.methods.createDocument(cid, secret, sender, signature)
        // .estimateGas({from : sender})
        // .then((gasToPay) => {
        //     this.web3.eth.getTransactionCount(sender).then((nonce) => {
        //         var txParams = {
        //             nonce: nonce,
        //             from: sender,
        //             to: contractAddress,
        //             data: this.contract.methods.createDocument(cid, secret, sender, signature).encodeABI(),
        //             gas: gasToPay,
        //         };

        //         signTransaction(txParams).then((signedTx) => {
        //             this.web3.eth.sendSignedTransaction(signedTx.rawTransaction).
        //             on('receipt', console.log);
        //             callback();
        //         })
        //         .catch((err) => {
        //             console.log(err);
        //         })
        //     })
        // })

        this.jsonInterface.setProvider(this.web3.currentProvider);
        this.jsonInterface.deployed().then((instance) => {
            var contract = instance;

            contract.createDocument(cid, secret, sender, signature, {from : sender}).then(() => {
                console.log('SUCESS');
            });
        });

        // this.gsnProvider = new RelayProvider(Web3Services.GetInstance().web3.currentProvider, this.gsnConfig);
        //     Web3Services.GetInstance().setProvider(this.gsnProvider);
        //     this.web3 = Web3Services.GetInstance().web3;
        //     this.contract = new this.web3.eth.Contract(jsonInterface.abi, contractAddress);

        // this.contract.methods.createDocument(cid, secret, sender, signature).send({from : sender, gas : 5000000}).then((res) => {
        //     console.info(res);
        // }).catch((err) => {
        //     console.error(err);
        // });
    }

    approveToSign(cid, newSignee) {
        this.contract.methods.approveToSign(cid, newSignee).send({from : this.account}).then((res) => {
            console.info(res);
        }).catch((err) => {
            console.error(err);
        });
    }

    signDocument(cid) {
        this.contract.methods.sign(cid).send({from : this.account}).then((res) => {
            console.info(res);
        }).catch((err) => {
            console.error(err);
        });
    }

    getSignedDocuments() {
        this.contract.methods.getSignedDocument().call({from : this.account}).then((signedDocuments) => {
            this.signedDocuments = signedDocuments;
            console.log(signedDocuments);
        }).catch((err) => {
            console.error(err);
        });
    }

    getCreatedDocuments() {
        this.contract.methods.getCreatedDocument().call({from : this.account}).then((createdDocuments) => {
            this.createdDocuments = createdDocuments;
            console.log(createdDocuments);
        }).catch((err) => {
            console.error(err);
        });
    }

    getDocument(cid) {
        this.contract.methods.getDocument(cid).call({from : this.account}).then((document) => {
            this.documents = document;
            console.info(document);
        }).catch((err) => {
            console.error(err);
        });
    }
}

export default SignDocu;