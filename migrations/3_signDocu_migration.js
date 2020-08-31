var SignDocuBussiness = artifacts.require("./SignDocuBussiness.sol");
var SignDocuProxy = artifacts.require("./SignDocuProxy.sol"); //Paymaster
var Paymaster = artifacts.require("./Paymaster.sol");

module.exports = async function(deployer) {
  await deployer.deploy(SignDocuBussiness);
  await deployer.deploy(SignDocuProxy, '0x663946D7Ea17FEd07BF1420559F9FB73d85B5B03', SignDocuBussiness.address);
  await deployer.deploy(Paymaster, SignDocuProxy.address, '0xcfcb6017e8ac4a063504b9d31b4AbD618565a276');
};