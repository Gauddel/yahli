import React from 'react';
import Ipfs from './../services/Ipfs';

class DownloadDocument extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            cid : '',
        }

        this.handleCid = this.handleCid.bind(this);
        this.getDocument = this.getDocument.bind(this);
    }

    handleCid(event) {
        this.setState({
            cid : event.target.value
        })
    }

    getDocument() {
        console.log(Ipfs.GetInstance().IPFS);
        const document = Ipfs.GetInstance().IPFS.files.get(this.state.cid);
        console.log(document);
    }

    render() {
        return (<div>
            <h1>Put the cid of the image to load</h1>
            <input type="text" value={this.state.cid} onChange={this.handleCid} placeholder="Put the CID of the document."/>
            <button onClick={() => this.getDocument()}>Get Image</button>
        </div>);
    }
}

export default DownloadDocument;