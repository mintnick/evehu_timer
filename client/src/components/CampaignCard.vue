<template>
  <!-- <span>{{campaignData}}</span> -->
  <v-card class="mx-3 mb-3" width="300" height="150">
    <v-card-text class="row">
      <v-row>
        <v-col cols="8">
          <div class="text-h5 card-title" :class="isActive">
            {{ campaignData.system_name + ' ' + campaignData.event_type}}
          </div>
          <div class="text-h6">{{ campaignData.local_date + ' ' + campaignData.local_time }}</div>
          <div class="alli-name">{{ campaignData.alli_name }}</div>
        </v-col>
        <v-col cols="4">
          <v-img :src="alliIcon"></v-img>
        </v-col>
      </v-row>

      <v-progress-linear v-model="progress" color="amber" height="30">
        <strong>进攻方进度 {{ progress }}%</strong>
      </v-progress-linear>
    </v-card-text>
    <!-- <v-list-item three-line>
      <v-list-item-content>
        <div class="text-h5 mb-2">
          {{ campaignData.system_name + ' ' + campaignData.event_type}}
        </div>
      </v-list-item-content>
      <v-list-item-title class="text-h5">
        {{ campaignData.alli_name }}
      </v-list-item-title>
      <v-list-item-content>
        {{ campaignData.attackers_score }}
      </v-list-item-content>

      <v-list-item-avatar
        tile
        size="128"
      >
        <v-img :src="alliIcon"></v-img>
      </v-list-item-avatar>
    </v-list-item> -->
  </v-card>
</template>

<script>
export default {
  name: 'CampaignCard',

  components: {},

  props: {
    campaignData: {},
  },

  data: () => ({
  }),

  computed: {
    isActive() {
      const campTime = Date.parse(this.campaignData.start_time);
      const current = new Date().getTime();
      if (campTime < current) return 'blink';
    },

    // 'https://image.evepc.163.com/Alliance/' + id + '_128.png
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
  -webkit-animation: BLINK_ANIMATION 1s infinite;
  /* Safari 4+ */
  -moz-animation: BLINK_ANIMATION 1s infinite;
  /* Fx 5+ */
  -o-animation: BLINK_ANIMATION 1s infinite;
  /* Opera 12+ */
  animation: BLINK_ANIMATION 1s infinite;
  /* IE 10+, Fx 29+ */
}

@-webkit-keyframes BLINK_ANIMATION {
  0% {
    background-color: rgba(255, 0, 0, 0.1);
  }

  50% {
    background-color: rgba(255, 0, 0, 0.2)
  }

  100% {
    background-color: rgba(255, 0, 0, 0.1);
  }
}
</style>