<template>
  <v-card class="mx-2 mb-2" width="300" height="170" elevation="5">
    <v-card-text>
      <p class="font-weight-black text-h6 text-center">{{ campaignData.region_name }}</p>
      <v-row>
        <v-col cols="8">
          <div class="text-h6 card-title" :class="isActive">
            {{ campaignData.system_name + ' ' + campaignData.event_type}}
          </div>
          <div class="text-subtitle-1 font-weight-medium">{{ campaignData.local_date + ' ' + campaignData.local_time }}</div>
          <div class="alli-name font-weight-black">{{ campaignData.alli_name }}</div>
        </v-col>
        <v-col cols="4">
          <v-img :src="alliIcon"></v-img>
        </v-col>
      </v-row>

      <v-progress-linear v-if="isActive" v-model="progress" color="amber" height="30">
        <strong>进攻 {{ progress }}%</strong>
        <v-spacer></v-spacer>
        <strong>防守 {{ 100 - progress }}%</strong>
      </v-progress-linear>
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  name: 'CampaignCard',

  props: {
    campaignData: {},
  },

  computed: {
    isActive() {
      const campTime = Date.parse(this.campaignData.start_time);
      const current = new Date().getTime();
      if (campTime < current) return 'blink';
    },

    alliIcon() {
      return 'https://image.evepc.163.com/Alliance/' + this.campaignData.defender_id + '_128.png'
    },

    progress() {
      return this.campaignData.attackers_score * 100;
    }
  }
}
</script>

<style>
.alli-name {
  overflow: hidden;
  white-space: nowrap;
}

.blink {
  -webkit-animation: BLINK_ANIMATION 2s infinite;
  /* Safari 4+ */
  -moz-animation: BLINK_ANIMATION 2s infinite;
  /* Fx 5+ */
  -o-animation: BLINK_ANIMATION 2s infinite;
  /* Opera 12+ */
  animation: BLINK_ANIMATION 2s infinite;
  /* IE 10+, Fx 29+ */
}

@-webkit-keyframes BLINK_ANIMATION {
  0% {
    background-color: rgba(22, 160, 133, 0.1);
  }

  50% {
    background-color: rgba(22, 160, 133, 0.7)
  }

  100% {
    background-color: rgba(22, 160, 133, 0.1);
  }
}
</style>