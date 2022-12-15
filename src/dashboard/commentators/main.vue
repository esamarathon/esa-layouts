<template>
  <v-app>
    <v-card
      :style="{ 'margin-bottom': '10px' }"
      tile
    >
      <v-list dense>
        <v-list-item-group>
          <template v-if="commentators.length">
            <v-list-item
              v-for="(name, i) in commentators"
              :key="i"
            >
              <v-list-item-action>
                <v-icon @click="del(i)">mdi-delete</v-icon>
              </v-list-item-action>
              <v-list-item-content>
                {{ name }}
              </v-list-item-content>
            </v-list-item>
          </template>
          <v-list-item
            v-else
            :style="{ 'font-style': 'italic' } "
          >
            No commentators specified
          </v-list-item>
        </v-list-item-group>
      </v-list>
    </v-card>
    <div class="d-flex">
      <v-text-field
        v-model="nameEntry"
        label="Enter Name Here"
        hide-details
        filled
        :spellcheck="false"
        :disabled="disable"
        @keyup.enter="add"
      />
      <v-btn
        height="56px"
        :style="{ 'min-width': '0', 'margin-left': '5px' }"
        :disabled="disable"
        @click="add"
      >
        <v-icon>mdi-check</v-icon>
      </v-btn>
    </div>
    <v-btn
      :style="{ 'margin-top': '10px' }"
      :disabled="disable"
      @click="clear"
    >
      Manual Clear
    </v-btn>
  </v-app>
</template>

<script lang="ts">
import { replicantNS } from '@esa-layouts/browser_shared/replicant_store';
import { Commentators } from '@esa-layouts/types/schemas';
import { Component, Vue } from 'vue-property-decorator';
import { storeModule } from './store';

@Component
export default class extends Vue {
  nameEntry = '';
  disable = false;
  @replicantNS.State((s) => s.reps.commentators) readonly commentators!: Commentators;
  clear = storeModule.clearCommentators;

  async add(): Promise<void> {
    this.disable = true;
    try {
      await nodecg.sendMessage('commentatorAdd', this.nameEntry);
    } catch (err) {
      // catch
    }
    this.disable = false;
    this.nameEntry = '';
  }

  async del(index: number): Promise<void> {
    this.disable = true;
    try {
      await nodecg.sendMessage('commentatorRemove', index);
    } catch (err) {
      // catch
    }
    this.disable = false;
  }
}
</script>
