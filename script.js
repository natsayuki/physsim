
var game = new Phaser.Game(800, 600, Phaser.CANVAS, 'phaser-example', { preload: preload, create: create, update: update, render: render });

let box;
let ramp;
let bmd;
let cursors;

let onRamp = false;
let go = false;
let startX = 50;
let startY = 300;
let lineColor = 'rgb(255, 255, 0)'

let gravity = 9.81;
let accel = 250;
let angle = 20;
let restitution = 0;
// in grams
let mass = 5;
let weight;
let fN;
let fD;
let maxVelX = 0;
let maxVelY = 0;

let velXText
let velYText
let maxVelXText
let maxVelYText
let touchingText
let angleText
let massText

function preload() {

	game.load.image('box', 'box.png');
	game.load.image('ramp', 'box.png');

}

function create() {

	game.physics.startSystem(Phaser.Physics.P2JS);
	game.stage.backgroundColor = '#124184';
	game.physics.p2.gravity.y = gravity * 100;
  game.physics.p2.restitution = restitution;

  bmd = game.add.bitmapData(800, 600);
  bmd.context.fillstyle = '#ffffff';
  let bg = game.add.sprite(0, 0, bmd);

	box = game.add.sprite(startX, startY, 'box');
  box.scale.setTo(.2, .2);
  game.physics.p2.enable(box);
  box.body.angle = 90;
  box.body.static = true;


  ramp = game.add.sprite(1, 400, 'ramp');
  ramp.scale.setTo(8, .2);
  game.physics.p2.enable(ramp);
  ramp.body.static = true;
  ramp.body.angle = angle;

	function checkRamp(body){
		// console.log(body.sprite.key);
		if(body && body.sprite.key == 'ramp') onRamp = true;
		else onRamp = false;
	}

  box.body.onBeginContact.add(checkRamp, this);
  box.body.onEndContact.add(checkRamp, this);

  cursors = game.input.keyboard.createCursorKeys();

	velXText = game.add.text(450, 70, "Vel X: 0")
	velYText = game.add.text(600, 70, "Vel Y: 0");
	maxVelXText = game.add.text(400, 108, "Max Vel X: 0");
	maxVelYText = game.add.text(600, 108, "Max Vel Y: 0");
	touchingText = game.add.text(400, 146, "Touching: ");
	angleText = game.add.text(650, 146, "Angle: ");
	massText = game.add.text(400, 184, "Mass: ");

  let goText = game.add.text(500, 32, "GO");
  goText.inputEnabled = true;
  goText.events.onInputDown.add(start, this);

  let resetText = game.add.text(575, 32, "RESET");
  resetText.inputEnabled = true;
  resetText.events.onInputDown.add(reset, this);

	let testText = game.add.text(700, 32, "TEST");
	testText.inputEnabled = true;
	testText.events.onInputDown.add(test, this);

}

function update() {
  bmd.context.fillStyle = lineColor;
  bmd.context.fillRect(box.x, box.y, 2, 2);
	ramp.body.angle = angle;
	game.physics.p2.gravity.y = gravity * 100;
  if(go) box.body.static = false;
  if(onRamp) box.body.thrust(accel);
	// console.log(accel);
	if(box.body.velocity.x < 0) box.body.velocity.x = 0;
	if(box.body.velocity.y < 0) box.body.velocity.y = 0;
	velXText.text = "Vel X: " + Math.floor(box.body.velocity.x);
	velYText.text = "Vel Y: " + Math.floor(box.body.velocity.y);
	if(box.body.velocity.x > maxVelX) maxVelX = box.body.velocity.x;
	if(box.body.velocity.y > maxVelY) maxVelY = box.body.velocity.y;
	maxVelXText.text = "Max Vel X: " + Math.floor(maxVelX);
	maxVelYText.text = "Max Vel Y: " + Math.floor(maxVelY);
	touchingText.text = "Touching: " + onRamp;
	angleText.text = "Angle: " + angle;
	massText.text = "Mass: " + mass;
	if(box.body.velocity.y <= 0) onRamp = false;
	game.physics.p2.restitution = restitution;
}

function render() {
  game.debug.spriteInfo(box, 32, 32);
}

function start(item){
  go = true;
	weight = mass * gravity;
	console.log(mass, gravity, mass * gravity);
	console.log(angle, Math.sin(angle * (Math.PI / 180)) * weight);
	fN = Math.cos(angle * (Math.PI / 180)) * weight;
	fD = Math.sin(angle * (Math.PI / 180)) * weight;
	accel = fD;
}

function random(min, max){
  return Math.floor(Math.random() * max) + min;
}

function reset(){
  go = false;
  box.body.static = true;
  box.body.angle = 90;
  box.kill;
  box.reset(startX, startY);
  lineColor = `rgb(${random(1, 255)}, ${random(1, 255)}, ${random(1, 255)})`;
	maxVelX = 0;
	maxVelY = 0;
}

function test(num){
	// console.log(num);
	if(num < 11){
		mass = num * 5;
		angle = (5 * num)
		start()
		setTimeout(() => {
			reset();
			test(++num)
		}, 3000);
	}
	if(isNaN(num)) test(1);
}
