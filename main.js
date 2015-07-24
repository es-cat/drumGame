// We initialising Phaser
// Initialise Phaser
var game = new Phaser.Game(1024, 768, Phaser.AUTO, 'gameDiv');
game.global = {
    score: 0,
    showDebug:false,
    commb:0
};


// We create our only state
var playState = {
    preload: function () {

    	game.stage.backgroundColor = '#d1d1d1';
    	document.body.style.backgroundColor = "#000";

    	game.load.spritesheet('musicStage', '/game-assets/music_stage_all.png',1024,179);
    	game.load.spritesheet('hiteArea', '/game-assets/hite_area_all.png',123,123);
    	game.load.image('hiteAreaMask', '/game-assets/area_click_mask.png');
    	game.load.image('flower', '/game-assets/flower.png');
        game.load.audio('beat', ['game-assets/normal-hitnormal.mp3', 'assets/normal-hitnormal.ogg']);


    },
	create: function() { 
		game.physics.startSystem(Phaser.Physics.ARCADE);

		//節拍的佈景
		this.sp_musicStage = game.add.sprite(0, 226, 'musicStage');
		this.sp_musicStage.anchor.setTo(0, 0);
		this.sp_musicStage.animations.add('musicStageBeat', [1,0], 30);
		//打擊區
		this.sp_hiteArea = game.add.sprite(167, 236, 'hiteArea');
		this.sp_hiteArea.anchor.setTo(0, 0);
		this.sp_hiteArea.animations.add('hiteAreaBeat', [1,0], 30);
		//打擊區煙火
		this.sp_flower = game.add.image(228, 298, 'flower');
		this.sp_flower.anchor.setTo(0.5, 0.5);
		this.sp_flower.alpha = 0.5;
		this.sp_flower.scale = {x:0,y:0};

		//連擊數
		this.combLabel = game.add.text(10, 318, '000', {
            font: '73px PassionOne',
            fill: '#000000'
        });

        this.combLabel.anchor.setTo(0, 0.5);



		//this.sp_musicStage.setSize(123, 123, 0, 0);


		game.physics.enable(this.sp_hiteArea, Phaser.Physics.ARCADE);

        game.scale.pageAlignHorizontally = true;
        game.scale.pageAlignVertically = true;

        //voice
        this.sound_beat = game.add.audio('beat');

        //input
        this.cursor = game.input.keyboard.createCursorKeys();
        game.input.keyboard.addKeyCapture([Phaser.Keyboard.UP, Phaser.Keyboard.DOWN, Phaser.Keyboard.LEFT, Phaser.Keyboard.RIGHT]);


        //event
        this.cursor.left.onDown.add(this.beat, this);
        this.cursor.left.onDown.add(this.hit, this);

		

	},
	update: function() {
		//init
	},
	render: function(){
		if (game.global.showDebug){
		    game.debug.bodyInfo(this.sp_hiteArea, 32, 32);
		    game.debug.body(this.sp_hiteArea);
		}
	},
	beat: function() {
		this.sp_musicStage.animations.play('musicStageBeat');
		this.sp_hiteArea.animations.play('hiteAreaBeat');
		this.sound_beat.play();

	},
	hit: function(){

		game.add.tween(this.sp_flower.scale)
		.to({x: 1,y:1}, 100, "Linear", false, 0 , 0 , false)
		.to({x: 0,y:0}, 100, "Linear", false, 0 , 0 , false)
		.start();

		game.add.tween(this.sp_flower)
		.to({angle: 90}, 100, "Linear", false, 0 , 0 , false)
		.to({angle: 0}, 100, "Linear", false, 0 , 0 , false)
		.start();
	}
};


game.state.add('play', playState);
game.state.start('play');
