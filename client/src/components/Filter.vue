<template>
  <!-- <span>{{ regions }}</span> -->
  <v-row>
    <v-col>
      <v-card-text>
        <h2 class="text-h6">
          星域
        </h2>
        <v-chip-group v-model="selectedRegions" column multiple>
          <v-chip v-for="region in regions" filter outlined label>
            {{ region }}
          </v-chip>
        </v-chip-group>
      </v-card-text>
    </v-col>

    <v-col>
      <v-card-text>
        <h2 class="text-h6">
          联盟
        </h2>
        <v-chip-group v-model="selectedAlliances" column multiple>
          <v-chip v-for="alliance in alliances" filter outlined label>
            {{ alliance }}
          </v-chip>
        </v-chip-group>
      </v-card-text>
    </v-col>
  </v-row>
  <!-- <div class="d-flex justify-center">
    <v-btn>显示所有</v-btn>
  </div> -->
  <!-- <span>{{ selectedRegions }}</span> -->
  <!-- <span>{{ filteredRegions }}</span> -->
</template>

<script>
export default {
  name: 'Filter',

  components: {

  },

  props: {
    regions: Array,
    alliances: Array,
  },

  emits: ['updateFilters'],

  data: () => ({
    selectedRegions: [],
    selectedRegionNames: [],
    selectedAlliances: [],
    selectedAllianceNames: [],
  }),

  watch: {
    selectedRegions() {
      this.selectedRegionNames = this.selectedRegions.map(i => this.regions[i]);
      this.$emit('updateFilters', this.selectedRegionNames, this.selectedAllianceNames);
    },

    selectedAlliances() {
      this.selectedAllianceNames = this.selectedAlliances.map(i => this.alliances[i]);
      this.$emit('updateFilters', this.selectedRegionNames, this.selectedAllianceNames);
    },
  },
}
</script>

<style>

</style>