<template>
  <div
    class="Flex"
    :style="{
      'margin-right': theme === 'swcf' ? '10px' : '20px',
       overflow: 'hidden',
    }"
  >
    <!-- Alert sound effect. -->
    <!--<audio ref="SFX">
      <source src="./sfx/mario_coin.mp3" type="audio/mpeg">
    </audio>-->
    <template v-if="theme === 'swcf'">
      <!-- Alerts. -->
      <div
        class="Flex"
        :style="{
            opacity: showAlert ? 1 : 0,
            transition: 'opacity 0.5s',
        }"
      >
        <img
          src="./img/RetroCoin.png"
          :style="{
            height: '40px',
            'image-rendering': 'pixelated',
            'margin-right': '2px',
          }"
        >
        <span
          :style="{
            'font-size': '30px',
            color: '#7FFF00', // Basic green, no need to use theme
            'font-weight': 600,
            'background-color': 'rgba(0,0,0,0.6)',
            padding: '4px 8px',
            'border-radius': '10px',
          }"
        >
          +{{ alertText }}
        </span>
      </div>
      <!-- Actual total. -->
      <div
        id="Total"
        class="Flex"
        :style="{
          'font-size': '40px',
          'font-weight': 500,
          'min-width': '80px',
          'padding': '0 15px 0 25px',
        }"
      >
        <span
          v-for="(char, i) in totalStr"
          :key="i"
          :class="(char === ',' ? 'Comma' : undefined)"
        >
          {{ char }}
        </span>
      </div>
      <!-- Charity logo. -->
      <img
        id="CharityLogo"
        :style="{
          transition: 'opacity 0.5s',
        }"
      >
    </template>
    <template v-else>
      <div class="Grid" :style="{ 'min-width': '110px' }">
        <!-- Charity logo. -->
        <div class="Flex" :style="{ 'z-index': 0 }">
          <img
            id="CharityLogo"
            :style="{
              opacity: showAlert ? 0.3 : 1,
              transition: 'opacity 0.5s',
            }"
          >
        </div>
        <!-- Alerts. -->
        <div
          class="Flex"
          :style="{
              'z-index': 1,
              opacity: showAlert ? 1 : 0,
              transition: 'opacity 0.5s',
          }"

        >
          <img
            src="./img/RetroCoin.png"
            :style="{
              height: '30px',
              'image-rendering': 'pixelated',
              'margin-right': '2px',
            }"
          >
          <span
            :style="{
              'font-size': '20px',
              color: '#7FFF00', // Basic green, no need to use theme
              'font-weight': 600,
              'background-color': 'rgba(0,0,0,0.6)',
              padding: '4px 8px',
              'border-radius': '10px',
            }"
          >
            +{{ alertText }}
          </span>
        </div>
      </div>
      <!-- Actual total. -->
      <div
        id="Total"
        class="Flex"
        :style="{
          'font-size': '40px',
          'font-weight': 500,
          'min-width': '80px',
        }"
      >
        <span
          v-for="(char, i) in totalStr"
          :key="i"
          :class="(char === ',' ? 'Comma' : undefined)"
        >
          {{ char }}
        </span>
      </div>
    </template>
  </div>
</template>

<script lang="ts">
import { replicantModule, replicantNS } from '@esa-layouts/browser_shared/replicant_store';
import { formatUSD } from '@esa-layouts/graphics/_misc/helpers';
import { AdditionalDonations } from '@esa-layouts/types/schemas';
import gsap from 'gsap';
import { Component, Vue } from 'vue-property-decorator';

@Component
export default class extends Vue {
  // @Ref('SFX') sfx!: HTMLAudioElement;
  theme = nodecg.bundleConfig.event.theme;
  total = 0;
  playingAlerts = false;
  showAlert = false;
  alertText = '$0';
  alertList: { total?: number, amount?: number, showAlert: boolean }[] = [];
  donationTotalTimeout: number | undefined;
  @replicantNS.State(
    (s) => s.reps.additionalDonations,
  ) readonly additionalDonations!: AdditionalDonations;
  additionalDonationsCfg = nodecg.bundleConfig.additionalDonations;

  get additionalDonationsMapped() {
    return this.additionalDonationsCfg.map((d) => ({
      key: d.key,
      description: d.description,
      amount: d.amount,
      active: this.additionalDonations.find((a) => a.key === d.key)?.active ?? false,
    }));
  }

