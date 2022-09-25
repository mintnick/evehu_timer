<template>
  <v-row class="d-flex justify-center mb-5 px-5">
    <CampaignCard v-for="campaign in filteredCampaigns" :campaignData=campaign></CampaignCard>
  </v-row>
</template>

<script>
import CampaignCard from './CampaignCard.vue'

export default {
  name: 'CampaignBoard',

  components: { CampaignCard },

  props: {
    filteredCampaigns: Array,
  },
} 
</script>

<style>

</style>