<template>
  <div
    class="Layout Flex"
    :style="{
      'box-sizing': 'border-box',
      color: 'white',
      height: '1000px',
      'justify-content': 'space-evenly',
      'align-items': 'flex-end',
      padding: '50px',
      zoom,
    }"
  >
    <host
      v-for="pos in ['left', 'midleft', 'middle', 'midright', 'right']"
      :key="pos"
      :pos="pos"
    />
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import { getZoomAmountCSS } from '../_misc/helpers';
import Host from './components/Host.vue';

@Component({
  components: {
    Host,
  },
})
export default class extends Vue {
  zoom = getZoomAmountCSS();
}
</script>
