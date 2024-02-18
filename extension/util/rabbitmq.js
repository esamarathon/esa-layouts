"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.mq = void 0;
const rabbitmq_1 = __importDefault(require("@shared/extension/rabbitmq"));
const helpers_1 = require("./helpers");
const nodecg_1 = require("./nodecg");
const { useTestData } = (0, nodecg_1.get)().bundleConfig;
const exchange = 'cg';
const event = (0, helpers_1.getCurrentEventShort)();
// eslint-disable-next-line import/prefer-default-export
exports.mq = new rabbitmq_1.default((0, nodecg_1.get)(), useTestData, {
    config: (0, nodecg_1.get)().bundleConfig.rabbitmq,
    exchange,
    event,
    listenTopics: [
        {
            name: 'donationTotalUpdated',
            exchange: 'tracker',
            key: '*.donation_total.updated',
        },
        {
            name: 'donationFullyProcessedStream',
            exchange: 'tracker',
            key: `${event}.donation.*.fully_processed`,
        },
        {
            name: 'donationFullyProcessedTeam',
            exchange: 'tracker',
            key: 'esaw2024.donation.*.fully_processed', // HARDCODED! (ESAW24)
        },
        {
            name: 'newScreenedTweet',
            exchange: 'moderation',
            key: 'screened.tweet',
        },
        {
            name: 'newScreenedSub',
            exchange: 'moderation',
            key: 'screened.sub',
        },
        {
            name: 'newScreenedCheer',
            exchange: 'moderation',
            key: 'screened.cheer',
        },
        {
            name: 'newScreenedCrowdControl',
            exchange: 'moderation',
            key: 'screened.crowdcontrol',
        },
        {
            name: 'bigbuttonTagScanned',
            exchange: 'bigbutton',
            key: '*.tag_scanned',
        },
        {
            name: 'bigbuttonPressed',
            exchange: 'bigbutton',
            key: '*.pressed',
        },
        {
            name: 'runChanged',
            exchange,
            key: '*.run.changed',
        },
        {
            name: 'streamingStatusChanged',
            exchange,
            key: '*.obs.stream.*',
        },
        {
            name: 'gameSceneChanged',
            exchange,
            key: '*.obs.scene.*.*.gamescene',
        },
    ],
});
