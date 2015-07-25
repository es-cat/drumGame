// We initialising Phaser
// Initialise Phaser
var game = new Phaser.Game(1024, 768, Phaser.AUTO, 'gameDiv');
game.global = {
    score: 0,
    showDebug: false,
    commb: 0
};


// We create our only state
var playState = {
    preload: function () {

        game.stage.backgroundColor = '#d1d1d1';
        document.body.style.backgroundColor = "#000";

        game.load.spritesheet('musicStage', 'game-assets/music_stage_all.png', 1024, 179);
        game.load.spritesheet('hiteArea', 'game-assets/hite_area_all.png', 123, 123);
        game.load.image('hiteAreaMask', 'game-assets/area_click_mask.png');
        game.load.image('flower', 'game-assets/flower.png');
        game.load.audio('beat', ['game-assets/normal-hitnormal.mp3', 'assets/normal-hitnormal.ogg']);
        game.load.spritesheet('note', 'game-assets/icon_left.png', 91, 91);



    },
    create: function () {
        game.physics.startSystem(Phaser.Physics.ARCADE);

        //節拍的佈景
        this.sp_musicStage = game.add.sprite(0, 226, 'musicStage');
        this.sp_musicStage.anchor.setTo(0, 0);
        this.sp_musicStage.animations.add('musicStageBeat', [1, 0], 30);
        //打擊區
        this.sp_hiteArea = game.add.sprite(167, 236, 'hiteArea');
        this.sp_hiteArea.anchor.setTo(0, 0);
        this.sp_hiteArea.animations.add('hiteAreaBeat', [1, 0], 30);
        //打擊區煙火
        this.sp_flower = game.add.image(228, 298, 'flower');
        this.sp_flower.anchor.setTo(0.5, 0.5);
        this.sp_flower.alpha = 0.5;
        this.sp_flower.scale = {x: 0, y: 0};

        //連擊數
        this.combLabel = game.add.text(10, 318, '000', {
            font: '73px PassionOne',
            fill: '#000000'
        });

        this.combLabel.anchor.setTo(0, 0.5);



        //this.sp_musicStage.setSize(123, 123, 0, 0);


        game.physics.enable(this.sp_hiteArea, Phaser.Physics.ARCADE);
        game.physics.startSystem(Phaser.Physics.ARCADE);

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

        //Musical notes

        //trackin area
        var perfectAreaPoint = {x: this.sp_hiteArea.x, y: this.sp_hiteArea.y};
        var areaJson = [-50, 0, 40, 80, 120, 200];
        var trackingAreas = [];
        for (var _index in areaJson) {
            var x = 0, width = 0;
            _index = Number(_index);
            if (_index < areaJson.length - 1) {
                x = perfectAreaPoint.x + areaJson[_index];
                width = areaJson[_index + 1] - areaJson[_index];
            }
            else {
                break;
            }
            var _trackingArea = game.add.bitmapData(width, 150);
            _trackingArea.fill(_index * 50, _index*20, 0, 0.8);
            var _sp_trackingArea = game.add.sprite(x, perfectAreaPoint.y, _trackingArea);
            game.physics.arcade.enable(_sp_trackingArea);
            trackingAreas.push(_sp_trackingArea);
            //0: miss, 1: good, 2: perfect, 3: good, 4: miss
        }
        this.trackingAreas = {};
        this.trackingAreas.good = [trackingAreas[1],trackingAreas[3]];
        this.trackingAreas.perfect = [trackingAreas[2]];
        this.trackingAreas.miss = [trackingAreas[4]];
        this.trackingAreas.recycle = [trackingAreas[0]];
        (function (_this) {
            setInterval(function () {
                emitMusicalNotes.call(_this);
            }, 1000);
        })(this);
    },
    update: function () {
        //init
        checkTap.call(this, this.sp_musicalNotes, null, null,  this.trackingAreas.recycle);
    },
    render: function () {
        if (game.global.showDebug) {
            game.debug.bodyInfo(this.sp_hiteArea, 32, 32);
            game.debug.body(this.sp_hiteArea);
        }
    },
    beat: function () {
        this.sp_musicStage.animations.play('musicStageBeat');
        this.sp_hiteArea.animations.play('hiteAreaBeat');
        this.sound_beat.play();

        checkTap.call(this, this.sp_musicalNotes, this.trackingAreas.good, this.trackingAreas.perfect, this.trackingAreas.miss);
    },
    hit: function () {

        game.add.tween(this.sp_flower.scale)
                .to({x: 1, y: 1}, 100, "Linear", false, 0, 0, false)
                .to({x: 0, y: 0}, 100, "Linear", false, 0, 0, false)
                .start();

        game.add.tween(this.sp_flower)
                .to({angle: 90}, 100, "Linear", false, 0, 0, false)
                .to({angle: 0}, 100, "Linear", false, 0, 0, false)
                .start();
    }
};

var emitMusicalNotes = function () {
    //musical notes
    this.sp_musicalNotes = this.sp_musicalNotes || [];
    var sp_note = game.add.sprite(1000, 290, 'note');
    game.physics.arcade.enable(sp_note);
    sp_note.anchor.setTo(0.5, 0.5);
    sp_note.enableBody = true;
    sp_note.body.velocity.x = -500;
    sp_note.outOfBoundsKill = true;
    sp_note.body.setSize(1, 1);
    this.sp_musicalNotes.push(sp_note);
};

var checkTap = function (note, goodArea, perfectArea, missArea) {
    game.physics.arcade.overlap(note, missArea, checkTap.checkMiss, null, this);
    game.physics.arcade.overlap(note, goodArea, checkTap.checkGood, null, this);
    game.physics.arcade.overlap(note, perfectArea, checkTap.checkPerfect, null, this);
};
checkTap.tapAction = {
    good: function () {

    },
    perfect: function () {

    },
    miss: function () {

    }
};
checkTap.takeScore = {
    good: function () {

    },
    perfect: function () {

    },
    miss: function () {

    }
};
checkTap.effectRender = {
    good: function (note) {
        note.kill();
    },
    perfect: function (note) {
        note.kill();
    },
    miss: function (note) {
        note.kill();
    }
};
checkTap.checkGood = function (note, area) {
    checkTap.tapAction.good.call(this, note);
    checkTap.takeScore.good.call(this, note);
    checkTap.effectRender.good.call(this, note);
    console.log('Good');
};
checkTap.checkPerfect = function (note, area) {
    checkTap.tapAction.perfect.call(this, note);
    checkTap.takeScore.perfect.call(this, note);
    checkTap.effectRender.perfect.call(this, note);
    console.log('Perfect');
};
checkTap.checkMiss = function (note, area) {
    checkTap.tapAction.miss.call(this, note);
    checkTap.takeScore.miss.call(this, note);
    checkTap.effectRender.miss.call(this, note);
    console.log('miss');
};

game.state.add('play', playState);
game.state.start('play');
