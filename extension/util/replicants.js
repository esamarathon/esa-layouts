"use strict";
/* eslint-disable max-len */
Object.defineProperty(exports, "__esModule", { value: true });
exports.videoPlayer = exports.upcomingRunID = exports.twitchChannelInfo = exports.twitchAPIData = exports.ttsVoices = exports.streamDeckData = exports.serverTimestamp = exports.readerIntroduction = exports.prizes = exports.otherStreamData = exports.omnibar = exports.obsData = exports.notableDonations = exports.nameCycle = exports.musicData = exports.horaroImportStatus = exports.gameLayouts = exports.donationTotalMilestones = exports.donationTotal = exports.donationsToRead = exports.donationReader = exports.delayedTimer = exports.currentRunDelay = exports.countdown = exports.commentators = exports.capturePositions = exports.bigbuttonPlayerMap = exports.bids = exports.assetsVideos = exports.assetsReaderIntroductionImages = exports.assetsMediaBoxImages = exports.assetsIntermissionSlides = void 0;
const nodecg_1 = require("./nodecg");
/**
 * This is where you can declare all your replicant to import easily into other files,
 * and to make sure they have any correct settings on startup.
 */
exports.assetsIntermissionSlides = (0, nodecg_1.get)().Replicant('assets:intermission-slides');
exports.assetsMediaBoxImages = (0, nodecg_1.get)().Replicant('assets:media-box-images');
exports.assetsReaderIntroductionImages = (0, nodecg_1.get)().Replicant('assets:reader-introduction-images');
exports.assetsVideos = (0, nodecg_1.get)().Replicant('assets:videos');
exports.bids = (0, nodecg_1.get)().Replicant('bids', { persistent: false });
exports.bigbuttonPlayerMap = (0, nodecg_1.get)().Replicant('bigbuttonPlayerMap');
exports.capturePositions = (0, nodecg_1.get)().Replicant('capturePositions');
exports.commentators = (0, nodecg_1.get)().Replicant('commentators');
exports.countdown = (0, nodecg_1.get)().Replicant('countdown');
exports.currentRunDelay = (0, nodecg_1.get)().Replicant('currentRunDelay');
exports.delayedTimer = (0, nodecg_1.get)().Replicant('delayedTimer');
exports.donationReader = (0, nodecg_1.get)().Replicant('donationReader');
exports.donationsToRead = (0, nodecg_1.get)().Replicant('donationsToRead', { persistent: false });
exports.donationTotal = (0, nodecg_1.get)().Replicant('donationTotal');
exports.donationTotalMilestones = (0, nodecg_1.get)().Replicant('donationTotalMilestones');
exports.gameLayouts = (0, nodecg_1.get)().Replicant('gameLayouts');
exports.horaroImportStatus = (0, nodecg_1.get)().Replicant('horaroImportStatus', 'nodecg-speedcontrol');
exports.musicData = (0, nodecg_1.get)().Replicant('musicData');
exports.nameCycle = (0, nodecg_1.get)().Replicant('nameCycle', { persistent: false });
exports.notableDonations = (0, nodecg_1.get)().Replicant('notableDonations');
exports.obsData = (0, nodecg_1.get)().Replicant('obsData', { persistent: false });
exports.omnibar = (0, nodecg_1.get)().Replicant('omnibar');
exports.otherStreamData = (0, nodecg_1.get)().Replicant('otherStreamData');
exports.prizes = (0, nodecg_1.get)().Replicant('prizes', { persistent: false });
exports.readerIntroduction = (0, nodecg_1.get)().Replicant('readerIntroduction');
exports.serverTimestamp = (0, nodecg_1.get)().Replicant('serverTimestamp');
exports.streamDeckData = (0, nodecg_1.get)().Replicant('streamDeckData');
exports.ttsVoices = (0, nodecg_1.get)().Replicant('ttsVoices');
exports.twitchAPIData = (0, nodecg_1.get)().Replicant('twitchAPIData', 'nodecg-speedcontrol');
exports.twitchChannelInfo = (0, nodecg_1.get)().Replicant('twitchChannelInfo', 'nodecg-speedcontrol');
exports.upcomingRunID = (0, nodecg_1.get)().Replicant('upcomingRunID');
exports.videoPlayer = (0, nodecg_1.get)().Replicant('videoPlayer');
