<template>
  <v-app>
    <v-app-bar
      density="compact"
    >
      <v-app-bar-nav-icon class="d-flex d-sm-none" variant="text" @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
      <v-app-bar-title>晨曦增强表</v-app-bar-title>
      <!-- <v-list class="d-none d-sm-flex"
        :items = "navItems"
      ></v-list> -->
      <a
        class="d-none d-sm-flex"
        v-for="item in navItems" 
        :href=item.value
      >{{item.title}}</a>
      <v-spacer class="d-none d-sm-flex"></v-spacer>
      <a icon href="https://github.com/mintnick/evehu_timer" target="_blank">
        <v-icon>mdi-github</v-icon>
      </a>
      <v-btn icon @click="toggleTheme">
        <v-icon>mdi-brightness-6</v-icon>
      </v-btn>
      <!-- <v-btn @click="toggleTheme">Theme</v-btn> -->

    </v-app-bar>

    <v-navigation-drawer
      v-model="drawer"
      width="128"
      bottom
      temporary
    >
      <!-- <a
        v-for="item in navItems" 
        :href=item.value
      >{{item.title}}</a> -->
      <v-list-item
        v-for="item in navItems"
      >
        <a :href="item.value">{{item.title}}</a>
      </v-list-item>
    </v-navigation-drawer>

    <v-main>
      <Filter
        :regions="getRegions"
        :alliances="getAlliances"
        @updateFilters="updateFilters"
      ></Filter>

      <!-- <span>{{ selectedRegions }}</span>
      <span>{{ selectedAlliances }}</span>
      <span>{{ getFilteredCampaigns }}</span> -->
    </v-main>
  </v-app>
</template>

<script>
import { useTheme } from 'vuetify/lib/framework.mjs';
import Filter from './components/Filter.vue'

export default {
  name: 'App',

  components: {
    Filter,
  },

  data: () => ({
    socket: {},
    campaigns: [],
    selectedRegions: [],
    selectedAlliances: [],

    drawer: false,
    group: null,
    navItems: [
      {
        title: '首页',
        value: '/'
      },
      {
        title: '捐赠',
        value: 'donate'
      },
    ]
  }),

  watch: {
    group() {
      this.drawer = false
    },
  },

  setup() {
    const theme = useTheme();
    return {
      theme,
      toggleTheme: () => theme.global.name.value = theme.global.current.value.dark ? 'light' : 'dark'
    }
  },

  mounted() {
    const protocol = (window.location.protocol === 'https:' ? 'wss://' : 'ws://');
    const port = ':9090';
    const url = protocol + 'localhost' + port;
    this.socket = new WebSocket(url);

    this.socket.onopen = () => {
      setInterval(() => {
        this.socket.send('update')
      }, 60000)
    }

    this.socket.onmessage = (event) => {
      this.campaigns = JSON.parse(event.data);
      // console.log(this.campaigns);
    }

    this.socket.onclose = () => {
      try {
        this.socket = new WebSocket(url);
      } catch (e) {
        console.log(e);
      }
    }
  },

  computed: {
    getRegions(){
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
      // console.log(selectedRegions);
      this.selectedRegions = selectedRegions;
      this.selectedAlliances = selectedAlliances;
    },
  }
}
</script>

<style>
  a {
    text-decoration: none;
    margin-right: 1vw;
  }
</style>