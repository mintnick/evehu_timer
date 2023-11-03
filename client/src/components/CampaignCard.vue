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
          <v-img :src="alliIcon" :alt="campaignData.alli_name" lazy-src style="background-color: black"></v-img>
        </v-col>
      </v-row>
      <v-row align-self="center" justify="center" class="text-h6 font-weight-bold text-red-lighten-2">{{ countdown }}</v-row>

      <v-progress-linear v-if="isActive" v-model="progress" color="amber-darken-3" height="30">
        <strong>进攻 {{ progress }}%</strong>
        <v-spacer></v-spacer>
        <strong>防守 {{ 100 - progress }}%</strong>
      </v-progress-linear>
    </v-card-text>
  </v-card>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps(["campaignData"]);

const isActive = computed(() => {
  const campTime = Date.parse(props['campaignData'].start_time);
  const current = new Date().getTime();
  if (campTime < current) return 'blink';
})

const progress = computed(() => {
  return props['campaignData'].attackers_score * 100;
})

const alliIcon = `https://image.evepc.163.com/Alliance/${props['campaignData'].defender_id}_128.png`;

const duration = ref(new Date(props['campaignData'].start_time).getTime() - new Date().getTime());
const startTimer = () => {
  if (duration.value > 0) {
    setTimeout(() => {
      duration.value -= 1000;
      startTimer();
    }, 1000)
  }
};
startTimer();
const countdown = computed(() => {
  let 
      seconds = Math.floor((duration.value / 1000) % 60),
      minutes = Math.floor((duration.value / (1000 * 60)) % 60),
      hours = Math.floor((duration.value / (1000 * 60 * 60)) % 24);

  hours = (hours < 10) ? hours : hours;
  minutes = (minutes < 10) ? minutes : minutes;
  seconds = (seconds < 10) ? seconds : seconds;

  return hours + "小时" + minutes + "分钟" + seconds + "秒";
})

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

@keyframes BLINK_ANIMATION {
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