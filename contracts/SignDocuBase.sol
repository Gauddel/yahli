pragma solidity 0.6.10;
pragma experimental ABIEncoderV2;

import "./SignDocuStorage.sol";

contract SignDocuBase is SignDocuStorage {
    // Documents Accesseur

    function getOwnerOfDocument(string memory _cid) public view returns(address) {
        return documents[_cid].owner;
    }

    function getDocumentState(string memory _cid) public view returns(uint256) {
        return uint(documents[_cid].state);
    }

    function getDocumentSecret(string memory _cid) public view returns(string memory) {
        return documents[_cid].secrets[msg.sender];
    }

    function getCreatedDocument() public view returns(string[] memory) {
        return creators[msg.sender];
    }

    function getSigneeDocument() public view returns(string[] memory) {
        return documentsBySignee[msg.sender];
    }

    // Documents Accesseur
}