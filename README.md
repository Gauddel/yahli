# Yahli

<p align="center">
  <img width="1000" height="400" src="https://raw.githubusercontent.com/Gauddel/yahli/master/Yahli.jpeg">
</p>

### Presentation
Yahli is a dapp with whom you can sign document in a confidential and secure way using blockchain technologies.
### Technologies
- [Gas Station Network](https://www.opengsn.org/).
- [Metamask Snaps](https://github.com/MetaMask/metamask-snaps-beta).
- [IPFS](https://ipfs.io/).
- Asymmetric encryption using [eth-ecies](https://github.com/libertylocked/eth-ecies), [ethereumjs-util](https://github.com/ethereumjs/ethereumjs-util) and [crypto-js](https://github.com/brix/crypto-js).
- [Ethereum](https://ethereum.org/en/).
- Web3js.
- ReactJS.
### Smart Contract Pattern
- [Proxy Delegate](https://fravoll.github.io/solidity-patterns/proxy_delegate.html) and [Eternal Storage](https://fravoll.github.io/solidity-patterns/eternal_storage.html) for upgradability.
- [Check Effect Interaction](https://fravoll.github.io/solidity-patterns/checks_effects_interactions.html) and [Emergency Stop](https://fravoll.github.io/solidity-patterns/emergency_stop.html) for security.
### Demo Video : 2 minutes
## Install and run Yahli
### Metamask Snaps Installation
##### Requirements
- Node v10.
- Yarn
##### Installation
Metamask Snaps is an on developpment version of metamask enabling implementation of plugins inside it. 
You can find Metamask snaps [here](https://github.com/MetaMask/metamask-snaps-beta).

Download Metamask Snaps repo by typing :
```
git clone https://github.com/MetaMask/metamask-snaps-beta.git
```

Install dependencies and build the project :
```
yarn & yarn dist
```

Run the project :
```
yarn start
```

For activate this extensions, go to :
```
chrome://extensions/
```

and enable `developer mode` on chrome :

<p align="center">
  <img width="460" height="250" src="https://imag.malavida.com/qa-fs/enabling-the-developer-mode-in-chrome-42.jpg">
</p>

### Encryption Plugin Installation

Encryption plugin is a metamask plugin used for asymmetric encryption of secret and encryption of document with this secret.

Download Encryption plugin repo :
```
git clone https://github.com/Gauddel/encryption.git
```

Install snaps-cli :
```
npm install -g snaps-cli
```

Go to the `encryption` folder and run the plugin :
```
snap serve
```

### Run Yahli dapp (Kovan)

Download Yahli repo :
```
git clone https://github.com/Gauddel/yahli.git
```

Run Yahli :
```
cd client & yarn start
```

You can now test Yahli and Enjoy!!!


