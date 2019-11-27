<template>
  <v-app>
    <v-card>
      <v-list-item
        v-for="name in commentators"
        :key="name"
        :height="15"
      >
        <v-list-item-content>
          <v-list-item-title>
            {{ name }}
          </v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </v-card>
    <div class="d-flex">
      <v-text-field
        v-model="nameEntry"
        label="Enter Name Here"
        hide-details
        filled
        :spellcheck="false"
        @keyup.enter="add"
      ></v-text-field>
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
