pragma solidity 0.6.10;
pragma experimental ABIEncoderV2;

import "@opengsn/gsn/contracts/BaseRelayRecipient.sol";
import "@openzeppelin/contracts/math/SafeMath.sol";
import { SignDocuBase, State, Document, Action } from "./SignDocuBase.sol";

contract SignDocuBussiness is SignDocuBase {

    using SafeMath for uint256;

    function createAccount(address _sender, string calldata _accountPubKey, bytes calldata _signature) external {
        require(isValidAccountCreation(_sender, _accountPubKey, _signature), 'Signature is not valid.');

        createAccount(_sender, _accountPubKey);
    }

    function createAccount(address _sender, string memory _accountPubKey) internal isAccountDontExist(_sender) {
        accounts[_sender] = _accountPubKey;
    }

    function allowAccountCreation(address _sender, address _allowedAccount, bytes calldata _signature) external {
        require(isValidAllowAccountCreation(_sender, _allowedAccount, _signature), 'Signature is not valid.');

        allowAccountCreation(_sender, _allowedAccount);
    }

    function allowAccountCreation(address _sender, address _allowedAccount) internal isAccountExist(_sender) isAccountDontExist(_allowedAccount) {
        allowedBy[_allowedAccount] = _sender;
    }

    function createDocument(string calldata _cid, string calldata _secret, address _sender, bytes calldata _signature) external {
        require(isValidCreationDocumentSignature(_cid, _secret, _sender, _signature), 'Signature is not valid.');

        createDocument(_cid, _secret, _sender);
    }

    function createDocument(string memory _cid, string memory _secret, address _sender) internal documentDontExist(_cid) isAccountExist(_sender) {
        documents[_cid] = Document({cid : _cid, owner : _sender, newSignee : address(0x00), state : State.Created});
        documents[_cid].secrets[_sender] = _secret;
        documentsExist[_cid] = true;
        creators[_sender].push(_cid);

        emit DocumentCreated(_cid, _sender);
    }

    function sign(string calldata _cid, string calldata _secret, address _sender, bytes calldata _signature) external {
        require(isValidSignSignature(_cid, _secret, _sender, _signature), 'Signature is not valid.');

        sign(_cid, _secret, _sender);
    }

    function sign(string memory _cid, string memory _secret, address _sender) internal documentExist(_cid) {
        Document storage document = documents[_cid];
        
        require(document.state == State.SignPending, "Document state isn't in Signing Pending State.");
        require(document.newSignee == _sender, "Only the assign signee by the owner can sign the document.");

        document.state = State.Signed;
    }

    function approveToSign(string calldata _cid, address _sender, address _newSignee, string calldata _secret, bytes calldata _signature) external {
        require(isValidApproveSignature(_cid, _sender, _newSignee, _secret, _signature), 'Signature is not valid.');
        
        approveToSign(_cid, _sender, _newSignee, _secret);
    }

    function approveToSign(string memory _cid, address _sender, address _newSignee, string memory _secret) internal  documentExist(_cid) onlyDocumentOwner(_cid, _sender) isAccountExist(_newSignee) {
        Document storage document = documents[_cid];

        require(document.state != State.SignPending, 'Cannot ask for another signature if the last signee didn t sign the document.');

        document.newSignee = _newSignee;
        document.secrets[_newSignee] = _secret;
        document.state = State.SignPending;
        documentsBySignee[_newSignee].push(_cid);
    }

    // Allow Account Creation

    function isValidAllowAccountCreation(address _sender, address _allowedAccount, bytes memory _signature) internal view returns(bool) {
        bytes32 message = prefixed(keccak256(abi.encodePacked(_sender, _allowedAccount, uint(Action.AccountCreationAllow), address(this))));
        
        return recoverSigner(message, _signature) == _sender;
    }

    // Allow Account Creation

    // Create Account

    function isValidAccountCreation(address _sender, string memory _accountPubKey, bytes memory _signature) internal view returns(bool) {
        bytes32 message = prefixed(keccak256(abi.encodePacked(_sender, _accountPubKey, uint(Action.AccountCreation), address(this))));
        
        return recoverSigner(message, _signature) == _sender;
    }

    // Create Account

    // Approve for signing

    function isValidApproveSignature(string memory _cid, address _sender, address _newSignee, string memory _secret, bytes memory _signature)
    internal view returns(bool) {
        bytes32 message = prefixed(keccak256(abi.encodePacked(_cid, _sender, _newSignee, _secret, uint(Action.Approve), address(this))));
        
        return recoverSigner(message, _signature) == _sender;
    }

    // Approve for signing

    // Sign Document

    function isValidSignSignature(string memory _cid, string memory _secret, address _sender, bytes memory _signature)
    internal view returns(bool) {
        bytes32 message = prefixed(keccak256(abi.encodePacked(_cid, _secret, _sender, uint(Action.Sign), address(this))));
        
        return recoverSigner(message, _signature) == _sender;
    }

    // Sign Document

    // Creating Document

    function isValidCreationDocumentSignature(string memory _cid, string memory _secret, address _sender, bytes memory _signature)
    internal view returns(bool) {
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

    function sendPayement() public payable {
        balances[_msgSender()] = balances[_msgSender()] + msg.value;
    }

    function setPaymaster(address _paymaster) public onlyOwner() {
        addressStorage['Paymaster'] = _paymaster;
    }

    function getFeeByPaymaster(uint256 _fee, address _accountPayingFees) public onlyPaymaster() {
        balances[_accountPayingFees] = balances[_accountPayingFees] - _fee;
        payable(addressStorage['Paymaster']).transfer(_fee);
    }

    // Gas Station

    // Modifier

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

    modifier onlyOwner() {
        require(addressStorage['Owner'] == _msgSender(), "Ownable: caller is not the owner");
        _;
    }

    modifier onlyPaymaster() {
        require(addressStorage['Paymaster'] == _msgSender(), "");
        _;
    }

    // Modifier
}
