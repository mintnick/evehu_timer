<template>
  <!-- <span>{{ filteredCampaigns }}</span> -->
  <v-row
    class="d-flex mb-6"
  >
    <CampaignCard
      v-for="campaign in filteredCampaigns"
      :campaignData=campaign
    ></CampaignCard>
  </v-row>
</template>

<script>
import CampaignCard from './CampaignCard.vue'

export default {
  name: 'CampaignBoard',

  components: {CampaignCard},

  props: {
    filteredCampaigns: [],
  },
  
  data: () => ({
  }),
} 
</script>

<style>

</style>