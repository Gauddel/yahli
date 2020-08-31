pragma solidity 0.6.10;
pragma experimental ABIEncoderV2;

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

enum Action {
    Create,
    Approve,
    Sign,
    AccountCreation,
    AccountCreationAllow
}