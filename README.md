# Installation
### https://ivansolontsov.github.io/minesweeper/
What are you need to have:
* git
* node.js
* npm


1. Download the repository
```
git clone https://github.com/ivansolontsov/minesweeper.git
```
2. Move to repository path
```
cd minesweeper
```
3. Install Packages
```
npm install
```

3. Start the project, web app will be available on your https://localhost:3000/ by default
```
npm start
```

## Rules

* On the left, there is a mine counter from 40 to zero, on the right, a timer.
* Mines are randomly placed;
* The first click should never be on a mine;
* If there are other fields nearby without mines, they will automatically open when a field is opened.
* The right mouse button places a flag - marking a place where a mine is suspected;
* If you right-click on a flag, it turns into a question mark. Another right-click removes the mark.
* Clicking on the smiley face restarts the game;
* The frightened smiley face appears when the user has clicked on a field but has not released the mouse button yet;
* After losing, the smiley face changes to a sad one, and the minefield is revealed to the user;
* After the user has opened all fields except for the mines, the smiley face puts on sunglasses, and the timer stops.
