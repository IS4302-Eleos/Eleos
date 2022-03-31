import { shallowMount } from '@vue/test-utils'
import CampaignCard from '@/components/CampaignCard.vue'

describe('CampaignCard', () => {
  test('is a Vue instance', () => {
    const wrapper = shallowMount(CampaignCard, {
      props: {
        address: '0x17ee2FbBA2C47657Bd11d5378a26aaD1e1A0eaA4',
        title: 'Testing'
      },
      mocks: {
        $store: {
          state: {
            isConnected: false
          }
        },
        $wallet: {
          provider: null
        }
      },
      stubs: ['nuxt-link', 'b-skeleton']
    })
    expect(wrapper.vm).toBeTruthy()
  })
})
