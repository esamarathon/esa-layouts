<template>
  <div class="Donation">
    <div class="NameTotal">
      #{{ index + 1 }}: {{ data.name }} donated ${{ data.amount.toFixed(2) }}
    </div>
    <div
      v-if="data.comment"
      class="Comment"
    >
      {{ data.comment }}
    </div>
  </div>
</template>

<script>
export default {
  name: 'Donation',
  props: {
    data: {
      type: Object,
      default() {
        return {};
      },
    },
    index: {
      type: Number,
      default: 0,
    },
  },
};
</script>

<style scoped>
  .Donation {
    padding: 20px 0;
    border-top: 3px solid white;
  }

  .NameTotal {
    font-size: 35px;
  }

  .Comment {
    font-size: 25px;
  }
</style>
