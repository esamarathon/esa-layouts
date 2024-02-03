"use strict";
/* eslint-disable global-require, @typescript-eslint/no-var-requires */
// This must go first so we can use module aliases!
/* eslint-disable import/first */
require('module-alias').addAlias('@esa-layouts', require('path').join(__dirname, '.'));
require('module-alias').addAlias('@shared', require('path').join(__dirname, '../shared'));
const nodecg_1 = require("./util/nodecg");
module.exports = (nodecg) => {
    (0, nodecg_1.set)(nodecg);
    // If `thisEvent` is 2, checks if we actually have 2 event shorts to
    // pick from before mounting the extension.
    const config = nodecg.bundleConfig;
    if (config.event.thisEvent === 2
        && (typeof config.event.shorts === 'string' || config.event.shorts.length === 1)) {
        throw new Error('event.thisEvent in config is set to 2 but you only '
            + 'have 1 event short at event.shorts');
    }
    const { useTestData } = nodecg.bundleConfig;
    if (useTestData) {
        nodecg.log.warn('USING TEST DATA, MAKE SURE TO DISABLE THIS IN PRODUCTION!');
    }
    /**
     * Because of how `import`s work, it helps to use `require`s to force
     * things to be loaded *after* the NodeCG context is set.
     */
    require('./obs-data');
    require('./layouts');
    require('./tracker');
    require('./misc');
    require('./mixer');
    require('./streamdeck-buttons');
    require('./companion');
    require('./timer');
    require('./media-box');
    require('./text-to-speech');
    require('./music');
    require('./intermission-player');
    require('./flagcarrier');
    require('./omnibar');
    require('./reader-introduction');
    require('./commercials');
    require('./player-hud');
    require('./server');
    require('./streamlabs-charity');
    require('./intermission-slides');
    require('./therungg');
    return {
        obs: require('./util/obs').default,
        mixer: require('./mixer'),
        config: nodecg.bundleConfig,
    };
};
