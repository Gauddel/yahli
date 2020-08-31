import contract from '@truffle/contract';
import SignDocuBussiness from './../contracts/SignDocuBussiness.json';
import Web3Services from './Web3Services';
import Web3 from 'web3';
import { resolveConfigurationGSN } from '@opengsn/gsn'

// Paymaster : 0xe6FbB4e36f513edb9cB5Cb2BD216C81A4f979538
// Proxy : 0x67C98f9739bA008d26ab97C823E9a130527994Ba
// Bussiness : 0x0E221888712bA52856567f00768388D2Acd6BB32 / 0xD972e224EFA3124D4583a24892002081378b594d

// const configureGSN = require('@opengsn/gsn/dist/src/relayclient/GSNConfigurator').configureGSN;
// const Gsn = require('@opengsn/gsn/dist/src/relayclient/');
const Gsn = require('@opengsn/gsn');

const RelayProvider = Gsn.RelayProvider;

class SignDocu {

    static contractAddress = '0x4d33EaD1b8642D75b391aB411E3633BeC59B54f2';
    web3;
    contract;
    contractBiconomy;
    signedDocuments;
    createdDocuments;
    documents;
    gsnConfig;
    gsnProvider
    static Instance;
    jsonInterface = contract(SignDocuBussiness);
    standardProvider;
    biconomy;
    isInit = false;

    static GetInstance() {
        if (SignDocu.Instance == null) {
            SignDocu.Instance = new SignDocu();
        }
        return SignDocu.Instance;
    }

    constructor() {
            this.conf = {
                ourContract: SignDocu.contractAddress,
                paymaster:   '0x3048A062DAf62f5765536Eed0E893027efEf7e72',
                relayhub:    '0xcfcb6017e8ac4a063504b9d31b4AbD618565a276',
                // stakemgr:    '0x41c7C7c1Bf501e2F43b51c200FEeEC87540AC925',
                forwarder: '0x663946D7Ea17FEd07BF1420559F9FB73d85B5B03',
                gasPrice:  20000000000
            }
    }

    initialize() {
        var init = async () => {
            if(this.isInit) {
                return;
            }
            this.gsnConfig = await resolveConfigurationGSN(window.ethereum, {
                verbose: true,
                //relayHubAddress : this.conf.relayhub,
                paymasterAddress : this.conf.paymaster,
                //stakeManagerAddress : this.conf.stakemgr,
                forwarderAddress: this.conf.forwarder,
                gasPriceFactorPercent : 70,
                methodSuffix : '_v4',
                jsonStringifyRequest : true,
                chainId : 42,
                relayLookupWindowBlocks : 1e5
                });

            this.gsnProvider = new RelayProvider(Web3Services.GetInstance().web3.currentProvider, this.gsnConfig);
            Web3Services.GetInstance().setProvider(this.gsnProvider);
            this.web3 = Web3Services.GetInstance().web3;
            this.web3.setProvider(this.gsnProvider);
            this.contract = new this.web3.eth.Contract(this.jsonInterface.abi, SignDocu.contractAddress);
            this.isInit = true;
        }

        return init();
    }

    execute(method) {
        this.initialize().then(() => {
            Web3Services.GetInstance().web3.eth.getAccounts().then((accounts) => {
                method(accounts[0]);
            });
        })
    }

    accountExist(callback) {
        var method = (account) => {

            this.contract.methods.accounts(account).call({from : account}).then((res) => {
                callback(res);
            })
        }
        this.execute(method);
    }

    approvalData(encode) {
        const asyncApprovalData = async function () {
            return Promise.resolve(encode)
        };

        const newProvider = new RelayProvider(this.web3.currentProvider, this.gsnConfig, {asyncApprovalData});
        this.web3.setProvider(newProvider);
        this.contract = new this.web3.eth.Contract(this.jsonInterface.abi, SignDocu.contractAddress);
    }

    createAccount(sender, pubKey, signature, callback) {
        this.contract.methods.createAccount(sender, pubKey, signature).estimateGas().then((estimate) => {
            this.approvalData(this.getApprovalDataForAccountCreation(sender, estimate))
            this.contract.methods.createAccount(sender, pubKey, signature).send({from : sender, gas : estimate}).then((res) => {
                console.info('Account Created');
                callback(res);
            });
        })
    }

    getApprovalDataForAccountCreation(sender, gasEstimate) {
        console.log(sender, 'Sender');
        console.log(gasEstimate, 'Gas Estimation');
        return this.web3.eth.abi.encodeParameters(['string','address', 'uint256', 'uint256'], ['', sender, gasEstimate, 3]);
    }
 
