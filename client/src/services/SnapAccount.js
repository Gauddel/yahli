
import Ecies from 'eth-ecies';
const eutil = require('ethereumjs-util');

const origin = new URL('package.json', 'http://localhost:8081/').toString();
const snapId = `wallet_plugin_${origin}`;

class SnapAccount {

    static Instance;

    constructor() {
        
    }

    static GetInstance() {
        if (SnapAccount.Instance === undefined) {
            SnapAccount.Instance = new SnapAccount();
        }
        return SnapAccount.Instance;
    }

    connect() {
        console.log(window.ethereum);
        return window.ethereum.send({
            method: 'wallet_enable',
            params: [{
                [snapId]: {}
            }]
        })
    }

    async savePasswordAsSignee(cid, encryptedPassword) {
        try {
            const response = await window.ethereum.send({
              method: snapId,
              params: [{
                method: 'savePasswordAsSignee',
                params: [cid, encryptedPassword]
              }]
            })
            
            return response;
        } catch (err) {
            console.error(err)
            alert('Problem happened: ' + err.message || err)
        }
    }

    async savePasswordAsCreator(cid, password) {
        try {
            const response = await window.ethereum.send({
              method: snapId,
              params: [{
                method: 'savePasswordAsCreator',
                params: [cid, password]
              }]
            })
            
            return response;
          } catch (err) {
            console.error(err)
            alert('Problem happened: ' + err.message || err)
          }
    }

    async getEncryptedPassword(cid) {
        try {
            const response = await window.ethereum.send({
              method: snapId,
              params: [{
                method: 'getEncryptedPassword',
                params: [cid]
              }]
            })
            
            return response;
        } catch (err) {
            console.error(err)
            alert('Problem happened: ' + err.message || err)
        }
    }

    async encryptFile(file, password) {
        try {
            const response = await window.ethereum.send({
              method: snapId,
              params: [{
                method: 'encryptFile',
                params: [file, password]
              }]
            })
            
            return response;
        } catch (err) {
            console.error(err)
            alert('Problem happened: ' + err.message || err)
        }
    }

    async decryptFile(encryptedFile, cid) {
        try {
            const response = await window.ethereum.send({
              method: snapId,
              params: [{
                method: 'decryptFile',
                params: [encryptedFile, cid]
              }]
            })
            
            return response;
        } catch (err) {
            console.error(err)
            alert('Problem happened: ' + err.message || err)
        }
    }


    async getPublicKey () {
        try {
          const response = await window.ethereum.send({
            method: snapId,
            params: [{
              method: 'getAccount'
            }]
          })

        return response;
        } catch (err) {
          console.error(err)
          alert('Problem happened: ' + err.message || err)
        }
    }

    async encryptData(publicKey, data) {
        try {
            const response = await window.ethereum.send({
              method: snapId,
              params: [{
                method: 'encryptData',
                params: [publicKey, data]
              }]
            })

            return response;
          } catch (err) {
            console.error(err)
            alert('Problem happened: ' + err.message || err)
          }
    }

    async decryptData(encryptedData) {
        try {
            const response = await window.ethereum.send({
              method: snapId,
              params: [{
                method: 'decryptData',
                params: [encryptedData]
              }]
            })
            
            return response;
          } catch (err) {
            console.error(err)
            alert('Problem happened: ' + err.message || err)
          }
    }

    async encryptWithCounterpartyPublicKey(cid, counterpartyPublicKey) {
        try {
            const response = await window.ethereum.send({
              method: snapId,
              params: [{
                method: 'encryptWithCounterpartyPublicKey',
                params: [cid, counterpartyPublicKey]
              }]
            })
            
            return response;
        } catch (err) {
            console.error(err)
            alert('Problem happened: ' + err.message || err)
        }
    }
}

export default SnapAccount;