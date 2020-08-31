pragma solidity ^0.6.0;

contract Convert {
    function parse32BytesToUint256(bytes memory data) internal view returns(uint256 parsed) {
        assembly {parsed := mload(add(data, 32))}
    }

    function parse32BytesToAddress(bytes memory data) internal view returns(address parsed) {
        assembly {parsed := mload(add(data, 32))}
    }

    function parse32BytesToBool(bytes memory data) internal view returns(bool parsed) {
        assembly {parsed := mload(add(data, 32))}
    }

    function parse32BytesToBytes32(bytes memory data) internal view returns(bytes32 parsed) {
        assembly {parsed := mload(add(data, 32))}
    }
}