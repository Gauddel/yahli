var SignDocuTest = artifacts.require("./SignDocuTest.sol");

module.exports = function(deployer) {
  deployer.deploy(SignDocuTest, '0xcC87aa60a6457D9606995C4E7E9c38A2b627Da88');
};