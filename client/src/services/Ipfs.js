const IPFS = require('ipfs-http-client');

require('dotenv').config()

class Ipfs {
    IPFS = undefined;
    static host = process.env.REACT_APP_IPFS_HOST;
    static port = process.env.REACT_APP_IPFS_PORT;
    static protocol = process.env.REACT_APP_IPFS_HOST;

    static IpfsInstance = undefined;

    constructor() {
        this.IPFS = new IPFS({host: process.env.REACT_APP_IPFS_HOST, port : process.env.REACT_APP_IPFS_PORT, protocol : process.env.REACT_APP_IPFS_PROTOCOL});
    }

    static CreateInstance() {
        Ipfs.IpfsInstance = new Ipfs();
    }

    static GetInstance() {
        if (Ipfs.IpfsInstance == undefined) {
            Ipfs.CreateInstance();
        }
        return Ipfs.IpfsInstance;
    }
}

export default Ipfs;