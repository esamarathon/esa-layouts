<template>
  <div>
    <ul>
      <li
        v-for="name in commentators"
        :key="name"
      >
        {{ name }}
      </li>
    </ul>
    <input
      id="ManualAddInput"
      v-model="nameEntry"
      placeholder="Enter Name Here"
      @keyup.enter="add"
    >
    <button @click="add">
      Manual Add
    </button>
    <br><br>
    <button @click="clear">
      Manual Clear
    </button>
  </div>
</template>

<script>
const commentatorsRep = nodecg.Replicant('commentators');

export default {
  name: 'Commentators',
  data() {
    return {
      commentators: [],
      nameEntry: '',
    };
  },
  created() {
    commentatorsRep.on('change', (newVal) => {
      this.commentators = newVal.slice(0);
    });
  },
  methods: {
    clear() {
      commentatorsRep.value.length = 0;
    },
    add() {
      commentatorsRep.value.push(this.nameEntry);
      this.nameEntry = '';
    },
  },
};
</script>

<style>
  #ManualAddInput {
    width: 120px;
  }
</style>
