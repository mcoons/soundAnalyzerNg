
# SoundAnalyzerNg

An MP3 player with customizable 3D interactive visuals wrapped in Angular.
[soundanalyzer.michaelcoons.tech](https://soundanalyzer.michaelcoons.tech/)

## Why I built this application

I have an extensive MP3 collection dating back decades and repeated changes with iTunes and Apple Music over the years just made for a bad user experience playing non-purchased music.  I was learning Angular and playing around with the 3D library Babylon.js so decided to write this application combining the two so I could listen to my music without hassle as well as see any cool visuals that I could dream up.

## General Implementation Description

* Utilizes Angular, Typescript and Babylon.js
* Utilizes the babylon.js 3D library for the 3D visuals
* A 2D canvas is used for the 2D bars and graphs as an overlay on top of the 3D canvas.
* Visuals are defined as their own classes.
* Custom data sets are created using frequency banding to obtain even sampling over the full frequency range.

## Current Issues

* The CPU power necessary makes it hard for most mobile devices so it is currently not very mobile friendly.

## Future Additions/Fixes when I get time

* Eliminate the older 576 sized data set being used by older visuals replacing it with the smaller 256 sized data set.  This should help with optimization.
* Try to come up with a mobile friendly UI.  Possibly eliminationg some options.
* **CREATE AND ADD MORE VISUALS!**
