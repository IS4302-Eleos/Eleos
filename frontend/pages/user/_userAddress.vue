<template>
  <div>
    <!--Please replace me-->
    <section class="section container">
      <div class="container">
        <div class="card">
          <div class="hero is-success">
            <div class="hero-body">
              <figure class="image is-128x128">
                <img class="is-rounded" src="https://bulma.io/images/placeholders/128x128.png" alt="Placeholder image">
              </figure>
              <p class="subtitle mt-6">
                {{ $route.params.userAddress }}
              </p>
            </div>
          </div>
          <div class="card-content">
            <div class="media">
              <div class="media-content">
                <div class="level">
                  <div class="level-item has-text-centered">
                    <div>
                      <p class="heading">
                        Reputation
                      </p>
                      <p class="title">123</p>
                    </div>
                  </div>
                  <div class="level-item has-text-centered">
                    <div>
                      <p class="heading">
                        No. of Donations Made
                      </p>
                      <p class="title">123</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <b-tabs position="is-centered" class="block">
              <b-tab-item label="Donation Records">
                <div class="media">
                  <div class="media-left">
                    Donated to Campaign at <NuxtLink :to="`/campaign/${donor}`">
                      { 0xDEAD }
                    </NuxtLink>
                  </div>
                </div>
              </b-tab-item>

              <b-tab-item label="Benefitted Campaigns">
                <div class="media">
                  <div class="media-left">
                    Added as beneficiary to Campaign at {0x505}
                  </div>
                </div>
              </b-tab-item>
            </b-tabs>
          </div>
        </div>
      </div>
    </section>
    <!--end of me-->
  </div>
</template>

<script>
export default {
  name: 'UserPage',
  data () {
    return {
      title: 'Testing file name as dynamic route',
      validUserAddress: true
    }
  }
}
</script>
