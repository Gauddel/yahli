import React from 'react';
import Ipfs from './../services/Ipfs';
// import CryptoJS from 'crypto-js';
const BufferList = require('bl/BufferList');

var CryptoJS = require("crypto-js");

const CID = require('cids')

class UploadDocument extends React.Component {
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
        // , (error, result) => {
        //     if(error) {
        //         console.error(error);
        //         return;
        //     }
        //     this.setState({
        //         ipfsHash : result[0].hash,
        //     })
        // }
        // var xmlHttp = null;
        // xmlHttp = new XMLHttpRequest();
        // xmlHttp.open( "GET",  "https://ipfs.io/ipfs/QmQfiU9f8d3jLBBrP4RYtVugL873voUPBEKB2RngUg1Xwm");
        // xmlHttp.responseType = "blob";
        // xmlHttp.onload = function (e) {
        //     console.log(xmlHttp.response);
        //     var blob = new Blob([xmlHttp.response], {type: "application/pdf"});
        //     var url = URL.createObjectURL(blob);
        //     console.log(url)
        //     //window.open(url)
        // }
        // xmlHttp.send();
        // var file = new window.FileReader();
        // file.onload = () => {
        //     var bb = new Blob([file.result], {type: "application/pdf"});
        //     var urlBb = URL.createObjectURL(bb);
        //     console.log(urlBb);
        //     //window.open(urlBb)
        // }
        // file.readAsText(new Blob([xmlHttp.response]));
        // this.setState({
        //     test : file.result
        // })
        // console.log(file)

    }
    getDoc() {
        //var data = null;
        var fct = async (hash) => {for await (const f of Ipfs.GetInstance().IPFS.get(hash)) {
            //console.log(f.path)

            const content = new BufferList()
            for await (const chunk of f.content) {
                content.append(chunk)
            }

            // (new Blob([content._bufs])).arrayBuffer().then(res => {
            //     var decrypt = CryptoJS.AES.decrypt(res, 'password');
            //     console.log(decrypt);

            // })

            //console.log(content.toString());
            var decrypt = CryptoJS.AES.decrypt(content.toString(), 'password');
            //console.log(decrypt);
            //console.log(CryptoJS.enc.Utf8);
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

    getAsText(readFile)
    {
        var reader;
        try
        {
        reader = new FileReader();
        }catch(e)
        {
            document.getElementById('output').innerHTML = 
                "Error: seems File API is not supported on your browser";
            return;
        }

    // Read file into memory as UTF-8      
    reader.readAsText(readFile, "UTF-8");

    // Handle progress, success, and errors

    //reader.onload = loaded;
    //reader.onerror = errorHandler;
    }


    getDocument() {
        if (this.state.data  == null) {
            return;
        }

        //var data = null;
        console.log(this.state.data, 'TEST');

        return (
            <div>

        {/* <embed src={"https://ipfs.io/ipfs/".concat(this.state.ipfsHash)} width="800px" height="2100px"/> */}
            {/* <embed src={`data:application/pdf;base64,${this.state.data}`} width="800px" height="2100px"/> */}
            <iframe src={`data:application/pdf;base64,${this.state.data}`} width="800px" height="2100px"/>
        {/* <p id="test"></p> */}
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

export default UploadDocument;