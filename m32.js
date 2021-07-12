var myParameters = {};

function init() {
	local.values.addContainer("Meters");
	for (var i = 0; i < meters4.length; i++) {
		var n = meters4[i];
		var p = local.values.getChild("Meters").addFloatParameter(n,n,0,0,1);
	}
}

var meters4 = [
	"in1", "in2", "in3", "in4", "in5", "in6", "in7", "in8", "in9", "in10", "in11", "in12", "in13", "in14", "in15", "in16", "in17", "in18", "in19", "in20", "in21", "in22", "in23", "in24", "in25", "in26", "in27", "in28", "in29", "in30", "in31", "in32", 
	"aux1", "aux2", "aux3", "aux4", "aux5", "aux6", "aux7", "aux8", 
	"out1", "out2", "out3", "out4", "out5", "out6", "out7", "out8", "out9", "out10", "out11", "out12"
	];


function oscEvent(address, args) {
	if (address == "/meters/4") {
		for(var i=0; i < args.length; i++) {
			var data = args[i];
			var d = 1;
			for (var j = 4*d; j< data.length; j=j+4) {
				var index = parseInt(Math.floor(j/4))-1;
				if (index < meters4.length) {
					var f = bytesToFloat([data[j+0], data[j+1], data[j+2], data[j+3]]);
					var n = meters4[index];
					local.values.getChild("Meters").getChild(n).set(f);

				}
			}
		}
	} else {}
}

function bytesToFloat(bytes) {
    // JavaScript bitwise operators yield a 32 bits integer, not a float.
    // Assume LSB (least significant byte first).
    var bits = bytes[3]<<24 ;//| bytes[2]<<16 | bytes[1]<<8 | bytes[0];
    bits = bits | bytes[2]<<16;
    bits = bits | bytes[1]<<8;
    bits = bits | bytes[0];

    var sign = (bits>>>31 === 0) ? 1.0 : -1.0;
    var e = bits>>>23 & 0xff;
    var m = (e === 0) ? (bits & 0x7fffff)<<1 : (bits & 0x7fffff) | 0x800000;
    var f = sign * m * Math.pow(2, e - 150);
    return f;
  }

function update(deltaTime) {
	var now = util.getTime();
	if (now > TSSendAlive) {
		TSSendAlive = now + 3;
		keepAlive();
	}
}

function keepAlive() {
	local.send("/meters", "/meters/4");
}