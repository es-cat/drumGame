var game = new Phaser.Game(1024, 768, Phaser.AUTO, 'gameDiv');
game.global = {
    score: 0,
    showDebug: false,
    combCount: 0,
    point: 0
};

var menuState = {
	preload:function(){
		game.stage.backgroundColor = '#84ccc9';

        game.load.spritesheet('leftKey', 'images/menu_key_left.png', 56, 58);
        game.load.spritesheet('rightKey', 'images/menu_key_right.png', 56, 58);

        game.load.image('logo', 'images/menu_logo_text.png');
        game.load.image('bate', 'images/menu_bate.png');

		game.load.spritesheet('noteL', 'images/icon_left.png', 91, 91);
		game.load.spritesheet('noteR', 'images/icon_right.png', 91, 91);

		game.load.audio('beat', ['assets/normal-hitnormal.mp3', 'assets/normal-hitnormal.ogg']);

	},
	layout:function(){

	},
	create:function(){
		//logo
		var logo = game.add.image(game.world.centerX,game.world.centerY,'logo');
		logo.anchor.setTo(0.5,0.5);
		logo.y = game.world.centerY - logo.height;

		var bate = game.add.image(logo.width/2,0,'bate');
		bate.anchor.setTo(0.5,1);
		bate.y = -1*bate.height-15;

		this.gLogo = new game.add.group(logo);
		this.gLogo.add(bate);

		//左邊的圖示
		var noteLeft = game.add.sprite(game.world.centerX,game.world.centerY-40,'noteL');
		noteLeft.anchor.setTo(0.5,0);
		noteLeft.x = game.world.centerX-noteLeft.width/2-5;

		this.noteKeyLeft = game.add.sprite(0,noteLeft.height+10,'leftKey');
		this.noteKeyLeft.anchor.setTo(0.5,0);
		this.noteKeyLeft.animations.add('beatAction', [1, 0], 30);

		this.gLeft = new game.add.group(noteLeft);
		this.gLeft.add(this.noteKeyLeft);

		//右邊的圖示
		var noteRight = game.add.sprite(game.world.centerX,game.world.centerY-40,'noteR');
		noteRight.anchor.setTo(0.5,0);
		noteRight.x = game.world.centerX+noteRight.width/2+5;

		this.noteKeyRight = game.add.sprite(0,noteRight.height+10,'rightKey');
		this.noteKeyRight.anchor.setTo(0.5,0);
		this.noteKeyRight.animations.add('beatAction', [1, 0], 30);

		this.gRight = new game.add.group(noteRight);
		this.gRight.add(this.noteKeyRight);

		//聲音
		this.sound_beat = game.add.audio('beat');

		//keyboard
        this.cursor = game.input.keyboard.createCursorKeys();
        game.input.keyboard.addKeyCapture([Phaser.Keyboard.UP, Phaser.Keyboard.DOWN, Phaser.Keyboard.LEFT, Phaser.Keyboard.RIGHT]);
        this.cursor.left.onDown.add(this.enterGame, this);
        this.cursor.right.onDown.add(this.enterGame, this);
		// this.cursor = game.input.keyboard.createCursorKeys();
		// game.input.keyboard.addKeyCapture([Phaser.Keyboard.UP, Phaser.Keyboard.DOWN, Phaser.Keyboard.LEFT, Phaser.Keyboard.RIGHT]);



	},
	enterGame:function(){
		if(this.cursor.left.isDown ){
        	this.noteKeyLeft.animations.play('beatAction');
		}else if(this.cursor.right.isDown ){
        	this.noteKeyRight.animations.play('beatAction');
		}else {
			return;
		}

    	this.sound_beat.play();

	},
	update:function(){
		// this.enterGame();
	}
};


game.state.add('menu', menuState);
game.state.start('menu');