  get rawTotal(): number {
    const additional = this.additionalDonationsMapped
      .filter((d) => d.active).reduce((partialSum, a) => partialSum + a.amount, 0);
    return replicantModule.repsTyped.donationTotal + additional;
  }

  get totalStr(): string {
    // "Reset" value every 10k, specific to ESA Legends 2023.
    const esal23 = nodecg.bundleConfig.event.shorts === 'esal23';
    return `$${Math.floor(esal23 ? this.total % 10000 : this.total).toLocaleString('en-US', {
      maximumFractionDigits: 0,
      minimumIntegerDigits: esal23 && this.total >= 10000 ? 4 : undefined,
    })}`;
  }

  async playNextAlert(start = false): Promise<void> {
    nodecg.sendMessage('donationAlertsLogging', `playNextAlert called (start: ${start})`);
    clearTimeout(this.donationTotalTimeout); // Clearing here for safety
    this.playingAlerts = true;
    if (!start) await new Promise((res) => { setTimeout(res, 500); });
    // Only show alerts for positive values and if the alert should be "shown".
    const { amount, total, showAlert } = this.alertList[0];
    nodecg.sendMessage(
      'donationAlertsLogging',
      `alert - amount: ${amount}, total: ${total}, showAlert: ${showAlert}`,
    );
    if (amount && amount > 0 && showAlert) {
      nodecg.sendMessage('omnibarPlaySound', { amount });
      // await this.sfx.play();
      await new Promise((res) => { setTimeout(res, 500); });
      this.showAlert = true;
      this.alertText = formatUSD(amount);
    }
    const totalToAnimateTo = total ?? (this.total + (amount ?? 0));
    nodecg.sendMessage('donationAlertsLogging', `decided we should animate to ${totalToAnimateTo}`);
    gsap.to(this, {
      total: totalToAnimateTo,
      duration: 5,
    });
    await new Promise((res) => { setTimeout(res, 6000); });
    this.alertList.shift();
    this.showAlert = false;
    if (this.alertList.length) this.playNextAlert();
    // Checks the currently set total against the raw replicant total.
    // If they don't line up, just queue up another "alert" to adjust it.
    else if (this.total !== this.rawTotal) {
      nodecg.sendMessage(
        'donationAlertsLogging',
        'totals do not match at end of queue, pushing another total alert '
          + `(was ${this.total}, should be ${this.rawTotal})`,
      );
      clearTimeout(this.donationTotalTimeout); // Clearing here for safety
      this.alertList.push({
        total: this.rawTotal,
        showAlert: false,
      });
      this.playNextAlert();
    } else {
      nodecg.sendMessage('donationAlertsLogging', 'queue ended');
      this.playingAlerts = false;
    }
  }

  async created(): Promise<void> {
    this.total = this.rawTotal;
    nodecg.listenFor('donationTotalUpdated', (data: { total: number }) => {
      // If after 10s this hasn't been cleared by a new donation, update the total with it.
      this.donationTotalTimeout = window.setTimeout(() => {
        nodecg.sendMessage('donationAlertsLogging', 'donationTotalTimeout triggered');
        // Double check if the total really needs updating.
        // Also, only queue if alerts are not already
        // (the play system will check the final total at the end anyway).
        if (!this.playingAlerts && data.total !== this.total) {
          nodecg.sendMessage(
            'donationAlertsLogging',
            'donationTotalTimeout decided we should push a new total as an alert',
          );
          this.alertList.push({
            total: data.total,
            showAlert: false,
          });
          if (!this.playingAlerts) this.playNextAlert(true);
        }
      }, 10 * 1000);
    });
    nodecg.listenFor('newDonation', (data: { amount: number }) => {
      clearTimeout(this.donationTotalTimeout);
      this.alertList.push({
        amount: data.amount,
        showAlert: true,
      });
      if (!this.playingAlerts) this.playNextAlert(true);
    });
    nodecg.listenFor('additionalDonationToggle', (data: { key: string, active: boolean }) => {
      const donation = this.additionalDonationsMapped.find((d) => d.key === data.key);
      if (donation) {
        this.alertList.push({
          amount: (data.active ? 1 : -1) * donation.amount,
          showAlert: data.active,
        });
        if (!this.playingAlerts) this.playNextAlert(true);
      }
    });
  }
}
</script>

<style scoped>
  /* Each character in the total is in a span; setting width so the numbers appear monospaced. */
  #Total > span {
    display: inline-block;
    width: 0.45em;
    text-align: center;
  }
  #Total > .Comma {
    width: 0.22em;
  }
</style>
