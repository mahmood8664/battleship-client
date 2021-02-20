#battleship-client
Battleship game with some changes written by Phaser 3.

In this game you can explore enemy's ground and also move your ships after being discovered by the enemy.
To play this game visit: http://mamiri.me/battleship

To create docker image run:
docker build -t battleship-client

To run battleship client docker image run:

docker run --name battleship-client --network network-name --restart always -d battleship-client