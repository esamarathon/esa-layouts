<template>
  <div>
    <button
      @click="send"
    >
      Force Refresh Intermission
    </button>
  </div>
</template>

<script>
export default {
  name: 'IntermissionControl',
  methods: {
    send() {
      nodecg.sendMessage('forceRefreshIntermission');
    },
  },
};
</script>
