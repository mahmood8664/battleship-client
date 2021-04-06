# battleship-client
Battleship game with some changes written by Phaser 3.

In this game you can explore enemy's ground and also move your ships after being discovered by the enemy.
To play this game visit: [http://mamiri.me/battleship](http://mamiri.me/battleship)
You need to run [this server](https://github.com/mahmood8664/battleship-server) project to provide APIs. 
To create docker image run:
```shell
docker build -t battleship-client
```

To run battleship client docker image run:
```shell
docker run --name battleship-client --network network-name --restart always -d battleship-client
```
