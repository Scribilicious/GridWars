# Grid Wars!

Conjure the mightiest monsters of CHECK24!

Monsters start with 2 HP and 1 max attack power (AP). These values are increased by 2/1 for every level they gain. Levels are gained by killing other monsters. Required number of kills per new level is 2^(lvl-1).

On attack, a monster will cause damage that is a random value between 0 and its AP.

Valid actions are: move, attack, heal. Heal will restore  1 HP. Move and attack require a valid direction in 2D.

All monsters are mentally aware of the entire map and all other monsters (Psionic powers).

Game rounds occur every 1s at which time all monsters execute their stored actions. Your AI needs to issue a command over the network during this time or your monster will do nothing.
 
 The server will execute the last command it received for each monster.

Seize the glory and rise to the highest kill value!

# Credits

This is a fork of the original Project by Radu Creosteanu
https://github.com/Creosteanu/valhalla

# System capabilities

**Add a Monster:**
POST /controller

-   body: {name:'someName'}
-   response: {name:'someName',level:1, health:2, kills:0, position:{x:0,y:0}, id:'someId'}

**Make an action for a specific monster:**
PUT /controller

-   body: {id:'someId', action:{order:'move', position:{x:0,:y:0}}}
-   response: {name:'someName',level:1, health:2, kills:0, position:{x:0,y:0}, id:'someId', action:{order:'move', position:{x:0,:y:0}}}

Actions:

-   Heal - {order:'heal'}
-   Stop - {order:'stop'}
-   Move - {order:'move', position:{x:0,:y:0}}
-   Attack - {order:'attack', position:{x:0,:y:0}}

An actions position represents the target coordinates relative to your position.
Values less than -1 and above 1 are disregarded. Diagonal move and attack is possible.

-   position:{x:0,:y:0} - you
-   position:{x:1,:y:0} - right
-   position:{x:-1,:y:0} - left

**Get Map Data:** GET /controller

Gives list of all Monsters without respective ids and all the obstacles - effectively the game map.
Beware that there are obstacles, which don't block but infer 1 HP damage (cactus).


# Server

Install modules : npm Install
Build react : npm run-script build
Start server : npm run-script start

Server: http://gollum.check24tech.de:3000/

GET http://gollum.check24tech.de:3000/api/controller

POST http://gollum.check24tech.de:3000/api/controller

PUT http://gollum.check24tech.de:3000/api/controller

# Socket
Socket events are emitted for new monsters and for game ticks.

ws://gollum.check24tech.de:3001/

# Tips and tricks

1. Use postman to test out the server before making the AI.
2. Dont spam requests
