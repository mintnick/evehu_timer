<template>
  <v-row>
    <v-col>
      <v-card-text>
        <h2 class="text-h5">
          星域
        </h2>
        <v-chip-group v-model="selectedRegions" column multiple>
          <v-chip v-for="region in regions" filter outlined label size="large">
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
          <v-chip v-for="alliance in alliances" filter outlined label size="large">
            {{ alliance }}
          </v-chip>
        </v-chip-group>
      </v-card-text>
    </v-col>
  </v-row>
</template>

<script>
export default {
  name: 'Filter',

  props: {
    regions: Array,
    alliances: Array,
  },

  emits: ['updateFilters'],

  data: () => ({
    selectedRegions: [],  // region filter indices
    selectedRegionNames: [],
    selectedAlliances: [],  // alliance filter indices
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