<template>
  <v-app>
    <v-card
      :style="{ 'margin-bottom': '10px' }"
      tile
    >
      <v-list
        dense
        disabled
      >
        <v-list-item-group>
          <template v-if="commentators.length">
            <v-list-item
              v-for="(name, i) in commentators"
              :key="i"
            >
              {{ name }}
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
        @keyup.enter="add"
      />
      <v-btn
        height="56px"
        :style="{ 'min-width': '0', 'margin-left': '5px' }"
        @click="add"
      >
        <v-icon>mdi-check</v-icon>
      </v-btn>
    </div>
    <v-btn
      :style="{ 'margin-top': '10px' }"
      @click="clear"
    >
      Manual Clear
    </v-btn>
  </v-app>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import { State, Mutation } from 'vuex-class';
import { Commentators } from 'schemas';
import { ClearCommentators, AddCommentator } from './store';

@Component
export default class extends Vue {
  nameEntry = '';

  @State commentators!: Commentators;
  @Mutation('clearCommentators') clear!: ClearCommentators;
  @Mutation addCommentator!: AddCommentator;

  add(): void {
    this.addCommentator(this.nameEntry);
    this.nameEntry = '';
  }
}
</script>
