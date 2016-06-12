
var com = {};
com.checkTap = function (game) {
    var _this = this;
    this.game = game;
    this.check = function (state, note, goodArea, perfectArea, missArea) {
        this.game.physics.arcade.overlap(note, missArea, checkMiss, null, state);
        this.game.physics.arcade.overlap(note, goodArea, checkGood, null, state);
        this.game.physics.arcade.overlap(note, perfectArea, checkPerfect, null, state);
    };
    this.tapAction = {
        good: function () {

        },
        perfect: function () {

        },
        miss: function () {

        }
    };
    this.takeScore = {
        good: function () {

        },
        perfect: function () {

        },
        miss: function () {

        }
    };
    this.effectRender = {
        good: function (note) {
            this.hit();
            note.kill();
        },
        perfect: function (note) {
            this.hit();
            note.kill();
        },
        miss: function (note) {
            game.global.combCount = -1;
            this.miss();
            note.kill();
        }
    };
    function checkGood(note, area) {
        _this.tapAction.good.call(this, note);
        _this.takeScore.good.call(this, note);
        _this.effectRender.good.call(this, note);
        console.log('Good');
    };
    function checkPerfect(note, area) {
        _this.tapAction.perfect.call(this, note);
        _this.takeScore.perfect.call(this, note);
        _this.effectRender.perfect.call(this, note);
        console.log('Perfect');
    };
    function checkMiss(note, area) {
        _this.tapAction.miss.call(this, note);
        _this.takeScore.miss.call(this, note);
        _this.effectRender.miss.call(this, note);
        console.log('miss');
    };
    return this;
};

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


