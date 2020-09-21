# Gemini
Aesthetic now playing screen for Spotify

![screenshot](https://i.imgur.com/HOda3vb.png)
## Use it as a mini-player!
![screenshot](https://i.imgur.com/SrHmQDl.png)
## or as a full-screen display!
![screenshot](https://i.imgur.com/rBw86rZ.jpg)

# Installation
`yarn install` or `npm install`, but yarn is recommended for building the app.

# Setup
`yarn start` or `npm start`

If you would like to use your own Client ID and secret,

# Usage
While a track is playing, Gemini will update to show the current song and artist. 

Should you need to sign in again, pressing `Ctrl+S` will take you back to that screen.

## Keyboard Controls
- `Space` or `K`: Play/Pause
- `Left arrow key` or `J`: Previous track
- `Right arrow key` or `L`: Next track
- `Esc`: Exit out of fullscreen

# Building
`yarn dist`

Uses [Gemini-Authorization](https://github.com/Gabe-H/Gemini-Authorization) hosted on Heroku by default. Feel free to use it's source code for further customization as well. If you would rather prefer to not use an online authentication, you can do it locally by creating a file named `.env`, and set the Client parameters as
```
CLIENT_ID=123456
CLIENT_SECRET=abcdefg
```

Recommeneded to run on macOS as it can compile a Windows, Mac, and Linux version. If you only want to compile for a specific operating system, change `dist` in `package.json`. Refer to the `electron-builder` arguments [here](https://www.electron.build/cli).

# To Do
Please check out our [projects page](https://github.com/Gabe-H/Gemini/projects/2)! Please open an issue if you have any suggestions!

# Font License
We have explicit permission from the creator of the Forma DJR Font, David Jonathan Ross, to use in Gemini. If you want to develop and fork Gemini, please do not install the fonts on your system and use it for your own use. It is against the license and you should buy the [font](https://djr.com/forma/) for your own personal use.

# [Our favorite songs and albums!](https://open.spotify.com/playlist/6ILAg2eGBzvN3loVQLI9O5?si=oXj4PnPgSZyLLTBJU1fQpg)
- [Lose - NIKI](https://open.spotify.com/track/7rgjkzZBhBjObaYsvq8Ej0?si=c2DyCWX_QDyRHToxpOzV5A)
- [Djesse Vol. 3 - Jacob Collier](https://open.spotify.com/album/33cj3kzLqVOg9zvy69Wrc8?si=pCUxII-9Q_mYzyDzvVY3rA)
- [Switchblade - NIKI](https://open.spotify.com/track/6Ve2gwTaMxTgKMuAcHbwcH?si=YcSJi59cQL-aCBRLJw4wfg)
- [7 rings - Ariana Grande](https://open.spotify.com/track/6ocbgoVGwYJhOv1GgI9NsF?si=ULM0YYAqTCyD02T9U2hnyA)
- [urs - NIKI](https://open.spotify.com/track/50oEtTUNlce4TuZXQoJzXW?si=NmvfHvWaQv2IdD_BtC8Twg)
- [Stuck with U - Ariana Grande and Justin Bieber](https://open.spotify.com/track/4HBZA5flZLE435QTztThqH?si=DyRI2hgvQhiOjEphCCPcSw)
- [Trying - Luna Li](https://open.spotify.com/track/6JOcqL8v344EarvtlQZ3km?si=2evfA1cTSsy8W0fFJQlNnw)
- [Indigo - NIKI](https://open.spotify.com/track/1sOr5OXjbukTzBDgmvd6Fa?si=FhkQLdrLRJmal0TDCjGuag)
- [All I Want - Olivia Rodrigo](https://open.spotify.com/track/1v6svH1Fyx9C1nIt1mA2DT?si=RZTjLnkDRHW48UljXYY3sw)
