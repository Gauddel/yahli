// pragma solidity ^0.6.2;
// pragma experimental ABIEncoderV2;

// import "./../SignDocuBussiness.sol";
// import "./../SignDocuStorage.sol";

// contract Utils {
//     function getStateFromUint(uint256 _state) public returns(State) {
//         if (_state == 1) {
//             return State.Created;
//         }
//         if (_state == 2) {
//             return State.SignPending;
//         }
//         if (_state == 3) {
//             return State.Signed;
//         }
//     }
// }


// // To deal with 24576 bytes limit

// contract ProxyForAccountCreation is SignDocuBussiness {
//     function createAccountMock(address _sender, string memory _accountPubKey) public {
//         createAccount(_sender, _accountPubKey);
//     }
// }

// contract ProxyForApprovingAccountCreation is SignDocuBussiness {
//     function createAccountMock(address _sender, string memory _accountPubKey) public {
//         createAccount(_sender, _accountPubKey);
//     }

//     function resetAccountMock(address _sender, string memory _accountPubKey) public {
//         accounts[_sender] = _accountPubKey;
//     }

//     function allowAccountCreationMock(address _sender, address _allowed) public {
//         allowAccountCreation(_sender, _allowed);
//     }
// }

// contract ProxyForDocumentCreation is SignDocuBussiness {
//     function createAccountMock(address _sender, string memory _accountPubKey) public {
//         createAccount(_sender, _accountPubKey);
//     }
//     function resetAccountMock(address _sender, string memory _accountPubKey) public {
//         accounts[_sender] = _accountPubKey;
//     }

//     function createDocumentMock(string memory _cid, string memory _secret, address _sender) public {
//         createDocument(_cid, _secret, _sender);
//     }
// }

// contract ProxyForDocumentSignatureApproval is SignDocuBussiness {
//     function createAccountMock(address _sender, string memory _accountPubKey) public {
//         createAccount(_sender, _accountPubKey);
//     }

//     function createDocumentMock(string memory _cid, string memory _secret, address _sender) public {
//         documents[_cid] = Document({cid : _cid, owner : _sender, newSignee : address(0x00), state : State.Created});
//         documents[_cid].secrets[_sender] = _secret;
//         documentsExist[_cid] = true;
//         creators[_sender].push(_cid);

//         emit DocumentCreated(_cid, _sender);
//     }

//     function approveToSignMock(string memory _cid, address _sender, address _newSignee, string memory _secret) public {
//         approveToSign(_cid, _sender, _newSignee, _secret);
//     }
// }

// contract ProxyForDocumentSigning is SignDocuBussiness, Utils {

//     function createDocumentMock(string memory _cid, string memory _secret, address _sender) public {
//         documents[_cid] = Document({cid : _cid, owner : _sender, newSignee : address(0x00), state : State.Created});
//         documents[_cid].secrets[_sender] = _secret;
//         documentsExist[_cid] = true;
//         creators[_sender].push(_cid);

//         emit DocumentCreated(_cid, _sender);
//     }

//     function setDocumentState(string memory _cid, uint256 _state) public {
//         documents[_cid].state = getStateFromUint(_state);
//     }

//     function setSignee(string memory _cid, address _signee) public {
//         documents[_cid].newSignee = _signee;
//     }

//     function signMock(string memory _cid, string memory _secret, address _sender) public {
//         sign(_cid, _secret, _sender);
//     }
// }