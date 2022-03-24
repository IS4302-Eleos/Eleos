import { ethers } from 'ethers'

export default function ({ params, redirect, route, next }) {
  const campaign = !params.campaignAddress ? params.pathMatch : params.campaignAddress
  if (!campaign || !ethers.utils.isAddress(campaign)) {
    return redirect('/')
  }

  if (!['campaign-campaignAddress-info', 'campaign-campaignAddress-edit'].includes(route.name)) {
    return redirect({ name: 'campaign-campaignAddress-info', params: { campaignAddress: campaign } })
  }
}
