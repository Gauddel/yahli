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
### Installation video
[![https://github.com/Gauddel/yahli/blob/master/Yahli.jpeg?raw=true](http://img.youtube.com/vi/JrkAjHiNXaA/0.jpg)](http://www.youtube.com/watch?v=JrkAjHiNXaA "Yahli Installation")
### Demo Video
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
Go inside the downloaded repository :
```
cd metamask-snaps-beta
```
It seems that the most recent version of metamask snaps didn't handle plugin correctly, we will use metamask snaps at commit db5e24849af9e54ceb743de62c1458261815aece version :
```
git reset --hard db5e24849af9e54ceb743de62c1458261815aece
```

This beta version of metamask needs a specific version of NodeJs. Change NodeJS version by using [nvm](https://github.com/nvm-sh/nvm) :
```
nvm use 10
```

Install dependencies :
```
yarn
```

Run the project :
```
yarn start
```

For activating this extensions, go to :
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

Go to the `encryption` folder and install dependencies :
```
yarn
```
Build the plugin :
```
snap build
```
Finally run the plugin :
```
snap serve
```

### Run Yahli dapp (Kovan)

Download Yahli repo :
```
git clone https://github.com/Gauddel/yahli.git
```

Go to the front end application folder :
```
cd yahli/client
```

Install the dependencies :
```
yarn
```

And Run the dapp :
```
yarn start
```

You can now test Yahli and Enjoy!!!


