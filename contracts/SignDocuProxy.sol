pragma solidity 0.6.10;
pragma experimental ABIEncoderV2;

import "@opengsn/gsn/contracts/BaseRelayRecipient.sol";
import "./Proxy.sol";
import { SignDocuBase, State, Action } from "./SignDocuBase.sol";

contract SignDocuProxy is SignDocuBase, Proxy {

    address bussinessContract;

    constructor(address _forwarder, address _bussinessContract) public {
        trustedForwarder = _forwarder;

        address msgSender = _msgSender();
        addressStorage['Owner'] = msgSender;

        bussinessContract = _bussinessContract;

        emit OwnershipTransferred(address(0), msgSender);
    }

    function _implementation() internal override view returns(address) {
        return bussinessContract;
    }

    function upgrade(address _bussinessContract) public onlyOwner {
        bussinessContract = _bussinessContract;
    }

    // to delete after validation.
    function getSender() public view returns(address) {
        return _msgSender();
    }

    modifier onlyOwner() {
        require(addressStorage['Owner'] == _msgSender(), "Ownable: caller is not the owner");
        _;
    }
}