"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var clone_1 = __importDefault(require("clone"));
var path_1 = __importDefault(require("path"));
var uuid_1 = require("uuid");
/**
 * Calculates the absolute file path to one of our local replicant schemas.
 * @param schemaName The replicant/schema filename.
 */
function buildSchemaPath(schemaName) {
    return path_1.default.resolve(__dirname, '../../../schemas', "".concat(encodeURIComponent(schemaName), ".json"));
}
var MediaBox = /** @class */ (function () {
    function MediaBox(nodecg, evt, obs, obsCfg) {
        var _this = this;
        this.nodecg = nodecg;
        this.obs = obs;
        this.obsCfg = obsCfg;
        this.mediaBox = nodecg.Replicant('mediaBox', { schemaPath: buildSchemaPath('mediaBox') });
        this.prizes = nodecg.Replicant('prizes', {
            schemaPath: buildSchemaPath('prizes'),
            persistent: false,
        });
        this.assetsMediaBoxImages = nodecg.Replicant('assets:media-box-images');
        // ALL OF THESE DISABLED FOR NOW (ESAW24).
        // Manages received donations/subscriptions/cheers.
        /* evt.on('donationFullyProcessed', (data) => {
          if (data.comment_state === 'APPROVED') {
            // eslint-disable-next-line no-underscore-dangle
            this.nodecg.log.debug('[Media Box] Received new donation with ID %s', data._id);
            this.mediaBox.value.alertQueue.push({
              type: 'donation',
              id: uuid(),
              data: {
                name: data.donor_visiblename.replace('(Anonymous)', 'Anonymous'),
                amount: data.amount,
                comment: data.comment || undefined,
              },
            });
          }
        });
        evt.on('newScreenedSub', (data) => {
          this.nodecg.log.debug('[Media Box] Received new subscription');
          this.mediaBox.value.alertQueue.push({
            type: 'subscription',
            id: uuid(),
            data: {
              systemMsg: data.message.tags['system-msg'].replace(/\\s/g, ' '),
              message: data.message.trailing,
            },
          });
        });
        evt.on('newScreenedCheer', (data) => {
          this.nodecg.log.debug('[Media Box] Received new cheer');
          this.mediaBox.value.alertQueue.push({
            type: 'cheer',
            id: uuid(),
            data: {
              name: data.message.tags['display-name'],
              amount: Number(data.message.tags.bits),
              message: data.message.trailing,
            },
          });
        });
    
        nodecg.listenFor('therunggMessage', (msg: string) => {
          this.nodecg.log.debug('[Media Box] Received new therun.gg message');
          this.mediaBox.value.alertQueue.push({
            type: 'therungg',
            id: uuid(),
            data: {
              msg,
            },
          });
        }); */
        this.update();
        setInterval(function () { return _this.update(); }, 1000);
    }
    MediaBox.prototype.pushMerchPurchase = function (_a) {
        var user = _a.user, productName = _a.productName, imgURL = _a.imgURL;
        this.nodecg.log.debug('[Media Box] Received new merch purchase');
        this.mediaBox.value.alertQueue.push({
            type: 'merch',
            id: (0, uuid_1.v4)(),
            data: { user: user, productName: productName, imgURL: imgURL },
        });
    };
    /**
     * Checks if the supplied type is that of an alert.
     * @param type Type of alert
     */
    MediaBox.prototype.isAlertType = function (type) {
        return ['donation', 'subscription', 'cheer', 'merch', 'therungg'].includes(type);
    };
    /**
     * Get the length in milliseconds a piece of media should remain,
     * -1 if we cannot find any relevant length.
     * @param media media box object, usually from "current" property.
     */
    MediaBox.prototype.getLength = function (media) {
        var _a;
        if (media && this.isAlertType(media.type)) {
            return 15 * 1000; // Alerts have a hardcoded 15 second length for now.
        }
        var length = (_a = this.mediaBox.value.rotationApplicable.find(function (i) { return i.id === (media === null || media === void 0 ? void 0 : media.id); })) === null || _a === void 0 ? void 0 : _a.seconds;
        return length ? length * 1000 : -1;
    };
    /**
     * Get the index of the next piece of media in the rotation,
     * 0 if for some reason nothing can be located correctly.
     */
    MediaBox.prototype.getNextIndex = function () {
        var _this = this;
        var indexID = this.mediaBox.value.rotationApplicable
            .findIndex(function (i) { var _a; return i.id === ((_a = _this.mediaBox.value.current) === null || _a === void 0 ? void 0 : _a.id); });
        if (indexID >= 0) {
            return indexID + 1;
        }
        return typeof this.mediaBox.value.lastIndex === 'number'
            ? this.mediaBox.value.lastIndex + 1 : 0;
    };
    /**
     * Returns if a prize should be shown or not.
     * @param prize Formatted prize object from the tracker.
     */
    MediaBox.prototype.isPrizeApplicable = function (prize) {
        return !!(prize && prize.startTime && prize.endTime
            && Date.now() > prize.startTime && Date.now() < prize.endTime);
    };
    /**
     * Returns a random applicable prize if one is available.
     */
    MediaBox.prototype.getRandomPrize = function () {
        var _this = this;
        var applicablePrizes = this.prizes.value.filter(function (p) { return _this.isPrizeApplicable(p); });
        return applicablePrizes[Math.floor(Math.random() * applicablePrizes.length)];
    };
    /**
     * Handles the cycling of of the current media.
     * @param pause If we should be attempted to "pause" the current media for an alert.
     */
    MediaBox.prototype.cycle = function (pause) {
        var _a;
        if (pause === void 0) { pause = false; }
        // If the alert queue has anything in it, we need to handle those first.
        if (this.mediaBox.value.alertQueue.length) {
            if (pause) { // Pause current media element.
                this.mediaBox.value.paused = (0, clone_1.default)(this.mediaBox.value.current);
            }
            this.mediaBox.value.current = {
                type: this.mediaBox.value.alertQueue[0].type,
                id: (0, uuid_1.v4)(),
                mediaUUID: this.mediaBox.value.alertQueue[0].id,
                index: -1,
                timestamp: Date.now(),
                timeElapsed: 0,
            };
        }
        else if (this.mediaBox.value.rotationApplicable.length) {
            // Resume paused media element if applicable.
            if (this.mediaBox.value.paused) {
                var toResume = (0, clone_1.default)(this.mediaBox.value.paused);
                toResume.timestamp = Date.now();
                this.mediaBox.value.current = toResume;
                this.mediaBox.value.paused = null;
            }
            else { // Find next media element from rotation to use.
                var index = this.getNextIndex() < this.mediaBox.value.rotationApplicable.length
                    ? this.getNextIndex() : 0;
                var media = this.mediaBox.value.rotationApplicable[index];
                var mUUID = media.type === 'prize_generic'
                    ? (((_a = this.getRandomPrize()) === null || _a === void 0 ? void 0 : _a.id.toString()) || '-1') : media.mediaUUID;
                this.mediaBox.value.current = {
                    type: media.type,
                    id: media.id,
                    mediaUUID: mUUID,
                    index: index,
                    timestamp: Date.now(),
                    timeElapsed: 0,
                };
            }
        }
        else {
            this.nodecg.log.debug('[Media Box] No media in rotation to cycle to, will wait');
            this.mediaBox.value.current = null;
            this.mediaBox.value.paused = null;
        }
    };
    /**
     * This runs every second, all of the time.
     */
    MediaBox.prototype.update = function () {
        var _this = this;
        // Filters rotation for items only applicable/available at this moment.
        var rotationApplicableLengthOld = this.mediaBox.value.rotationApplicable.length;
        this.mediaBox.value.rotationApplicable = this.mediaBox.value.rotation.filter(function (m) {
            // If the item is set to *not* appear on the intermission,
            // exclude it if we're on an intermission scene.
            var scenes = _this.obsCfg.names.scenes;
            var intermissionScenes = [
                (scenes === null || scenes === void 0 ? void 0 : scenes.commercials) ? _this.obs.findScene(scenes.commercials) : undefined,
                (scenes === null || scenes === void 0 ? void 0 : scenes.intermission) ? _this.obs.findScene(scenes.intermission) : undefined,
            ].filter(Boolean);
            if (!m.showOnIntermission && intermissionScenes.includes(_this.obs.currentScene)) {
                return false;
            }
            // Only rotate to image if the asset actually exists.
            if (m.type === 'image') {
                return !!_this.assetsMediaBoxImages.value.find(function (i) { return i.sum === m.mediaUUID; });
            }
            // Only show the generic prize element if there are applicable prizes to fill it with.
            if (m.type === 'prize_generic') {
                return !!_this.prizes.value.filter(function (p) { return _this.isPrizeApplicable(p); }).length;
            }
            // Only show prize if applicable right now.
            if (m.type === 'prize') {
                return _this.isPrizeApplicable(_this.prizes.value
                    .find(function (p) { return p.id.toString() === m.mediaUUID; }));
            }
            // Always show text.
            if (m.type === 'text') {
                return true;
            }
            return false;
        });
        if (this.mediaBox.value.rotationApplicable.length !== rotationApplicableLengthOld) {
            this.nodecg.log.debug('[Media Box] Applicable rotation length changed');
        }
        // If we have no piece of media, check if there is anything to show.
        if (!this.mediaBox.value.current) {
            if (this.mediaBox.value.rotationApplicable.length || this.mediaBox.value.alertQueue.length) {
                this.nodecg.log.debug('[Media Box] '
                    + "".concat(this.mediaBox.value.alertQueue.length ? 'Alert' : 'Media', " available, will cycle"));
                this.cycle();
            }
        }
        else { // If we have a current piece of media, need to check if it still should be shown.
            var addedTime = Date.now() - this.mediaBox.value.current.timestamp;
            var timeElapsed = this.mediaBox.value.current.timeElapsed + addedTime;
            var index = this.mediaBox.value.rotationApplicable
                .findIndex(function (i) { var _a; return i.id === ((_a = _this.mediaBox.value.current) === null || _a === void 0 ? void 0 : _a.id); });
            // Cycle if it is time to remove the current media.
            if ((index < 0 && !this.isAlertType(this.mediaBox.value.current.type))
                || this.getLength(this.mediaBox.value.current) <= timeElapsed) {
                // If this is an alert, we also need to remove that one from the queue.
                if (this.isAlertType(this.mediaBox.value.current.type)) {
                    var alertIndex = this.mediaBox.value.alertQueue
                        .findIndex(function (a) { var _a; return a.id === ((_a = _this.mediaBox.value.current) === null || _a === void 0 ? void 0 : _a.mediaUUID); });
                    if (alertIndex >= 0) {
                        this.mediaBox.value.alertQueue.splice(alertIndex, 1);
                    }
                }
                else {
                    this.mediaBox.value.lastIndex = this.mediaBox.value.current.index;
                }
                this.nodecg.log.debug('[Media Box] Current media time finished, will cycle');
                this.cycle();
            }
            else {
                if (!this.isAlertType(this.mediaBox.value.current.type)) {
                    this.mediaBox.value.current.index = index;
                }
                this.mediaBox.value.current.timestamp = Date.now();
                this.mediaBox.value.current.timeElapsed = timeElapsed;
                // If there are any alerts to show, we should do that now.
                if (!this.isAlertType(this.mediaBox.value.current.type)
                    && this.mediaBox.value.alertQueue.length) {
                    this.nodecg.log.debug('[Media Box] Alert available, will cycle');
                    this.cycle(true);
                }
            }
        }
    };
    return MediaBox;
}());
module.exports = MediaBox;
