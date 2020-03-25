# esa-layouts

> The on-screen graphics used during European Speedrunner Assembly (and other relevant) events.

*This is a bundle for [NodeCG](https://nodecg.com/); if you do not understand what that is, we advise you read their website first for more information.*

***This documentation isn't fully complete, although all information here is accurate for `master` branch at least.***

This is a [NodeCG](https://nodecg.com) v1 bundle. You will need to have NodeCG v1 or above installed to run it. It also requires you to install the [nodecg-speedcontrol](https://github.com/speedcontrol/nodecg-speedcontrol) bundle.

## Usage

*Not everything you can set is documented here; if you're an advanced user we advise you take a look at the included [configschema.json](configschema.json) file.*

This bundle heavily relies on the [obs-websocket](https://github.com/Palakis/obs-websocket) plugin, so make sure you have this installed (custom address/port and password can be specified in the bundle's config if needed).

This bundle also heavily relies in information from a RabbitMQ server, and an instance of the [GamesDoneQuick donation tracker](https://github.com/GamesDoneQuick/donation-tracker).

### Stream Deck Plugin

Included with this bundle is a plugin for the Elgato Stream Deck software that can be used by various crew members during events. Once you have the Stream Deck software installed, you can install the plugin by running the file `com.esamarathon.streamdeck.streamDeckPlugin` in the `streamdeck-plugin/Release` directory. Currently, you need to set the actions up yourself in the software, so it can easily be customised on the fly.

### FlagCarrier Configuration

You will need to install the [speedcontrol-flagcarrier](https://github.com/speedcontrol/speedcontrol-flagcarrier) bundle to use this part, along with using one of the FlagCarrier applications to set them.

**Hosts (the ones on camera):**
- group_id: `hosts`
- positions: `left,midleft,middle,midright,right`

### Text-To-Speech Donations

This can be enabled via the config, controlled via Stream Deck buttons available in the included extension, and both graphics files `tts.html` and `omnibar.html` will play them when requested. You will need to set a specific URL for the `voiceAPI` setting in the config though, so unless you know this it's somewhat useless, sorry.

### "Featured Channels" Twitch Extension

This bundle can hijack the [FrankerFaceZ](https://www.frankerfacez.com/) featured channels integration in the nodecg-speedcontrol bundle and use it to also set the channels on the ["Featured Channels" Twitch extension](https://www.twitch.tv/ext/3zorofke3r7bu8pd0mb7s86qtfrgzj); enable this in the config an supply the token from the extension settings on Twitch.

### Music Player

A browser based music player has been included; the graphic named `music-player.html` must be added into *all* of your OBS scenes to correctly be paused/resumed and correctly fade in/out when needed. It will only play if the scene name ends in `[M]`, for example, `Intermission [M]`. Music tracks can be added via the "Assets" tab in NodeCG under "Music Tracks".

### Automatic Twitch Commercials

This bundle no longer triggers any commercials, this is now done by a separate bundle, [esa-commercials](https://github.com/esamarathon/esa-commercials).

### Featured Channels Bridge

If needed, this bundle can interface with an instance of the [featured-channels-bridge](https://github.com/esamarathon/featured-channels-bridge) script, if settings are specified in the config.

## Other Information

### Events Used For

Here's a list of events this bundle has been used at so far, most recent first.

* ESA Winter 2020
* UKSG Winter 2020
* ESA @ Malmö Vinterspelen 2019
* ESA @ DreamHack Winter 2019
* UKSG Autumn 2019
* ESA Summer 2019 (including some streams on [SpeedGaming](https://www.twitch.tv/speedgaming) during the event).
* UKSG Summer 2019

### Previous Bundles

Here's a list of previous bundles that used to fulfil the purpose of this one, when we kept making new repositories for most of them.

* [esaw19-layouts](https://github.com/esamarathon/esaw19-layouts)
  * ESA Winter 2019
  * ESA @ TwitchCon Europe 2019
* [esas18-layouts](https://github.com/esamarathon/esas18-layouts)
  * ESA Summer 2018
  * UKSG Fall 2018 
  * ESA Movember
  * UKSG Winter 2019
  * UKSG Spring 2019
* [esaw18-layouts](https://github.com/esamarathon/esaw18-layouts)
  * ESA Winter 2018
* [esa17-layouts](https://github.com/esamarathon/esa17-layouts)
  * ESA 2017

### Credits

* Country flags sourced from [speedrun.com](https://www.speedrun.com/).
* [clip.ts](src/graphics/_misc/clip.ts), modified from a version originally written by [Hoishin](https://github.com/hoishin).
