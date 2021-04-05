# esa-layouts

> The on-screen graphics used during European Speedrunner Assembly's "marathon" events.

*This is a bundle for [NodeCG](https://nodecg.dev); if you do not understand what that is, we advise you read their website first for more information.*

***This documentation isn't fully complete and may have errors, but intends to be as correct as possible.***

This is a [NodeCG](https://nodecg.dev) v1.8.1 bundle. You will need to have NodeCG v1.8.1 or above installed to run it. It also requires you to install the [nodecg-speedcontrol](https://github.com/speedcontrol/nodecg-speedcontrol) bundle (of which you may also need to install the latest changes instead of the most stable release).

## Installation

You will need [Node.js](https://nodejs.org) (14.x LTS tested) and [git](https://git-scm.com/) installed to install NodeCG, then see the [NodeCG documentation](https://www.nodecg.dev/docs/installing) on how to install that. I also suggest installing `nodecg-cli`; information on that is also on the documentation just linked (**the guide below will assume you have done this!**). You may also need to install the appropriate build tools for whichever platform you are running on; for example if you are on Windows you can either install it while installing Node.js, or using [windows-build-tools](https://github.com/felixrieseberg/windows-build-tools).

Next, clone the `build` branch of this repository into the NodeCG `bundles` folder and install the dependencies:
> ```
> cd bundles
> git clone https://github.com/esamarathon/esa-layouts.git --branch build
> cd esa-layouts
> npm install --production
> ```

You will probably also want a default configuration you can fill in, which can be created using:
> `nodecg defaultconfig`.

Then, to get the most recent changes for [nodecg-speedcontrol](https://github.com/speedcontrol/nodecg-speedcontrol), clone the `build` branch and install dependencies, similar to above:
> ```
> cd ..
> git clone https://github.com/speedcontrol/nodecg-speedcontrol.git --branch build
> cd nodecg-speedcontrol
> npm install --production
> ```

## Usage

*Not everything you can set is documented here; if you're an advanced user we advise you take a look at the included [configschema.json](configschema.json) file.*

This bundle heavily relies on the [obs-websocket](https://github.com/Palakis/obs-websocket) plugin, so make sure you have this installed (custom address/port and password can be specified in the bundle's config if needed).

This bundle also heavily relies on information from a RabbitMQ server, and an instance of our fork of the [GamesDoneQuick donation tracker](https://github.com/esamarathon/donation-tracker).

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

This bundle can interface with [foobar2000](https://www.foobar2000.org/) using the [beefweb](https://github.com/hyperblast/beefweb) plugin. Set up foobar2000 however you want it to play music (we use a long playlist on shuffle, and set a fade in/out on pause), make sure the correct username/password are set in the configuration fiole, and this bundle with automatically play music when needed. It will only play if the scene name ends in `[M]`, for example, `Intermission [M]`.

### Automatic Twitch Commercials

This bundle no longer triggers any commercials, this is now done by a separate bundle, [esa-commercials](https://github.com/esamarathon/esa-commercials).

### Featured Channels Bridge

This bundle no longer handles using this (if it was needed), this is now done by a separate bundle, [esa-featuredchannels](https://github.com/esamarathon/esa-featuredchannels).

## Other Information

### Events Used For

Here's a list of events this bundle has been used at so far, most recent first.

* ESA Winter 2021
* UKSG Winter 2021
* UKSG Autumn 2020
* ESA Summer 2020
* UKSG Summer 2020
* ESA Corona Relief
* ESA Together
* UKSG Spring 2020
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
