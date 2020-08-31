pragma solidity 0.6.10;
pragma experimental ABIEncoderV2;

import "@opengsn/gsn/contracts/BaseRelayRecipient.sol";
import "@openzeppelin/contracts/math/SafeMath.sol";
import "./EnumAndStruct.sol";

contract SignDocuStorage is BaseRelayRecipient {

    using SafeMath for uint256;

    // Balances for Gas Station Network

    mapping(address => uint256) public balances;

    // Balances for Gas Station Network

    mapping(string => Document) public documents;
    mapping(string => bool) public documentsExist;
    mapping(address => string) public accounts;
    mapping(address => address) public allowedBy;

    mapping(address => string[]) public creators;
    mapping(address => string[])  public documentsBySignee;

    event Signature(string cid, address signee);
    event DocumentCreated(string cid, address creator);
    event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);

    mapping(string => uint256) public uint256Storage;
    mapping(string => int256) public int256Storage;
    mapping(string => bool) public boolStorage;
    mapping(string => address) public addressStorage;
    mapping(string => bytes) public bytesStorage;
    mapping(string => string) public stringStorage;

    function versionRecipient() external override view returns (string memory) {
        return '0.0.1';
    }
}