    createDocument(cid, secret, sender, signature, callback) {
        this.contract.methods.createDocument(cid, secret, sender, signature).estimateGas().then((estimate) => {
            this.approvalData(this.getApprovalDataForDocumentCreation(sender, estimate));
            this.contract.methods.createDocument(cid, secret, sender, signature).send({from : sender, gas : estimate}).then((res) => {
                console.info('Documents Creation Success');
                callback();
            })
        })
    }

    getApprovalDataForDocumentCreation(sender, gasEstimate) {
        console.log(sender, 'Sender');
        console.log(gasEstimate, 'Gas Estimation');
        return this.web3.eth.abi.encodeParameters(['string','address', 'uint256', 'uint256'], ['', sender, gasEstimate, 0]);
    }

    approveToSign(cid, sender, newSignee, secret, signature, callback) {
        this.contract.methods.approveToSign(cid, sender, newSignee, secret, signature).estimateGas().then((estimate) => {
            this.approvalData(this.getApprovalDataForApproveToSignDocument(cid, sender, estimate));
            this.contract.methods.approveToSign(cid, sender, newSignee, secret, signature).send({from : sender}).then(() => {
                console.info('Documents Approval for '+ String(newSignee) +', for document ' + String(cid) + ' Done.');
                callback();
            }).catch((err) => {
                console.error(err);
            });
        });
    }

    getApprovalDataForApproveToSignDocument(cid, sender, gasEstimate) {
        console.log(sender, 'Sender');
        console.log(gasEstimate, 'Gas Estimation');
        return this.web3.eth.abi.encodeParameters(['string','address', 'uint256', 'uint256'], [cid, sender, gasEstimate, 1]);
    }

    signDocument(cid, secret, sender, signature) {
        this.contract.methods.sign(cid, secret, sender, signature).estimateGas().then((estimate) => {
            this.approvalData(this.getApprovalDataForSignDocument(cid, sender, estimate));
            this.contract.methods.sign(cid, secret, sender, signature).send({from : sender, gas : estimate}).then((res) => {
            }).catch((err) => {
                console.error(err);
            });
        })
        
    }

    getApprovalDataForSignDocument(cid, sender, gasEstimate) {
        console.log(sender, 'Sender');
        console.log(gasEstimate, 'Gas Estimation');
        return this.web3.eth.abi.encodeParameters(['string','address', 'uint256', 'uint256'], [cid, sender, gasEstimate, 2]);
    }

    allowAccountCreation(sender, allowedAccount, signature) {
        console.log(sender);
        console.log(allowedAccount);
        console.log(signature);
        this.contract.methods.allowAccountCreation(sender, allowedAccount, signature).estimateGas().then((estimate) => {
            this.approvalData(this.getApprovalDataForAllowAccountCreation(sender, estimate));
            this.contract.methods.allowAccountCreation(sender, allowedAccount, signature).send({from : sender, gas : estimate}).then((res) => {
                console.log('Successfuly approve account creation.')
            }).catch((err) => {
                console.error(err);
            });
        })
    }

    getApprovalDataForAllowAccountCreation(sender, gasEstimate) {
        console.log(sender, 'Sender');
        console.log(gasEstimate, 'Gas Estimation');
        return this.web3.eth.abi.encodeParameters(['string','address', 'uint256', 'uint256'], ['', sender, gasEstimate, 4]);
    }

    increaseBalance(ether, callback) {
        var method = (account) => {
            this.contract.methods.sendPayement().send({from : account, useGSN: false, value : this.web3.utils.toWei(String(ether), 'ether')}).then(() => {
                console.log('Successfully paid.');
                callback();
            })
        }
        this.execute(method);
    }

    getMyDocuments(callback) {
        var method = (account) => { 
            this.contract.methods.getSigneeDocument().call({from : account}).then((signedDocuments) => {
                console.log(signedDocuments);
                callback(signedDocuments);
            }).catch((err) => {
                console.error(err);
            });
        }
        this.execute(method);
    }

    getSecret(cid, callback) {
        var method = (account) => {
            this.contract.methods.getDocumentSecret(cid).call({from : account}).then((secret) => {
                callback(cid, secret);
            }).catch((err) => {
                console.error(err);
            })
        }

        this.execute(method);
    }

    getCreatedDocuments(callback) {
        var method = (account) => { 
            this.contract.methods.getCreatedDocument().call({from : account}).then((createdDocuments) => {
                callback(createdDocuments);
            }).catch((err) => {
                console.error(err);
            });
        }

        this.execute(method);
    }

    getDocumentInfo(cid, callback) {
        var method = (account) => {
            this.contract.methods.documents(cid).call({from : account}).then((document) => {
                callback(document);
            }).catch((err) => {
                console.error(err);
            });
        }

        this.execute(method)
    }

    getBalance(callback) {
        var method = (account) => {
            this.contract.methods.balances(account).call({from : account}).then((balance) => {
                console.log(balance);
                callback(balance);
            })
        }

        this.execute(method);
    }
}

export default SignDocu;