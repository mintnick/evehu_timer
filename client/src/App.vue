<template>
  <v-app>
    <v-app-bar density="compact">
      <v-app-bar-title>晨曦增强表</v-app-bar-title>
      <span class="font-weight-bold mr-4">{{ campaigns.length }}个领地争夺中</span>
      <span class="mr-4 text-red-lighten-2">晨曦时间 {{ new Date().toLocaleString("zh-CN", {dateStyle: "long", timeStyle: "medium"}) }}</span>
      <span class="text-blue-lighten-2">宁静时间 {{ new Date().toLocaleString("zh-CN", {timeZone: "UTC", dateStyle: "long", timeStyle: "medium"}) }}</span>
      <v-spacer class="d-none d-sm-flex"></v-spacer>

      <v-btn icon href="https://github.com/mintnick/evehu_timer" target="_blank">
        <v-icon>mdi-github</v-icon>
      </v-btn>
      <v-btn icon @click="toggleTheme">
        <v-icon>mdi-brightness-6</v-icon>
      </v-btn>

    </v-app-bar>

    <v-main>
      <Filter :regions="getRegions" :alliances="getAlliances" @updateFilters="updateFilters"></Filter>
      <CampaignBoard :filteredCampaigns="getFilteredCampaigns"></CampaignBoard>
    </v-main>
  </v-app>
</template>

<script>
import { useTheme } from 'vuetify/lib/framework.mjs';
import Filter from './components/Filter.vue'
import CampaignBoard from './components/CampaignBoard.vue'

export default {
  name: 'App',

  components: {
    Filter,
    CampaignBoard,
  },

  data: () => ({
    campaigns: [],
    selectedRegions: [],
    selectedAlliances: [],
    apiUrl: "",
  }),

  setup() {
    const theme = useTheme();
    return {
      theme,
      toggleTheme: () => {
        theme.global.name.value = theme.global.current.value.dark ? 'light' : 'dark'
        let now = new Date();
        now.setUTCFullYear(now.getFullYear() + 10);
        document.cookie = "theme="+theme.global.name.value+";expires="+now+";path=/";
      }
    }
  },

  mounted() {
    const value = `;${document.cookie}`;
    const parts = value.split(`;theme=`);
    if (parts.length === 2) this.theme.global.name.value = parts.pop().split(';').shift();

    if (import.meta.env.DEV) this.apiUrl = 'http://localhost:3001/api/campaigns'
    else this.apiUrl = '/api/campaigns'

    setInterval(this.updateCampaigns(), 60000);
  },

  computed: {
    getRegions() {
      if (!this.campaigns) return;
      let regions = new Set();
      this.campaigns.map(record => regions.add(record.region_name));
      regions = Array.from(regions);
      return regions;
    },

    getAlliances() {
      if (!this.campaigns) return;
      let allis = new Set();
      this.campaigns.map(record => allis.add(record.alli_name));
      allis = Array.from(allis);
      return allis;
    },

    getFilteredCampaigns() {
      if (this.selectedRegions.length == 0 && this.selectedAlliances.length == 0) return this.campaigns;

      let filteredCampaigns = [];
      for (const campaign of this.campaigns) {
        if (this.selectedRegions.includes(campaign.region_name) || this.selectedAlliances.includes(campaign.alli_name)) {
          filteredCampaigns.push(campaign);
        }
      }

      return filteredCampaigns;
    },
  },

  methods: {
    updateFilters(selectedRegions, selectedAlliances) {
      this.selectedRegions = selectedRegions;
      this.selectedAlliances = selectedAlliances;
    },

    updateCampaigns() {
      if (!this.apiUrl) return

      fetch(this.apiUrl)
        .then((res) => res.json())
        .then((data) => this.campaigns = data);
    },
  }
}
</script>

<style>

</style>