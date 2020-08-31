pragma solidity 0.6.10;
pragma experimental ABIEncoderV2;

import "@opengsn/gsn/contracts/BasePaymaster.sol";
import { SignDocuProxy as SignDocu } from "./SignDocuProxy.sol";
import "@openzeppelin/contracts/math/SafeMath.sol";
import "@opengsn/gsn/contracts/interfaces/IRelayHub.sol";

contract Paymaster is BasePaymaster {

    using SafeMath for uint256;

    SignDocu signDocuContract;

    constructor(address _signDocuProxy, address _relayHub) public {
        signDocuContract =  SignDocu(payable(_signDocuProxy));
        setRelayHub(IRelayHub(_relayHub));
    }

    function preRelayedCall(
        GsnTypes.RelayRequest calldata relayRequest,
        bytes calldata signature,
        bytes calldata approvalData,
        uint256 maxPossibleGas
    ) external override virtual
    returns (bytes memory context, bool rejectOnRecipientRevert) {
        return canRelay(approvalData);
    }

    function canRelay(bytes calldata approvalData) public returns (bytes memory context, bool rejectOnRecipientRevert) {
        (string memory cid, address transactionSender, uint256 gasEstimate, uint256 action) = abi.decode(approvalData, (string, address, uint256, uint256));

        if (action == 3) { // Account Creation
            return accountCreationCheck(transactionSender, gasEstimate);
        }

        if (action == 0) { // Document Creation
            return documentCreationCheck(cid, transactionSender, gasEstimate);
        }

        if(action == 1 || action == 2) { // Document Approve
            return documentActionCheck(cid, gasEstimate);
        }

        if (action == 4) { // Approve Account Creation
            return accountCreationApproveCheck(transactionSender, gasEstimate);
        }
    }

    function accountCreationApproveCheck(address _sender, uint256 _gasEstimate) public view returns(bytes memory context, bool rejectOnRecipientRevert) {
        uint256 senderBalance = signDocuContract.balances(_sender);
        rejectOnRecipientRevert = true;

        require(balanceIsBiggerThanGasCost(senderBalance, tx.gasprice, _gasEstimate));
        context = convertAddressToBytes(_sender);
    }

    function accountCreationCheck(address _sender, uint256 _gasEstimate) public view returns(bytes memory context, bool rejectOnRecipientRevert) {
        bool accountsDontExist = stringComparaison(signDocuContract.accounts(_sender), '');
        uint256 senderBalance = signDocuContract.balances(_sender);
        rejectOnRecipientRevert = true;
        if (accountsDontExist) {
                if(senderBalance == 0) {
                    address allower = signDocuContract.allowedBy(_sender);
                    if (allower != address(0x0)) {
                        uint256 allowerBalance = signDocuContract.balances(allower);
                        require(balanceIsBiggerThanGasCost(allowerBalance, tx.gasprice, _gasEstimate), "Allower didn't have enough gas.");
                        context = convertAddressToBytes(allower);
                        return(context, rejectOnRecipientRevert);
                    }
                    revert('Action not allowed.');
                }
                require(balanceIsBiggerThanGasCost(senderBalance, tx.gasprice, _gasEstimate));
                context = convertAddressToBytes(_sender);
                return(context, rejectOnRecipientRevert);
        }
        revert('Action not allowed.');
    }

    function documentCreationCheck(string memory _cid, address _sender, uint256 _gasEstimate) public view returns(bytes memory context, bool rejectOnRecipientRevert) {
        bool documentExist = signDocuContract.documentsExist(_cid);
        uint256 senderBalance = signDocuContract.balances(_sender);
        rejectOnRecipientRevert = true;

        if (!documentExist) {
            require(balanceIsBiggerThanGasCost(senderBalance, tx.gasprice, _gasEstimate));
            context = convertAddressToBytes(_sender);
            return(context, rejectOnRecipientRevert);
        }
        revert("Document already exist.");
    }

    function documentActionCheck(string memory _cid, uint256 _gasEstimate) public view returns(bytes memory context, bool rejectOnRecipientRevert) {
        address owner = signDocuContract.getOwnerOfDocument(_cid);
        uint256 ownerBalance = signDocuContract.balances(owner);
        rejectOnRecipientRevert = true;

        require(balanceIsBiggerThanGasCost(ownerBalance, tx.gasprice, _gasEstimate));
        context = convertAddressToBytes(owner);
    }

    function postRelayedCall(
        bytes calldata context,
        bool success,
        uint256 gasUseWithoutPost,
        GsnTypes.RelayData calldata relayData
    ) external override virtual {
        address(signDocuContract).call(abi.encodeWithSignature('getFeeByPaymaster(uint256,address)', gasUseWithoutPost.mul(tx.gasprice), convertBytesToAddress(context)));
    }

    // Utils

    function balanceIsBiggerThanGasCost(uint256 _balance, uint256 _gasPrice, uint256 _gasEstimate) public view returns(bool) {
        return _balance >= _gasPrice * _gasEstimate;
    }

    function convertAddressToBytes(address _accountToPayFees) public pure returns(bytes memory) {
        return abi.encode(_accountToPayFees);
    }

    function convertBytesToAddress(bytes memory data) public view returns(address accountPayingFees) {
        return abi.decode(data, (address));
    }

    function stringComparaison(string memory _a, string memory _b) public view returns(bool) {
        if(bytes(_a).length != bytes(_b).length) {
            return false;
        } else {
            return keccak256(abi.encodePacked(_a)) == keccak256(abi.encodePacked(_b));
        }
    }

    // Utils

    function versionPaymaster() external override view returns (string memory) {
        return "0.0.1";
    }
}