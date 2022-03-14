const Campaign = artifacts.require('Campaign')

module.exports = (deployer, network, accounts) => {
  deployer.deploy(
    Campaign,
    'TestCampaign1',
    'http://test.org',
    1647270580,
    accounts[3],
    accounts[4],
    '10000000000000000000'
  )
}
