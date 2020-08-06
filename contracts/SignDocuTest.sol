pragma solidity 0.6.2;
pragma experimental ABIEncoderV2;

import "@opengsn/gsn/contracts/BaseRelayRecipient.sol";

struct Document {
    string cid;
    address owner;
    address[] oldsSignees;
    address newSignee;
    string secret;
}

// 0xb75D851adD1044685Bc91ecfD2e6DE1C6034267D Contract Address.
// Use openzeppelin framework for safety

contract SignDocuTest is BaseRelayRecipient {

    enum Action {
        Create,
        Sign
    }

    mapping(string => Document) documents;
    mapping(string => bool) documentsExist;

    mapping(address => string[]) creators;
    mapping(address => string[]) signedDocuments;

    event Signature(string cid, address signee);
    event DocumentCreated(string cid, address creator);

    constructor(address _forwarder) public {
        trustedForwarder = _forwarder;
    }

    function documentIsSigned(string memory _cid, address _signee) public view returns(bool) {
        Document memory document = getDocument(_cid);

        for(uint i=0; i <  document.oldsSignees.length; i++) {
            if (document.oldsSignees[i] == _signee) {
                return true;
            }
        }

        return false;
    }

    // function createAndApproveDocument(string memory _cid, address _signee, string memory _secret, address _sender) public {
    //     createDocument(_cid, _secret, _sender);
    //     approveToSign(_cid, _signee);
    // }

    function createDocument(string memory _cid, string memory _secret, address _sender, bytes memory _signature) public documentDontExist(_cid) {
        require(isValidCreationDocumentSignature(_cid, _secret, _sender, _signature), 'Signature is not valid.');

        documents[_cid] = Document({cid : _cid, owner : _sender, oldsSignees : new address[](100), newSignee : address(0x00), secret : _secret});
        documentsExist[_cid] = true;
        creators[_sender].push(_cid);

        emit DocumentCreated(_cid, _sender);
    }

    function sign(string memory _cid, address _sender, bytes memory _signature) public documentExist(_cid) {
        Document storage document = documents[_cid];
        
        require(document.newSignee == _sender, "Only the assign signee by the owner can sign the document.");

        signedDocuments[_sender].push(_cid);
        document.oldsSignees.push(_sender);
    }

    function approveToSign(string memory _cid, address _newSignee) public documentExist(_cid) onlyOwner(_cid){
        Document storage document = documents[_cid];
        document.newSignee = _newSignee;
    }

    function getSignedDocument() public view returns(string[] memory) {
        return signedDocuments[msg.sender];
    }

    function getCreatedDocument() public view returns(string[] memory) {
        return creators[msg.sender];
    }

    function getDocument(string memory _cid) public view returns(Document memory) {
        return documents[_cid];
    }

    function transferOwnership(string memory _cid, address _newOwner) public view onlyOwner(_cid) {
        Document memory document = getDocument(_cid);
        document.owner = _newOwner;
    }

    modifier documentExist(string memory _cid) {
        require(documentsExist[_cid], "Document didn't exist.");
        _;
    }

    modifier documentDontExist(string memory _cid) {
        require(!documentsExist[_cid], "Document already exist.");
        _;
    }

    modifier onlyOwner(string memory _cid) {
        require(documents[_cid].owner == msg.sender, "Only the owner of the document can transfer ownership.");
        _;
    }

    // Sign Document

    function isValidSignSignature(string memory _cid, string memory _secret, address _sender, bytes memory _signature)
    public view returns(bool) {
        bytes32 message = prefixed(keccak256(abi.encodePacked(_cid, _secret, _sender, uint(Action.Create), address(this))));
        
        return recoverSigner(message, _signature) == _sender;
    }

    // Sign Document

    // Creating Document

    function isValidCreationDocumentSignature(string memory _cid, string memory _secret, address _sender, bytes memory _signature)
    public view returns(bool) {
        bytes32 message = prefixed(keccak256(abi.encodePacked(_cid, _secret, _sender, uint(Action.Create), address(this))));
        
        return recoverSigner(message, _signature) == _sender;
    }

    // Creating Document

    // Signature Part

    function prefixed(bytes32 hash) internal pure returns (bytes32) {
        return keccak256(abi.encodePacked("\x19Ethereum Signed Message:\n32", hash));
    }

    function splitSignature(bytes memory _signature) internal pure returns(uint8 v, bytes32 r, bytes32 s) {
        require(_signature.length == 65);

        assembly {
            // first 32 bytes, after the length prefix.
            r := mload(add(_signature, 32))
            // second 32 bytes.
            s := mload(add(_signature, 64))
            // final byte (first byte of the next 32 bytes).
            v := byte(0, mload(add(_signature, 96)))
        }

        if (uint256(s) > 0x7FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF5D576E7357A4501DDFE92F46681B20A0) {
            revert("ECDSA: invalid signature 's' value");
        }

        if (v != 27 && v != 28) {
            revert("ECDSA: invalid signature 'v' value");
        }

        return (v, r, s);
    }

    function recoverSigner(bytes32 _message, bytes memory _signature) internal pure returns (address) {
        (uint8 v, bytes32 r, bytes32 s) = splitSignature(_signature);
        return ecrecover(_message, v, r, s);
    }

    // Signature Part
}