// We create our only state
var playState = {
    preload: function () {
        game.stage.backgroundColor = '#d1d1d1';
        document.body.style.backgroundColor = "#000";
        game.load.spritesheet('musicStage', 'images/music_stage_all.png', 1024, 179);
        game.load.spritesheet('hiteArea', 'images/hite_area_all.png', 123, 123);
        game.load.spritesheet('pointBarIcon', 'images/point_hit_all.png', 72, 72);

        game.load.image('hiteAreaMask', 'images/area_click_mask.png');
        game.load.image('flower', 'images/flower.png');
        game.load.image('flower2', 'images/flower2.png');
        game.load.image('iconLeft', 'images/icon_left_fly.png');
        game.load.image('good', 'images/good.png');
        game.load.audio('beat', ['assets/normal-hitnormal.mp3', 'assets/normal-hitnormal.ogg']);
        game.load.spritesheet('note', 'images/icon_left.png', 91, 91);
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
        //goold
        this.sp_good = game.add.sprite(228, 222, 'good');
        this.sp_good.anchor.setTo(0.5, 0);
        this.sp_good.alpha = 0;

        //連擊數
        this.combLabel = game.add.text(80, 318, game.global.combCount + "", {
            font: '70px Righteous',
            wordWrapWidth: 140,
            wordWrap: true,
            align: "center",
            stroke: '#000000',
            strokeThickness: 6
        });

        this.combLabel.anchor.setTo(0.5, 0.5);

        var grdComb1 = this.combLabel.context.createLinearGradient(0, 0, 0, this.combLabel.height);
        grdComb1.addColorStop(0, '#ff4343');
        grdComb1.addColorStop(1, '#ffb400');
        this.combLabel.fill = grdComb1;

        //pointCount Text
        this.pointLabel = game.add.text(game.world.bounds.topRight.x - 20, game.world.bounds.topRight.y + 130, game.global.point + "", {
            font: '36px Righteous',
            wordWrapWidth: 500,
            wordWrap: true,
            align: "right",
            stroke: '#000000',
            strokeThickness: 6
        });
        this.pointLabel.anchor.setTo(1, 1);

        var grdPoint = this.pointLabel.context.createLinearGradient(0, 0, 0, this.pointLabel.height);
        grdPoint.addColorStop(0, '#f4e71b');
        grdPoint.addColorStop(1, '#8ae242');
        this.pointLabel.fill = grdPoint;

        //pointBar Icon
        this.sp_pointBarIcon = game.add.sprite(game.world.bounds.topRight.x - 56, game.world.bounds.topRight.y + 166, 'pointBarIcon');
        this.sp_pointBarIcon.anchor.setTo(0.5, 0.5);
        this.sp_pointBarIcon.animations.add('pointBarAction', [1, 0], 10);
        //pointBar flower
        this.sp_flower2 = game.add.image(game.world.bounds.topRight.x - 56, game.world.bounds.topRight.y + 166, 'flower2');
        this.sp_flower2.anchor.setTo(0.5, 0.5);
        this.sp_flower2.alpha = 0.5;
        this.sp_flower2.scale = {x: 0, y: 0};


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


        //Musical notes
        //trackin area
        var perfectAreaPoint = {x: this.sp_hiteArea.x, y: this.sp_hiteArea.y};
        var areaJson = [-50, 0, 50, 70, 100, 130];
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
            _trackingArea.fill(_index * 50, _index * 20, 0, 0);
            var _sp_trackingArea = game.add.sprite(x, perfectAreaPoint.y, _trackingArea);
            game.physics.arcade.enable(_sp_trackingArea);
            trackingAreas.push(_sp_trackingArea);
            //0: miss, 1: good, 2: perfect, 3: good, 4: miss
        }
        this.trackingAreas = {};
        this.trackingAreas.good = [trackingAreas[1], trackingAreas[3]];
        this.trackingAreas.perfect = [trackingAreas[2]];
        this.trackingAreas.miss = [trackingAreas[4]];
        this.trackingAreas.recycle = [trackingAreas[0]];
        
        var emit = function(_this){
            setTimeout(function () {
                emitMusicalNotes.call(_this);
                emit(_this);
            }, Math.random() * 600);
        };
        emit(this);
    },
    update: function () {
        //init
        if (this.sp_musicalNotes) {
            this.sp_musicalNotes.forEachAlive(function (item) {
                cm_checkTap.check(this, item, null, null, this.trackingAreas.recycle);
            }, this);
        }
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
        this.sp_pointBarIcon.animations.play('pointBarAction');
        this.sound_beat.play();
        //music note
        if (this.sp_musicalNotes) {
            var x = this.world.width;
            var targetIndex = 0;
            var cLength = this.sp_musicalNotes.children.length;
            for (var i = 0; i < cLength; i++) {
                var _item = this.sp_musicalNotes.children[i];
                if (_item.alive && Math.min(x, _item.x) < x) {
                    x = _item.x;
                    targetIndex = i;
                }
            }
            cm_checkTap.check(this, this.sp_musicalNotes.getAt(targetIndex), this.trackingAreas.good, this.trackingAreas.perfect, this.trackingAreas.miss);
        }
    },
    miss:function(){
        game.global.combCount = 0;
        this.combLabel.text = game.global.combCount;
    },
    hit: function () {
        ++game.global.combCount;
        this.combLabel.text = game.global.combCount;

        game.add.tween(this.combLabel.scale)
                .to({x: 1.3, y: 1.5}, 100, "Linear", false, 0, 0, false)
                .to({x: 1, y: 1}, 100, "Linear", false, 0, 0, false)
                .start();

        game.add.tween(this.sp_flower.scale)
                .to({x: 1, y: 1}, 300, "Linear", false, 0, 0, false)
                .to({x: 0, y: 0}, 100, "Linear", false, 0, 0, false)
                .start();

        game.add.tween(this.sp_flower)
                .to({angle: 180}, 100, "Linear", false, 0, 0, false)
                .to({angle: 0}, 100, "Linear", false, 0, 0, false)
                .start();


        game.add.tween(this.sp_good.scale)
                .to({x: 1.3, y: 1.5}, 100, "Linear", false, 0, 0, false)
                .to({x: 1, y: 1}, 100, "Linear", false, 0, 0, false)
                .start();

        game.add.tween(this.sp_good)
                .to({y: 208, alpha: 1.0}, 100, "Linear", false, 0, 0, false)
                .to({y: 228, alpha: 0}, 100, "Linear", false, 0, 0, false)
                .start();

        game.add.tween(this.sp_flower2.scale)
                .to({x: 1, y: 1}, 300, "Linear", false, 0, 0, false)
                .to({x: 0, y: 0}, 100, "Linear", false, 0, 0, false)
                .start();

        game.add.tween(this.sp_flower2)
                .to({angle: 180}, 100, "Linear", false, 0, 0, false)
                .to({angle: 0}, 100, "Linear", false, 0, 0, false)
                .start();

        this.getPoint();

    },
    getPoint: function (type, point) {
        //type 得分的類型
        //point 給幾分：為連擊或加分作準備

        //icon 往右上角飛的特效
        var durTime = 500;//duration
        var iconLeft = game.add.image(228, 298, 'iconLeft');
        iconLeft.anchor.setTo(0.5, 0.5);

        game.add.tween(iconLeft.scale)
                .to({x: 0.8, y: 0.8}, durTime, "Linear", false, 0, 0, false)
                .start();

        var liTween = game.add.tween(iconLeft).to({
            x: [game.world.centerX, game.world.bounds.topRight.x - 56],
            y: [20, game.world.bounds.topRight.y + 166]
        }, durTime);
        liTween.interpolation(function (v, k) {
            return Phaser.Math.bezierInterpolation(v, k);
        });
        liTween.repeat(0);
        liTween.start();

        liTween.onComplete.add(function () {
            iconLeft.destroy();
        }, this);

        //加分
        ++game.global.point;
        this.pointLabel.text = game.global.point;

        game.add.tween(this.pointLabel.scale)
                .to({x: 1, y: 1.2}, 100, "Linear", false, 0, 0, false)
                .to({x: 1, y: 1}, 100, "Linear", false, 0, 0, false)
                .start();
    }
};

var emitMusicalNotes = function () {
    if (!this.sp_musicalNotes) {
        this.sp_musicalNotes = game.add.group();
        this.sp_musicalNotes.enableBody = true;
        this.sp_musicalNotes.createMultiple(30, 'note');
    }

    //musical notes
    var sp_note = this.sp_musicalNotes.getFirstDead();
    if (!sp_note) {
        return;
    }

    //this.sp_musicalNotes = this.sp_musicalNotes || [];
    //var sp_note = game.add.sprite(1000, 290, 'note');
    sp_note.reset(game.world.width, 290);
    sp_note.anchor.setTo(0.5, 0.5);
    sp_note.body.setSize(1, 1);
    sp_note.enableBody = true;
    game.physics.arcade.enable(sp_note);
    sp_note.body.velocity.x = -500;
    sp_note.outOfBoundsKill = true;
    //this.sp_musicalNotes.push(sp_note);
};


//game.state.add('boot', playState);
//game.state.add('menu', playState);
game.state.add('play', playState);
//game.state.add('end', playState);
game.state.start('play');
