import Web3 from 'web3';

const infuraLink = 'https://ropsten.infura.io/v3/78b81a219f784c5d8e2ed652c46b8ef9';

class Web3Services {

    web3;
    
    static Instance;

    static GetInstance() {
        if (Web3Services.Instance == null) {
            Web3Services.Instance = new Web3Services();
        }
        return Web3Services.Instance;
    }

    constructor() {
        this.web3 = new Web3(new Web3.providers.HttpProvider(infuraLink));
        console.log(this.web3)
    }

    setProvider(provider) {
        this.web3.setProvider(provider);
    }
}

export default Web3Services; 