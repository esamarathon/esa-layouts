<template>
  <div
    v-if="show"
    id="CommentatorsBox"
    class="RunInfoBox FlexContainer"
  >
    <span id="CommHeader">
      Commentators:
    </span>
    &nbsp;{{ text }}
  </div>
</template>

<script>
const commentatorsRep = nodecg.Replicant('commentators');

export default {
  name: 'Commentators',
  data() {
    return {
      text: '',
      show: false,
      commentators: [],
    };
  },
  watch: {
    commentators(val) {
      this.show = val.length > 0;
      this.text = val.join(', ');
    },
  },
  created() {
    commentatorsRep.on('change', (newVal) => {
      this.commentators = newVal.slice(0);
    });
  },
};
</script>

<style scoped>
  @import url('./RunInfoBox.css');
  @import url('../../_misc/components/FlexContainer.css');

  #CommentatorsBox {
    font-size: 25px;
    font-weight: 400;
    color: var(--font-colour-inverted);
    background-color: var(--commentators-bg-colour);
    padding: 5px;
  }

  #CommHeader {
    font-weight: 500;
  }
</style>
