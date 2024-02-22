"use strict";
/* eslint-disable max-len */
Object.defineProperty(exports, "__esModule", { value: true });
exports.videoPlayer = exports.upcomingRunID = exports.twitchChannelInfo = exports.twitchAPIData = exports.ttsVoices = exports.taskmasterTimestamps = exports.streamDeckData = exports.serverTimestamp = exports.readerIntroduction = exports.prizes = exports.otherStreamData = exports.omnibar = exports.oengusImportStatus = exports.obsData = exports.notableDonations = exports.nameCycle = exports.musicData = exports.intermissionSlides = exports.horaroImportStatus = exports.gameLayouts = exports.donationTotalMilestones = exports.donationTotal = exports.donationsToRead = exports.donationReaderNew = exports.donationReader = exports.donationAlerts = exports.delayedTimer = exports.currentRunDelay = exports.countdown = exports.commentatorsNew = exports.commentators = exports.capturePositions = exports.bigbuttonPlayerMap = exports.bids = exports.assetsVideos = exports.assetsReaderIntroductionImages = exports.assetsMediaBoxImages = exports.assetsIntermissionSlides = exports.assetsDonationAlertAssets = exports.additionalDonations = void 0;
const nodecg_1 = require("./nodecg");
/**
 * This is where you can declare all your replicant to import easily into other files,
 * and to make sure they have any correct settings on startup.
 */
exports.additionalDonations = (0, nodecg_1.get)().Replicant('additionalDonations');
exports.assetsDonationAlertAssets = (0, nodecg_1.get)().Replicant('assets:donation-alert-assets');
exports.assetsIntermissionSlides = (0, nodecg_1.get)().Replicant('assets:intermission-slides');
exports.assetsMediaBoxImages = (0, nodecg_1.get)().Replicant('assets:media-box-images');
exports.assetsReaderIntroductionImages = (0, nodecg_1.get)().Replicant('assets:reader-introduction-images');
exports.assetsVideos = (0, nodecg_1.get)().Replicant('assets:videos');
exports.bids = (0, nodecg_1.get)().Replicant('bids', { persistent: false });
exports.bigbuttonPlayerMap = (0, nodecg_1.get)().Replicant('bigbuttonPlayerMap');
exports.capturePositions = (0, nodecg_1.get)().Replicant('capturePositions');
exports.commentators = (0, nodecg_1.get)().Replicant('commentators');
exports.commentatorsNew = (0, nodecg_1.get)().Replicant('commentatorsNew');
exports.countdown = (0, nodecg_1.get)().Replicant('countdown');
exports.currentRunDelay = (0, nodecg_1.get)().Replicant('currentRunDelay');
exports.delayedTimer = (0, nodecg_1.get)().Replicant('delayedTimer');
exports.donationAlerts = (0, nodecg_1.get)().Replicant('donationAlerts');
exports.donationReader = (0, nodecg_1.get)().Replicant('donationReader');
exports.donationReaderNew = (0, nodecg_1.get)().Replicant('donationReaderNew');
exports.donationsToRead = (0, nodecg_1.get)().Replicant('donationsToRead', { persistent: false });
exports.donationTotal = (0, nodecg_1.get)().Replicant('donationTotal');
exports.donationTotalMilestones = (0, nodecg_1.get)().Replicant('donationTotalMilestones');
exports.gameLayouts = (0, nodecg_1.get)().Replicant('gameLayouts');
exports.horaroImportStatus = (0, nodecg_1.get)().Replicant('horaroImportStatus', 'nodecg-speedcontrol');
exports.intermissionSlides = (0, nodecg_1.get)().Replicant('intermissionSlides');
exports.musicData = (0, nodecg_1.get)().Replicant('musicData');
exports.nameCycle = (0, nodecg_1.get)().Replicant('nameCycle', { persistent: false });
exports.notableDonations = (0, nodecg_1.get)().Replicant('notableDonations');
exports.obsData = (0, nodecg_1.get)().Replicant('obsData', { persistent: false });
exports.oengusImportStatus = (0, nodecg_1.get)().Replicant('oengusImportStatus', 'nodecg-speedcontrol');
exports.omnibar = (0, nodecg_1.get)().Replicant('omnibar');
exports.otherStreamData = (0, nodecg_1.get)().Replicant('otherStreamData');
exports.prizes = (0, nodecg_1.get)().Replicant('prizes', { persistent: false });
exports.readerIntroduction = (0, nodecg_1.get)().Replicant('readerIntroduction');
exports.serverTimestamp = (0, nodecg_1.get)().Replicant('serverTimestamp');
exports.streamDeckData = (0, nodecg_1.get)().Replicant('streamDeckData');
exports.taskmasterTimestamps = (0, nodecg_1.get)().Replicant('taskmasterTimestamps');
exports.ttsVoices = (0, nodecg_1.get)().Replicant('ttsVoices');
exports.twitchAPIData = (0, nodecg_1.get)().Replicant('twitchAPIData', 'nodecg-speedcontrol');
exports.twitchChannelInfo = (0, nodecg_1.get)().Replicant('twitchChannelInfo', 'nodecg-speedcontrol');
exports.upcomingRunID = (0, nodecg_1.get)().Replicant('upcomingRunID');
exports.videoPlayer = (0, nodecg_1.get)().Replicant('videoPlayer');
