pragma solidity 0.6.2;
pragma experimental ABIEncoderV2;

struct Document {
    string cid;
    address owner;
    address[] oldsSignees;
    address newSignee;
}

contract SignDocu {

    mapping(string => Document) documents;
    mapping(string => bool) documentsExist;

    event Signature(string cid, address signee);

    constructor() public {
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

    function sign(string memory _cid) public documentExist(_cid) {
        Document storage document = documents[_cid];
        
        require(document.newSignee == msg.sender, "Only the assign signee by the owner can sign the document.");

        document.oldsSignees.push(msg.sender);
    }

    function approveToSign(string memory _cid, address _newSignee) public documentExist(_cid) onlyOwner(_cid){
        Document storage document = documents[_cid];
        document.newSignee = _newSignee;
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

    modifier onlyOwner(string memory _cid) {
        require(documents[_cid].owner == msg.sender, "Only the owner of the document can transfer ownership.");
        _;
    }
}