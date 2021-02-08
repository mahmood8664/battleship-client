# battleship-client
Battleship game with some extra features written by Phaser 3.

In this game you can explore enemy's ground and also move your ships after being discovered by enemy.
To play this game visit: http://battleship.mamiri.me/

To create docker image run:
docker build -t battleship-client

To run battleship client docker image run:

docker run --name battleship-client --network battleship --restart always -v /root/projects/battleship-client/nginx/log:/var/log/nginx -d battleship-client