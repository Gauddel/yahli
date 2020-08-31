import React from 'react';
import Ipfs from './../services/Ipfs';
import SignDocu from './../services/SignDocu';

const BufferList = require('bl/BufferList');
const CryptoJS = require("crypto-js");

class UploadDocument2 extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            blob : null,
            ipfsHash : '',
            cid : '',
            test : null,
            data : null,
        }

        this.handleFileUpload = this.handleFileUpload.bind(this);
        this.uploadToIPFS = this.uploadToIPFS.bind(this);
        this.getDocument = this.getDocument.bind(this);
        this.getDoc = this.getDoc.bind(this);
    }

    handleFileUpload(event) {
        event.preventDefault();
        const file = event.target.files[0];
        console.log(file)
        const reader = new window.FileReader();
        reader.onloadend = () => {
            var wordArray = CryptoJS.lib.WordArray.create(reader.result);          
            //var wordArray = CryptoJS.enc.Utf8.parse(reader.result);          
             // Convert: ArrayBuffer -> WordArray
            //console.log(reader.result);
            console.log(wordArray.toString(CryptoJS.enc.Base64));
            var encrypted = CryptoJS.AES.encrypt(wordArray, 'password').toString();
            console.log(encrypted)
            this.setState({ blob : Buffer(encrypted) });
        };
        reader.readAsArrayBuffer(file);
    }

    uploadToIPFS() {
        
        // ipfsecret.add(this.state.blob, 'password').then((result) => {
        //     console.log(result, 'Result');
        // })
        // var wordArray = CryptoJS.lib.WordArray.create(this.state.blob);
        // var encrypted = CryptoJS.AES.encrypt(wordArray, 'password').toString();
        Ipfs.GetInstance().IPFS.add(this.state.blob).then((result) => {
            this.setState({
                        ipfsHash : result.path,
                        cid : result.cid,
                    })

            console.log(this.state.ipfsHash)
            console.log(this.state.cid);
        this.getDoc();

        }).catch((error) => {
            console.error(error);
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
            var result2 = new ArrayBuffer(decrypt);
            this.setState({
                data : result
            });
            console.log(result);
            console.log(result2);
            this.forceUpdate();
        } }
        if(this.state.ipfsHash !== '')  {

            fct(this.state.ipfsHash.toString());
        }
    }

    getDocument() {
        if (this.state.data  == null) {
            return;
        }

        console.log(this.state.data, 'TEST');

        return (
            <div>
                <iframe src={`data:application/pdf;base64,${this.state.data}`} width="800px" height="2100px"/>
            </div>
        )
    }

    convertWordArrayToUint8Array(wordArray) {
        var arrayOfWords = wordArray.hasOwnProperty("words") ? wordArray.words : [];
        var length = wordArray.hasOwnProperty("sigBytes") ? wordArray.sigBytes : arrayOfWords.length * 4;
        var uInt8Array = new Uint8Array(length), index=0, word, i;
        for (i=0; i<length; i++) {
            word = arrayOfWords[i];
            uInt8Array[index++] = word >> 24;
            uInt8Array[index++] = (word >> 16) & 0xff;
            uInt8Array[index++] = (word >> 8) & 0xff;
            uInt8Array[index++] = word & 0xff;
        }
        return uInt8Array;
    }

    render() {
        return (<div>
            {/* <iframe src={`https://ipfs.io/ipfs/${this.state.ipfsHash}`} 
style="width:600px; height:500px;" frameborder="0"></iframe> */}
            {this.getDocument()}
            {/* <img src={`https://ipfs.io/ipfs/${this.state.ipfsHash}`}/> */}
            <label for="file">Choose a profite picture</label>
            <input type="file" id="file" accept=".pdf" onChange={this.handleFileUpload}/>
            <button onClick={() => this.uploadToIPFS()}>Upload File on IPFS</button>
        </div>)
    }
}

export default UploadDocument2;