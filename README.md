# GridWars

Program the mighty Viking warriors of Valhalla.

Warriors start with 2 HP and 1 attack power (AP). This value is increased by 2/1 for every level they gain. Levels are gained by killing other warriors. Required number of kills per new level is 2^(lvl-1).

Valid actions are: move, attack, heal. Heal will restore HP equivalent to the warrior's AP. Move and attack require a valid direction in 2D.

All warriors are mentally aware of the entire map and all other warriors (Psionic powers).

Game rounds occur every 10s at which time all warriors execute their stored actions. Your AI needs to issue a command over the network during this time or your warrior will do nothing.

Seize the glory and rise to the highest kill value.

# Credits

This is a fork of the original Project by Radu Creosteanu
https://github.com/Creosteanu/valhalla

# System capabilities

POST /controller

-   body: {name:'someName'}
-   response: {name:'someName',level:1, health:2, kills:0, position:{x:0,y:0}, id:'someId'}

PUT /controller

-   body: {id:'someId', action:{order:'move', position:{x:0,:y:0}}}
-   response: {name:'someName',level:1, health:2, kills:0, position:{x:0,y:0}, id:'someId', action:{order:'move', position:{x:0,:y:0}}}

Actions:

-   Heal - {order:'heal'}
-   Stop - {order:'stop'}
-   Move - {order:'move', position:{x:0,:y:0}}
-   Attack - {order:'attack', position:{x:0,:y:0}}

An actions position represents the target coordinates relative to your position.
Values less than -1 and above 1 are disregarded.

-   position:{x:0,:y:0} - you
-   position:{x:1,:y:0} - right
-   position:{x:-1,:y:0} - left

GET /controller
Gives list of all Vikings without respective ids - effectively the game map.

Socket io events are emitted for new Vikings and for game ticks.

# Server

Install modules : npm Install
Build react : npm run-script build
Start server : npm run-script start

Server IP: 52.58.199.76 PORT 8080

GET http://52.58.199.76:8080/api/controller

POST http://52.58.199.76:8080/api/controller

PUT http://52.58.199.76:8080/api/controller

# Tips and tricks

1. Use postman to test out the server before making the AI.
2. Dont spam requests
