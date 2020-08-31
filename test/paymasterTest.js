const Paymaster = artifacts.require("./Paymaster.sol");
const SignDocuProxyMock = artifacts.require("./SignDocuProxyMock.sol");
const ProxyForAccountCreation = artifacts.require("./ProxyForAccountCreation.sol");
const ProxyForApprovingAccountCreation = artifacts.require("./ProxyForApprovingAccountCreation.sol");
const ProxyForDocumentCreation = artifacts.require("./ProxyForDocumentCreation.sol");
const ProxyForDocumentSigning = artifacts.require("./ProxyForDocumentSigning.sol");
const ProxyForDocumentSignatureApproval = artifacts.require("./ProxyForDocumentSignatureApproval.sol");
const truffleAssert = require('truffle-assertions');

contract("Paymaster", accounts => {
    let paymaster = null;
    let proxy = null;
    before(async () => {
        proxy = await SignDocuProxyMock.new(accounts[0], accounts[1]);
        paymaster = await Paymaster.new(proxy.address);
    })
    
  it("balanceIsBiggerThanGasCost should return true", async () => {
    var balance = new web3.utils.BN(200);
    var gasPrice = new web3.utils.BN(3);
    var gasEstimate = new web3.utils.BN(50);

    assert.isTrue(await paymaster.balanceIsBiggerThanGasCost.call(balance, gasPrice, gasEstimate, {from : accounts[0]}));
  });

  it("convertAddressToBytes should convert address to bytes correctly", async () => {
    var expectedValue = web3.eth.abi.encodeParameters(['address'], [paymaster.address]);
    var actualValue = await paymaster.convertAddressToBytes.call(paymaster.address, {from : accounts[0]});

    assert.equal(actualValue, expectedValue, "The convertion of address to bytes didn't work.")
  });

  it("convertBytesToAddress should convert back bytes to address", async () => {
    var actualValue = await paymaster.convertBytesToAddress.call(web3.eth.abi.encodeParameters(['address'], [paymaster.address]));
    var expectedValue = paymaster.address;

    assert.isTrue(web3.utils.isAddress(actualValue), "Returned value is not an address");
    assert.equal(actualValue, expectedValue, "The conversion from bytes to address didn't work.");
  });
  
  it("String comparaison should work", async () => {
    var a = "test";
    var isEqual = await paymaster.stringComparaison.call(a, a, {from : accounts[0]});

    assert.isTrue(isEqual, "String comparaison failed. Should return true.")
  });

  it("String comparaison should not work", async () => {
    var a = "test";
    var b = "test1";
    var isFalse = await paymaster.stringComparaison.call(a, b, {from : accounts[0]});

    assert.isFalse(isFalse, "String comparaison failed. Should return false.")
  });

  it("Account Creation Approval : when the user have enough balance", async () => {
    var gasEstimate = 100;
    var gasPrice = await web3.eth.getGasPrice();
    await proxy.setBalanceMock(accounts[0], new web3.utils.BN((gasEstimate * gasPrice) + 1));
    var actualValue = await paymaster.accountCreationApproveCheck.call(accounts[0], new web3.utils.BN((gasEstimate)), {from : accounts[0], gasPrice : gasPrice});
    var expectedValue = web3.eth.abi.encodeParameters(['address'], [accounts[0]]);
    assert.equal(actualValue, expectedValue, "The balance should be enough.");
  });

  it("Account Creation Approval : when the user don't have enough balance", async () => {
    var gasEstimate = 10;
    var gasPrice = await web3.eth.getGasPrice();
    await proxy.setBalanceMock(accounts[0], new web3.utils.BN((gasEstimate * gasPrice) + 1));
    await truffleAssert.fails(
      paymaster.accountCreationApproveCheck.call(accounts[0], new web3.utils.BN(String(100)), {from : accounts[0], gasPrice : gasPrice}),
      truffleAssert.ErrorType.REVERT,
      ""
    );
  });
  it("Account Creation : when the user have enough balance and user have an account", async () => {
    var gasEstimate = 100;
    var gasPrice = await web3.eth.getGasPrice();
    await proxy.setBalanceMock(accounts[0], new web3.utils.BN((gasEstimate * gasPrice) + 1));
    await proxy.setAccounts(accounts[0], "MyAccount");
    await truffleAssert.fails(
      paymaster.accountCreationCheck.call(accounts[0], new web3.utils.BN(String(100)), {from : accounts[0], gasPrice : gasPrice}),
      truffleAssert.ErrorType.REVERT,
      "Action not allowed."
    );
  });

  it("Account Creation : when the user don't have enough balance and don't have account", async () => {
    var gasEstimate = 10;
    var gasPrice = await web3.eth.getGasPrice();
    await proxy.setBalanceMock(accounts[0], new web3.utils.BN((gasEstimate * gasPrice) + 1));
    await proxy.setAccounts(accounts[0], "");
    await truffleAssert.fails(
      paymaster.accountCreationCheck.call(accounts[0], new web3.utils.BN(String(100)), {from : accounts[0], gasPrice : gasPrice}),
      truffleAssert.ErrorType.REVERT,
      ""
    );
  });

  it("Account Creation : when the user have enough balance and don't have account", async () => {
    var gasEstimate = 100;
    var gasPrice = await web3.eth.getGasPrice();
    await proxy.setAccounts(accounts[0], "");
    await proxy.setBalanceMock(accounts[0], new web3.utils.BN((gasEstimate * gasPrice) + 1));
    var actualValue = await paymaster.accountCreationCheck.call(accounts[0], new web3.utils.BN((gasEstimate)), {from : accounts[0], gasPrice : gasPrice});
    var expectedValue = web3.eth.abi.encodeParameters(['address'], [accounts[0]]);
    assert.equal(actualValue, expectedValue, "The balance should be enough.");
  });

  it("Account Creation : when the user have zero balance and don't have account and don't have an allower", async () => {
    var gasEstimate = 100;
    var gasPrice = await web3.eth.getGasPrice();
    await proxy.setAccounts(accounts[0], "");
    await proxy.setBalanceMock(accounts[0], new web3.utils.BN(0));
    await truffleAssert.fails(
      paymaster.accountCreationCheck.call(accounts[0], new web3.utils.BN(String(100)), {from : accounts[0], gasPrice : gasPrice}),
      truffleAssert.ErrorType.REVERT,
      "Action not allowed."
    );
  });

  it("Account Creation : when the user zero balance balance and don't have account and have an allower with enough balance", async () => {
    var gasEstimate = 100;
    var gasPrice = await web3.eth.getGasPrice();
    await proxy.setAccounts(accounts[0], "");
    await proxy.setAllower(accounts[0], accounts[1]);
    await proxy.setBalanceMock(accounts[0], new web3.utils.BN(0));
    await proxy.setBalanceMock(accounts[1], new web3.utils.BN((gasEstimate * gasPrice) + 1));
    var actualValue = await paymaster.accountCreationCheck.call(accounts[0], new web3.utils.BN((gasEstimate)), {from : accounts[0], gasPrice : gasPrice});
    var expectedValue = web3.eth.abi.encodeParameters(['address'], [accounts[1]]);
    assert.equal(actualValue, expectedValue, "The balance should be enough.");
  });

  it("Account Creation : when the user have zero balance and don't have account and don't have an allower with enough balance", async () => {
    var gasEstimate = 100;
    var gasPrice = await web3.eth.getGasPrice();
    await proxy.setAccounts(accounts[0], "");
    await proxy.setAllower(accounts[0], accounts[1]);
    await proxy.setBalanceMock(accounts[0], new web3.utils.BN(0));
    await proxy.setBalanceMock(accounts[1], new web3.utils.BN((gasEstimate * gasPrice) - 1));
    await truffleAssert.fails(
      paymaster.accountCreationCheck.call(accounts[0], new web3.utils.BN(gasEstimate), {from : accounts[0], gasPrice : gasPrice}),
      truffleAssert.ErrorType.REVERT,
      "Allower didn't have enough gas."
    );
  });

  it("Document Creation : when the user have enough balance", async () => {
    var gasEstimate = 100;
    var gasPrice = await web3.eth.getGasPrice();
    await proxy.setBalanceMock(accounts[0], new web3.utils.BN((gasEstimate * gasPrice) + 1));
    var actualValue = await paymaster.documentCreationCheck.call("clkasjbeajevouhbveojb", accounts[0], new web3.utils.BN((gasEstimate)), {from : accounts[0], gasPrice : gasPrice});
    var expectedValue = web3.eth.abi.encodeParameters(['address'], [accounts[0]]);
    assert.equal(actualValue, expectedValue, "The balance should be enough.");
  });

  it("Document Creation : when the user don't have enough balance", async () => {
    var gasEstimate = 100;
    var gasPrice = await web3.eth.getGasPrice();
    await proxy.setBalanceMock(accounts[0], new web3.utils.BN((gasEstimate * gasPrice) - 1));
    await truffleAssert.fails(
      paymaster.documentCreationCheck.call("clkasjbeajevouhbveojb", accounts[0], new web3.utils.BN(gasEstimate), {from : accounts[0], gasPrice : gasPrice}),
      truffleAssert.ErrorType.REVERT,
      ""
    );
  });

  it("Document Creation : Document exist", async () => {
    var gasEstimate = 100;
    var gasPrice = await web3.eth.getGasPrice();
    await proxy.setBalanceMock(accounts[0], new web3.utils.BN((gasEstimate * gasPrice) + 1));
    await proxy.createDocument(accounts[0], "clkasjbeajevouhbveojb");
    await truffleAssert.fails(
      paymaster.documentCreationCheck.call("clkasjbeajevouhbveojb", accounts[0], new web3.utils.BN(gasEstimate), {from : accounts[0], gasPrice : gasPrice}),
      truffleAssert.ErrorType.REVERT,
      "Document already exist."
    );
  });

  it("Action on Document : when owner of the document don't have enough balance.", async () => {
    var gasEstimate = 100;
    var gasPrice = await web3.eth.getGasPrice();
    await proxy.setBalanceMock(accounts[0], new web3.utils.BN((gasEstimate * gasPrice) + 1));
    await proxy.createDocument(accounts[1], "clkasjbeajevouhbveojb");
    await truffleAssert.fails(
      paymaster.documentActionCheck.call("clkasjbeajevouhbveojb", new web3.utils.BN(gasEstimate), {from : accounts[0], gasPrice : gasPrice}),
      truffleAssert.ErrorType.REVERT,
      ""
    );
  });

  it("Action on Document : when owner of the document have enough balance.", async () => {
    var gasEstimate = 100;
    var gasPrice = await web3.eth.getGasPrice();
    await proxy.setBalanceMock(accounts[0], new web3.utils.BN((gasEstimate * gasPrice) + 1));
    await proxy.setBalanceMock(accounts[1], new web3.utils.BN((gasEstimate * gasPrice) + 1));
    await proxy.createDocument(accounts[1], "clkasjbeajevouhbveojb");
    var actualValue = await paymaster.documentActionCheck.call("clkasjbeajevouhbveojb", new web3.utils.BN(10), {from : accounts[0], gasPrice : gasPrice});
    var expectedValue = web3.eth.abi.encodeParameters(['address'], [accounts[1]]);
    assert.equal(actualValue, expectedValue, "The balance should be enough.");
  });
});

