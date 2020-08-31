pragma solidity ^0.6.2;
pragma experimental ABIEncoderV2;

import "@opengsn/gsn/contracts/BaseRelayRecipient.sol";
import "@openzeppelin/contracts/math/SafeMath.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

enum State {
    None,
    Created,
    SignPending,
    Signed
}

struct Document {
    string cid;
    address owner;
    address newSignee;
    State state;
    mapping(address => string) secrets;
}

contract SignDocuTest is BaseRelayRecipient {

    using SafeMath for uint256;

    enum Action {
        Create,
        Approve,
        Sign,
        AccountCreation
    }

    // Ownable

    address private _owner;
    address private  paymaster;

    // Ownable

    // Balances for Gas station network

    mapping(address => uint256) balances;

    // Balances for Gas station network

    mapping(string => Document) public documents;
    mapping(string => bool) documentsExist;
    mapping(address => string) public accounts; // need to encrypt the secret with the counterparty dapp pubKey

    mapping(address => string[]) creators;
    mapping(address => string[]) documentsBySignee;

    event Signature(string cid, address signee);
    event DocumentCreated(string cid, address creator);

    event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);

    constructor(address _forwarder) public {
        trustedForwarder = _forwarder;

        // Ownable
        address msgSender = _msgSender();
        _owner = msgSender;
        emit OwnershipTransferred(address(0), msgSender);
    }

    function documentIsSigned(string memory _cid, address _signee) public view returns(bool) {
        return documents[_cid].state == State.Signed;
    }

    function createAccount(address _sender, string memory _accountPubKey, bytes memory _signature) public isAccountDontExist(_sender) {
        require(isValidAccountCreation(_sender, _accountPubKey, _signature), 'Signature is not valid.');

        accounts[_sender] = _accountPubKey;
    }

    function createDocument(string memory _cid, string memory _secret, address _sender, bytes memory _signature) public documentDontExist(_cid) isAccountExist(_sender) {
        require(isValidCreationDocumentSignature(_cid, _secret, _sender, _signature), 'Signature is not valid.');

        documents[_cid] = Document({cid : _cid, owner : _sender, newSignee : address(0x00), state : State.Created});
        documents[_cid].secrets[_sender] = _secret;
        documentsExist[_cid] = true;
        creators[_sender].push(_cid);

        emit DocumentCreated(_cid, _sender);
    }

    function sign(string memory _cid, string memory _secret, address _sender, bytes memory _signature) public documentExist(_cid) {
        require(isValidSignSignature(_cid, _secret, _sender, _signature), 'Signature is not valid.');

        Document storage document = documents[_cid];
        
        require(document.newSignee == _sender, "Only the assign signee by the owner can sign the document.");

        document.state = State.Signed;
    }

    function approveToSign(string memory _cid, address _sender, address _newSignee, string memory _secret, bytes memory _signature) public documentExist(_cid) onlyDocumentOwner(_cid, _sender) isAccountExist(_newSignee) {
        require(isValidApproveSignature(_cid, _sender, _newSignee, _secret, _signature), 'Signature is not valid.');
        
        Document storage document = documents[_cid];

        require(document.state != State.SignPending, 'Cannot ask for another signature if the last signee didn t sign the document.');

        document.newSignee = _newSignee;
        document.secrets[_newSignee] = _secret;
        document.state = State.SignPending;
        documentsBySignee[_newSignee].push(_cid);
    }

    function getCreatedDocument() public view returns(string[] memory) {
        return creators[msg.sender];
    }

    function getDocuments() public view returns(string[] memory) {
        return documentsBySignee[msg.sender];
    }

    function getSigneeSecret(string memory _cid) public view returns(string memory) {
        return documents[_cid].secrets[msg.sender];
    }

    function getDocumentOwner(string memory _cid) public view returns(address) {
        return documents[_cid].owner;
    }

    function transferOwnership(string memory _cid, address _sender, address _newOwner) public view onlyDocumentOwner(_cid, _sender) {
        Document memory document = documents[_cid];
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

    modifier onlyDocumentOwner(string memory _cid, address _sender) {
        require(documents[_cid].owner == _sender, "Only the owner of the document can do this action.");
        _;
    }

    modifier isAccountExist(address _sender) {
        require(keccak256(abi.encodePacked(accounts[_sender])) != keccak256(abi.encodePacked("")), "Account didn't exist.");
        _;
    }

    modifier isAccountDontExist(address _sender) {
        require(keccak256(abi.encodePacked(accounts[_sender])) == keccak256(abi.encodePacked("")), "Account already exist.");
        _;
    }

    // Create Account

    function isValidAccountCreation(address _sender, string memory _accountPubKey, bytes memory _signature) public view returns(bool) {
        bytes32 message = prefixed(keccak256(abi.encodePacked(_sender, _accountPubKey, uint(Action.AccountCreation), address(this))));
        
        return recoverSigner(message, _signature) == _sender;
    }

    // Create Account

    // Approve for signing

    function isValidApproveSignature(string memory _cid, address _sender, address _newSignee, string memory _secret, bytes memory _signature)
    public view returns(bool) {
        bytes32 message = prefixed(keccak256(abi.encodePacked(_cid, _sender, _newSignee, _secret, uint(Action.Approve), address(this))));
        
        return recoverSigner(message, _signature) == _sender;
    }

    // Approve for signing

    // Sign Document

    function isValidSignSignature(string memory _cid, string memory _secret, address _sender, bytes memory _signature)
    public view returns(bool) {
        bytes32 message = prefixed(keccak256(abi.encodePacked(_cid, _secret, _sender, uint(Action.Sign), address(this))));
        
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

    // Gas Station 

    function getBalance(address _account) public view returns(uint256) {
        return balances[_account];
    }

    function sendPayement() public payable {
        balances[msg.sender] = balances[msg.sender] + msg.value;
    }

    function transactionWillExecute(string memory _cid, uint256 _gasEstimate, uint256 _gasPrice) public view returns(bool) {
        return balances[getDocumentOwner(_cid)] > _gasPrice.mul(_gasEstimate);
    }

    function setPaymaster(address _paymaster) public onlyOwner() {
        paymaster = _paymaster;
    }

    function getFeeByPaymaster(uint256 _fee) public onlyPaymaster() {
        msg.sender.transfer(_fee);
    }

    modifier onlyPaymaster() {
        require(paymaster == msg.sender, "");
        _;
    }

    // Gas Station

    // Ownable

    /**
     * @dev Returns the address of the current owner.
     */
    function owner() public view returns (address) {
        return _owner;
    }

    /**
     * @dev Throws if called by any account other than the owner.
     */
    modifier onlyOwner() {
        require(_owner == _msgSender(), "Ownable: caller is not the owner");
        _;
    }

    /**
     * @dev Leaves the contract without owner. It will not be possible to call
     * `onlyOwner` functions anymore. Can only be called by the current owner.
     *
     * NOTE: Renouncing ownership will leave the contract without an owner,
     * thereby removing any functionality that is only available to the owner.
     */
    function renounceOwnership() public virtual onlyOwner {
        emit OwnershipTransferred(_owner, address(0));
        _owner = address(0);
    }

    /**
     * @dev Transfers ownership of the contract to a new account (`newOwner`).
     * Can only be called by the current owner.
     */
    function transferOwnership(address newOwner) public virtual onlyOwner {
        require(newOwner != address(0), "Ownable: new owner is the zero address");
        emit OwnershipTransferred(_owner, newOwner);
        _owner = newOwner;
    }

    function _msgData() internal view virtual returns (bytes memory) {
        this; // silence state mutability warning without generating bytecode - see https://github.com/ethereum/solidity/issues/2691
        return msg.data;
    }

    // Ownable
}