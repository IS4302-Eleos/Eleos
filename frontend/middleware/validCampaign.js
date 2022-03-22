import Web3 from 'web3'

export default function ({ params, redirect, route, next }) {
  const campaign = !params.campaignAddress ? params.pathMatch : params.campaignAddress
  if (!campaign || !Web3.utils.isAddress(campaign) || !Web3.utils.checkAddressChecksum(campaign)) {
    return redirect('/')
  }

  if (!['campaign-campaignAddress-info', 'campaign-campaignAddress-edit'].includes(route.name)) {
    return redirect({ name: 'campaign-campaignAddress-info', params: { campaignAddress: campaign } })
  }
}
