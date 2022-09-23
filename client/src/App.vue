<template>
  <v-app>
    <v-app-bar density="compact">
      <v-app-bar-title>晨曦增强表</v-app-bar-title>
      <v-spacer class="d-none d-sm-flex"></v-spacer>

      <v-btn icon href="https://www.evehu.cn/donate" target="_blank">
        <v-icon>mdi-currency-usd</v-icon>
      </v-btn>
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
    socket: {}, // WebSocket
    campaigns: [],
    selectedRegions: [],
    selectedAlliances: [],
  }),

  setup() {
    const theme = useTheme();
    return {
      theme,
      toggleTheme: () => theme.global.name.value = theme.global.current.value.dark ? 'light' : 'dark'
    }
  },

  mounted() {
    // initialize WebSocket connection
    try {
      const protocol = (window.location.protocol === 'https:' ? 'wss://' : 'ws://');
      const host = location.hostname;
      const port = ':9999';
      const url = protocol + host + port + '/ws';
      this.socket = new WebSocket(url);

      this.socket.onopen = () => {
        setInterval(() => {
          this.socket.send('update')
        }, 60000)
      }

      this.socket.onmessage = (event) => {
        this.campaigns = JSON.parse(event.data);
      }
    } catch (e) {
      console.log(e)
    }
    

    // this.socket.onclose = () => {
    //   try {
    //     this.socket = new WebSocket(url);
    //   } catch (e) {
    //     console.log(e);
    //   }
    // }
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
  }
}
</script>

<style>

</style>