contract("SignDocuBussiness", accounts => {
  let accountCreation = null;
  let approvalAccountCreation = null;
  let documentCreation = null;
  let documentSigning = null;
  let documentSigningApproval = null;
  before(async () => {
    accountCreation = await ProxyForAccountCreation.new();
    approvalAccountCreation = await ProxyForApprovingAccountCreation.new();
    documentCreation = await ProxyForDocumentCreation.new();
    documentSigning = await ProxyForDocumentSigning.new();
    documentSigningApproval = await ProxyForDocumentSignatureApproval.new();
  })
  it("Create Account : if account didn't exist for this user", async () => {
    var pubKey = "Ox12345678";
    await accountCreation.createAccountMock(accounts[0], pubKey);
    var actualpubKey = await accountCreation.accounts.call(accounts[0]);
    assert.equal(actualpubKey, pubKey, "Account creation didn't work.");
  })

  it("Create Account : if account did exist for this user", async () => {
    var pubKey = "Ox12345678";
    await truffleAssert.fails(
      accountCreation.createAccountMock(accounts[0], pubKey),
      truffleAssert.ErrorType.REVERT,
      "Account already exist."
    );
  })

  it("Allow Account Creation : when account exist and allowed account didn't exist", async () => {
    var pubKey = "Ox12345678";
    var sender = accounts[0];
    var allowedAccount = accounts[1];
    await approvalAccountCreation.createAccountMock(sender, pubKey);
    await approvalAccountCreation.allowAccountCreationMock(sender, allowedAccount);
    var actualSender = await approvalAccountCreation.allowedBy.call(allowedAccount, {from: accounts[0]});
    assert.equal(actualSender, sender, "Allower identity changed.");
  })

  it("Allow Account Creation : when account exist and allowed account did exist", async () => {
    var sender = accounts[0];
    var allowedAccount = accounts[1];
    var pubKey = "Ox123456789";
    await approvalAccountCreation.createAccountMock(allowedAccount, pubKey);
    await truffleAssert.fails(
      approvalAccountCreation.allowAccountCreationMock(sender, allowedAccount),
      truffleAssert.ErrorType.REVERT,
      "Account already exist."
    );
  })

  it("Allow Account Creation : when account didnt exist and allowed account didnt exist", async () => {
    var sender = accounts[0];
    var allowedAccount = accounts[1];
    await approvalAccountCreation.resetAccountMock(allowedAccount, "");
    await approvalAccountCreation.resetAccountMock(sender, "");
    await truffleAssert.fails(
      approvalAccountCreation.allowAccountCreationMock(sender, allowedAccount),
      truffleAssert.ErrorType.REVERT,
      "Account didn't exist."
    );
  })

  it("Document Creation : when document did exist and sender account exist.", async () => {
    var cid = "zb2rhe5P4gXftAwvA4eXQ5HJwsER2owDyS9sKaQRRVQPn93bA";
    var secret = "password";
    var sender = accounts[0];

    await documentCreation.resetAccountMock(sender, "");
    await truffleAssert.fails(
      documentCreation.createDocumentMock(cid, secret, sender),
      truffleAssert.ErrorType.REVERT,
      "Account didn't exist."
    );
  })

  it("Document Creation : when document didn't exist and sender account exist.", async () => {
    var cid = "zb2rhe5P4gXftAwvA4eXQ5HJwsER2owDyS9sKaQRRVQPn93bA";
    var secret = "password";
    var sender = accounts[0];
    var pubKey = "Ox12345678";

    await documentCreation.resetAccountMock(sender, "");
    await documentCreation.createAccountMock(accounts[0], pubKey);
    await documentCreation.createDocumentMock(cid, secret, sender);

    var document = await documentCreation.documents.call(cid);
    var isDocumentCreated = await documentCreation.documentsExist.call(cid);
    var acualSecret = await documentCreation.getDocumentSecret.call(cid,{from :sender});
    var actualCid = await documentCreation.creators.call(sender, 0);
    assert.equal(document.owner, sender, "Owner of the document is not correct.");
    assert.isTrue(isDocumentCreated, "Document should be created.");
    assert.equal(secret, acualSecret, "Secret not correspond for that we saved.");
    assert.equal(actualCid, cid, "Saved Cid not correct.");
    assert.equal(document.cid, cid, "Saved Cid not correct.");
    assert.equal(Number(document.state), 1, "State of the document not correct.");
  })

  it("Document Creation : when document did exist and sender account exist.", async () => {
    var cid = "zb2rhe5P4gXftAwvA4eXQ5HJwsER2owDyS9sKaQRRVQPn93bA";
    var secret = "password";
    var sender = accounts[0];
    var pubKey = "Ox12345678";

    await documentCreation.resetAccountMock(sender, "");
    await documentCreation.createAccountMock(accounts[0], pubKey);
    await truffleAssert.fails(
      documentCreation.createDocumentMock(cid, secret, sender),
      truffleAssert.ErrorType.REVERT,
      "Document already exist."
    );
  })

  it("Document Signing : when document didn't exist", async () => {
    var cid = "zb2rhe5P4gXftAwvA4eXQ5HJwsER2owDyS9sKaQRRVQPn93bA";
    var secret = "password";
    var sender = accounts[1];

    await truffleAssert.fails(
      documentSigning.signMock(cid, secret, sender),
      truffleAssert.ErrorType.REVERT,
      "Document didn't exist."
    );
  });

  it("Document Signing : State of the document is not Sign Pending", async () => {
    var cid = "zb2rhe5P4gXftAwvA4eXQ5HJwsER2owDyS9sKaQRRVQPn93bA";
    var secret = "password";
    var sender = accounts[1];

    await documentSigning.createDocumentMock(cid, secret, sender);
    await truffleAssert.fails(
      documentSigning.signMock(cid, secret, sender),
      truffleAssert.ErrorType.REVERT,
      "Document state isn't in Signing Pending State."
    );
  });

  it("Document Signing : Only Signee can sign the document.", async () => {
    var cid = "zb2rhe5P4gXftAwvA4eXQ5HJwsER2owDyS9sKaQRRVQPn93bA";
    var secret = "password";
    var sender = accounts[1];

    await documentSigning.setDocumentState(cid, new web3.utils.BN('2'));
    await documentSigning.setSignee(cid, sender);
    await truffleAssert.fails(
      documentSigning.signMock(cid, secret, accounts[0]),
      truffleAssert.ErrorType.REVERT,
      "Only the assign signee by the owner can sign the document."
    );
  });

  it("Document Signing : when document did exist and state is in Pending", async () => {
    var cid = "zb2rhe5P4gXftAwvA4eXQ5HJwsER2owDyS9sKaQRRVQPn93bA";
    var secret = "password";
    var sender = accounts[1];

    await documentSigning.signMock(cid, secret, sender);
    var document = await documentSigning.documents.call(cid);
    assert.equal(Number(document.state), 3, "State of the document not correct.");
  });

  it("Document Signing Approval : when document did not exist", async () => {
    var cid = "zb2rhe5P4gXftAwvA4eXQ5HJwsER2owDyS9sKaQRRVQPn93bA";
    var secret = "password";
    var sender = accounts[0];
    var signee = accounts[1];

    await truffleAssert.fails(
      documentSigningApproval.approveToSignMock(cid, sender, signee, secret),
      truffleAssert.ErrorType.REVERT,
      "Document didn't exist."
    );
  });

  it("Document Signing Approval : when document did exist but aomeone other than the owner call the function", async () => {
    var cid = "zb2rhe5P4gXftAwvA4eXQ5HJwsER2owDyS9sKaQRRVQPn93bA";
    var secret = "password";
    var sender = accounts[0];
    var signee = accounts[1];

    await documentSigningApproval.createDocumentMock(cid, secret, sender);
    await truffleAssert.fails(
      documentSigningApproval.approveToSignMock(cid, accounts[2], signee, secret),
      truffleAssert.ErrorType.REVERT,
      "Only the owner of the document can do this action."
    );
  });

  it("Document Signing Approval : when signee account didn't exist.", async () => {
    var cid = "zb2rhe5P4gXftAwvA4eXQ5HJwsER2owDyS9sKaQRRVQPn93bA";
    var secret = "password";
    var sender = accounts[0];
    var signee = accounts[1];

    await truffleAssert.fails(
      documentSigningApproval.approveToSignMock(cid, sender, signee, secret),
      truffleAssert.ErrorType.REVERT,
      "Account didn't exist."
    );
  });

  it("Document Signing Approval : when signee account didn't exist.", async () => {
    var cid = "zb2rhe5P4gXftAwvA4eXQ5HJwsER2owDyS9sKaQRRVQPn93bA";
    var secret = "password1";
    var sender = accounts[0];
    var signee = accounts[1];
    var signeePubKey = 'Ox12345678';

    await documentSigningApproval.createAccountMock(signee, signeePubKey);
    await documentSigningApproval.approveToSignMock(cid, sender, signee, secret);

    var document = await documentSigningApproval.documents.call(cid);
    var documentsBySignee = await documentSigningApproval.documentsBySignee.call(signee, 0);
    var acualSecret = await documentSigningApproval.getDocumentSecret.call(cid, {from : signee});

    assert.equal(document.newSignee, signee, "Signee has not been filled correctly.");
    assert.equal(acualSecret, secret, "Signee has not been filled correctly.");
    assert.equal(Number(document.state), 2, "State of the document should be in pending signing.");
    assert.equal(documentsBySignee, cid, "Document By Signee should have an element.");
  });

  it("Document Signing Approval : when document already signed.", async () => {
    var cid = "zb2rhe5P4gXftAwvA4eXQ5HJwsER2owDyS9sKaQRRVQPn93bA";
    var secret = "password";
    var sender = accounts[0];
    var signee = accounts[1];

    await truffleAssert.fails(
      documentSigningApproval.approveToSignMock(cid, sender, signee, secret),
      truffleAssert.ErrorType.REVERT,
      "Cannot ask for another signature if the last signee didn t sign the document."
    );
  });

  it("getOwnerOfDocument should return the owner of the document", async () => {
    var cid = "zb2rhe5P4gXftAwvA4eXQ5HJwsER2owDyS9sKaQRRVQPn93bA";
    var expectedOwner = accounts[0];

    var actualOwner = await documentSigningApproval.getOwnerOfDocument(cid);

    assert.equal(actualOwner, expectedOwner, "Not the correct owner.");
  });

  it("getDocumentState should return the state of the document", async () => {
    var cid = "zb2rhe5P4gXftAwvA4eXQ5HJwsER2owDyS9sKaQRRVQPn93bA";
    var extectedState = 2;

    var actualState = await documentSigningApproval.getDocumentState(cid);

    assert.equal(Number(actualState), extectedState, "Not the correct state.");
  });

  it("getDocumentSecret should return the secret of the user of the document", async () => {
    var cid = "zb2rhe5P4gXftAwvA4eXQ5HJwsER2owDyS9sKaQRRVQPn93bA";
    var expectedSecret = "password1";

    var actualSecret = await documentSigningApproval.getDocumentSecret(cid, {from : accounts[1]});

    assert.equal(actualSecret, expectedSecret, "Not the correct secret.");
  });

  it("getCreatedDocument should return the document", async () => {
    var expectedCid = "zb2rhe5P4gXftAwvA4eXQ5HJwsER2owDyS9sKaQRRVQPn93bA";

    var cids = await documentSigningApproval.getCreatedDocument({from : accounts[0]});
    var actualCid = cids[0];
    assert.equal(actualCid, expectedCid, "Not the correct cid.");
  });
})