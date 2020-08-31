pragma solidity ^0.6.0;

import { SignDocuStorage, State, Document, Action } from "./../SignDocuStorage.sol";

contract SignDocuProxyMock is SignDocuStorage {
    
    function getOwnerOfDocument(string memory _cid) public view returns(address) {
        return documents[_cid].owner;
    }

    function setBalanceMock(address _user, uint256 _amount) public {
        balances[_user] = _amount;
    }

    function setAccounts(address _user, string memory _accountId) public {
        accounts[_user] = _accountId;
    }

    function setAllower(address _client, address _allower) public {
        allowedBy[_client] = _allower;
    }

    function createDocument(address _owner, string memory _cid) public {
        documents[_cid] = Document({cid : _cid, owner : _owner, newSignee : address(0x00), state : State.Created});
        documentsExist[_cid] = true;
        creators[_owner].push(_cid);
    }
}