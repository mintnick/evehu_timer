<template>
  <v-app>
    <v-app-bar density="compact">
      <v-app-bar-title>晨曦增强表</v-app-bar-title>
      <div class="d-none d-md-flex">
        <span class="font-weight-bold mr-4">{{ campaigns.length }}个领地争夺中</span>
        <span class="mr-4 text-purple-lighten-2">晨曦时间 {{ new Date().toLocaleString("zh-CN", {dateStyle: "long", timeStyle: "medium"}) }}</span>
        <span class="text-green-lighten-2">宁静时间 {{ new Date().toLocaleString("zh-CN", {timeZone: "UTC", dateStyle: "long", timeStyle: "medium"}) }}</span>
      </div>
      <v-spacer class="d-none d-sm-flex"></v-spacer>

      <v-btn icon href="https://github.com/mintnick/evehu_timer" target="_blank">
        <v-icon>mdi-github</v-icon>
      </v-btn>
      <v-btn icon @click="toggleTheme">
        <v-icon>mdi-brightness-6</v-icon>
      </v-btn>

    </v-app-bar>

    <v-main>
      <v-row>
        <v-col>
          <v-card-text>
            <h2 class="text-h5">
              星域
            </h2>
            <v-chip-group v-model="selectedRegions" column multiple>
              <v-chip v-for="region in getRegions" filter outlined label size="large">
                {{ region }}
              </v-chip>
            </v-chip-group>
          </v-card-text>
        </v-col>

        <v-col>
          <v-card-text>
            <h2 class="text-h5">
              联盟
            </h2>
            <v-chip-group v-model="selectedAlliances" column multiple>
              <v-chip v-for="alliance in getAlliances" filter outlined label size="large">
                {{ alliance }}
              </v-chip>
            </v-chip-group>
          </v-card-text>
        </v-col>
      </v-row>
      <CampaignBoard :filteredCampaigns="getFilteredCampaigns"></CampaignBoard>
    </v-main>
  </v-app>
</template>

<script setup>
import { ref, computed } from 'vue';
import Filter from './components/Filter.vue';
import CampaignBoard from './components/CampaignBoard.vue';
import { useTheme } from 'vuetify/lib/framework.mjs';

const campaigns = ref([]), selectedAlliances = ref([]), selectedRegions = ref([]);

// Theme
const theme = useTheme();
const toggleTheme = () => {
  theme.global.name.value = theme.global.current.value.dark ? 'light' : 'dark';
  document.cookie = "theme=" + theme.global.name.value;
};
let themeString = document.cookie
  .split("; ")
  .find((row) => row.startsWith("theme="))
  ?.split("=")[1];
if (themeString) theme.global.name.value = themeString;

// API URL
let apiUrl = ''; 
if (import.meta.env.DEV) apiUrl = 'http://localhost:3001/api/campaigns'
else apiUrl = '/api/campaigns'

// computed vars
const getRegions = computed(() => {
  if (!campaigns) return;
  let regions = new Set();
  campaigns.value.map(record => regions.add(record.region_name));
  regions = Array.from(regions);
  return regions;
});

const getAlliances = computed(() => {
  if (!campaigns.value) return;
  let allis = new Set();
  campaigns.value.map(record => allis.add(record.alli_name));
  allis = Array.from(allis);
  return allis;
});

const getFilteredCampaigns = computed(() => {
  if (selectedRegions.value.length == 0 && selectedAlliances.value.length == 0) return campaigns.value;

  let filteredCampaigns = [];
  console.log(selectedAlliances.value);
  for (const campaign of campaigns.value) {
    for (const a of selectedAlliances.value) {
      if (campaign.alli_name == getAlliances.value.at(a)) filteredCampaigns.push(campaign);
    }
    for (const r of selectedRegions.value) {
      if (campaign.region_name == getRegions.value.at(r)) filteredCampaigns.push(campaign);
    }
  }

  return filteredCampaigns;
});

// methods
function updateCampaigns() {
  if (!apiUrl) return

  fetch(apiUrl)
    .then((res) => res.json())
    .then((data) => campaigns.value = data);
}

// start update
setInterval(updateCampaigns(), 60000);
</script>

<style>

</style>