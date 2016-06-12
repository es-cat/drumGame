// We initialising Phaser
// Initialise Phaser
var game = new Phaser.Game(1024, 768, Phaser.AUTO, 'gameDiv');
var cm_checkTap = new com.checkTap(game);
game.global = {
    score: 0,
    showDebug: false,
    combCount: 0,
    point: 0
};


//game.state.add('boot', playState);
game.state.add('menu', menuState);
game.state.add('play', playState);
//game.state.add('end', playState);
// game.state.start('play');

game.state.start('menu');