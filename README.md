# Epoch of Emperors
Incoming Age of Empires clone written from scratch in pure* javascript (es6/es7)

<sub>\* - to be precise, first prototype was built with konva.js library although it was replaced by a faster, handcrafted solution, better suited for this project. See merge of [konva-removal](https://github.com/andrzejkrecicki/epoch-of-emperors/commit/050f47664fb566fc560c24deca03a7c37f63d434) branch for more info.</sub>


## Demo
Link bellow contains side-by-side comparison (a.k.a. "mine is better than yours") with original Age of Empires. Mine on the left, original on the right - do not confuse it :) Please note that the video presents incomplete game with some features still missing or substituted by temporary solutions.

**11th of April 2018** https://drive.google.com/open?id=15zC12Bub5TUwCCOM4rIxyZE8SNgExk50

## Running
1. Clone this repository
2. ```npm install```
3. ```npm run watch```
4. Run the following command after first clone and every time images got modified:
    ```
    python scripts\bundle_images.py img dist/gfx.bin dist/gfx.json
    ```
5. Run temporary server:
    ```
    node scripts\server.js
    ```
6. Open the following url in your browser (currently Google Chrome is the only officially supported browser):
    ```
    http://localhost:8000/index.html
    ```
7. Have DevTools opened to see console errors if something goes wrong.

## License
**AGPL-3.0**

Modified version of this code must include link to this repository in an easily visible place.
