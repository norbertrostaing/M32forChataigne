// using https://wiki.munichmakerlab.de/images/1/17/UNOFFICIAL_X32_OSC_REMOTE_PROTOCOL_(1).pdf

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
	"out1", "out2", "out3", "out4", "out5", "out6", "out7", "out8", "out9", "out10", "out11", "out12", "out13", "out14", "out15", "out16"
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









// channel control

function channel_config_name(channel, value) {
	if (channel < 10) {channel = "0"+channel; } 
	local.send("/ch/"+channel+"/config/name", value);
}

function channel_config_icon(channel, value) { // // /ch/XX/config/icon int [1...74] (see appendix for a list of icons) 
	if (channel < 10) {channel = "0"+channel; } 
	local.send("/ch/"+channel+"/config/icon", value);
}

function channel_config_color(channel, value) { // // /ch/XX/config/color enum int with value [0...15] representing {OFF, RD, GN, YE, BL, MG, CY, WH, OFFi, RDi, GNi, YEi, BLi, MGi, CYi, WHi} 
	if (channel < 10) {channel = "0"+channel; }
	local.send("/ch/"+channel+"/config/color", value);
}

function channel_config_source(channel, value) { // // /ch/XX/config/source int int with value [0...64] representing {OFF, In01...32, Aux 1...6, USB L, USB R,  Fx 1L...Fx 4R, Bus 01...16} 
	if (channel < 10) {channel = "0"+channel; } 
	local.send("/ch/"+channel+"/config/source", value);
}

function channel_delay_on(channel, value) { // // /ch/XX/delay/on enum {OFF, ON}
	if (channel < 10) {channel = "0"+channel; } 
	local.send("/ch/"+channel+"/delay/on", value);
}

function channel_delay_time(channel, value) { // // /ch/XX/delay/time linf [0.300, 500.000, 0.100] ms 
	if (channel < 10) {channel = "0"+channel; } 
	local.send("/ch/"+channel+"/delay/time", value);
}

function channel_preamp_trim(channel, value) { // // /ch/XX/preamp/trim linf [-18.000, 18.000, 0.250] (digital sources only) dB 
	if (channel < 10) {channel = "0"+channel; } 
	local.send("/ch/"+channel+"/preamp/trim", value);
}

function channel_preamp_invert(channel, value) { // // /ch/XX/preamp/invert enum {OFF, ON}
	if (channel < 10) {channel = "0"+channel; } 
	local.send("/ch/"+channel+"/preamp/invert", value);
}

function channel_preamp_hpon(channel, value) { // // /ch/XX/preamp/hpon enum {OFF, ON}Sets Phantom power off or on 
	if (channel < 10) {channel = "0"+channel; } 
	local.send("/ch/"+channel+"/preamp/hpon", value);
}

function channel_preamp_hpslope(channel, value) { // // /ch/XX/preamp/hpslope enum {12, 18, 24} 
	if (channel < 10) {channel = "0"+channel; } 
	local.send("/ch/"+channel+"/preamp/hpslope", value);
}

function channel_preamp_hpf(channel, value) { // // /ch/XX/preamp/hpf logf [20.000, 400.000, 101]10Hz 
	if (channel < 10) {channel = "0"+channel; } 
	local.send("/ch/"+channel+"/preamp/hpf", value);
}

function channel_gate_on(channel, value) { // // /ch/XX/gate/on enum {OFF, ON}
	if (channel < 10) {channel = "0"+channel; } 
	local.send("/ch/"+channel+"/gate/on", value);
}

function channel_gate_mode(channel, value) { // // /ch/XX/gate/mode enum int [0...4] representing  {EXP2, EXP3, EXP4, GATE, DUCK} 
	if (channel < 10) {channel = "0"+channel; } 
	local.send("/ch/"+channel+"/gate/mode", value);
}

function channel_gate_thr(channel, value) { // // /ch/XX/gate/thr linf [-80.000, 0.000, 0.500] dB 
	if (channel < 10) {channel = "0"+channel; } 
	local.send("/ch/"+channel+"/gate/thr", value);
}

function channel_gate_range(channel, value) { // // /ch/XX/gate/range linf [3.000, 60.000, 1.000] dB 
	if (channel < 10) {channel = "0"+channel; } 
	local.send("/ch/"+channel+"/gate/range", value);
}

function channel_gate_attack(channel, value) { // // /ch/XX/gate/attack linf [0.000, 120.000, 1.000] ms 
	if (channel < 10) {channel = "0"+channel; } 
	local.send("/ch/"+channel+"/gate/attack", value);
}

function channel_gate_hold(channel, value) { // // /ch/XX/gate/hold logf [0.020, 2000, 101]11ms 
	if (channel < 10) {channel = "0"+channel; } 
	local.send("/ch/"+channel+"/gate/hold", value);
}

function channel_gate_release(channel, value) { // // /ch/XX/gate/release logf [5.000, 4000.000, 101]12ms 
	if (channel < 10) {channel = "0"+channel; } 
	local.send("/ch/"+channel+"/gate/release", value);
}

function channel_gate_keysrc(channel, value) { // // /ch/XX/gate/keysrc int int with value [0...64] representing {OFF, In01...32, Aux 1...6, USB L, USB R,  Fx 1L...Fx 4R, Bus 01...16} 
	if (channel < 10) {channel = "0"+channel; } 
	local.send("/ch/"+channel+"/gate/keysrc", value);
}

function channel_gate_filter(channel, value) { // // /ch/XX/gate/filter/on enum {OFF, ON}
	if (channel < 10) {channel = "0"+channel; } 
	local.send("/ch/"+channel+"/gate/filter/on", value);
}

function channel_gate_filter(channel, value) { // // /ch/XX/gate/filter/type enum int with value [0...8] representing Keysolo (Solo/Q) {LC6, LC12, HC6, HC12, 1.0, 2.0, 3.0, 5.0, 10.0} 
	if (channel < 10) {channel = "0"+channel; } 
	local.send("/ch/"+channel+"/gate/filter/type", value);
}

function channel_gate_filter(channel, value) { // // /ch/XX/gate/filter/f Logf [20.000, 20000, 201]13Hz 
	if (channel < 10) {channel = "0"+channel; } 
	local.send("/ch/"+channel+"/gate/filter/f", value);
}

function channel_dyn_on(channel, value) { // // /ch/XX/dyn/on enum {OFF, ON}
	if (channel < 10) {channel = "0"+channel; } 
	local.send("/ch/"+channel+"/dyn/on", value);
}

function channel_dyn_mode(channel, value) { // // /ch/XX/dyn/mode enum {COMP, EXP} 
	if (channel < 10) {channel = "0"+channel; } 
	// /ch/XX/dyn/mode enum {COMP, EXP} 
	local.send("/ch/"+channel+"/dyn/mode", value);
}

function channel_dyn_det(channel, value) { // // /ch/XX/dyn/det enum {PEAK, RMS} 
	if (channel < 10) {channel = "0"+channel; } 
	local.send("/ch/"+channel+"/dyn/det", value);
}

function channel_dyn_env(channel, value) { // // /ch/XX/dyn/env enum {LIN, LOG} 
	if (channel < 10) {channel = "0"+channel; } 
	local.send("/ch/"+channel+"/dyn/env", value);
}

function channel_dyn_thr(channel, value) { // // /ch/XX/dyn/thr linf [-60.000, 0.000, 0.500] dB 
	if (channel < 10) {channel = "0"+channel; } 
	local.send("/ch/"+channel+"/dyn/thr", value);
}

function channel_dyn_ratio(channel, value) { // // /ch/XX/dyn/ratio enum int with value [0...11] representing {1.1, 1.3, 1.5, 2.0, 2.5, 3.0, 4.0, 5.0, 7.0, 10, 20, 100} 10 See Appendix section for detailed values 11 See Appendix section for detailed values 12 See Appendix section for detailed values 13 See Appendix section for detailed values 
	if (channel < 10) {channel = "0"+channel; } 
	local.send("/ch/"+channel+"/dyn/ratio", value);
}

function channel_dyn_knee(channel, value) { // // /ch/XX/dyn/knee linf [0.000, 5.000, 1.000] 
	if (channel < 10) {channel = "0"+channel; } 
	local.send("/ch/"+channel+"/dyn/knee", value);
}

function channel_dyn_mgain(channel, value) { // // /ch/XX/dyn/mgain linf [0.000, 24.000, 0.500] dB 
	if (channel < 10) {channel = "0"+channel; } 
	local.send("/ch/"+channel+"/dyn/mgain", value);
}

function channel_dyn_attack(channel, value) { // // /ch/XX/dyn/attack linf [0.000, 120.000, 1.000] ms 
	if (channel < 10) {channel = "0"+channel; } 
	local.send("/ch/"+channel+"/dyn/attack", value);
}

function channel_dyn_hold(channel, value) { // // /ch/XX/dyn/hold logf [0.020, 2000, 101] ms 
	if (channel < 10) {channel = "0"+channel; } 
	local.send("/ch/"+channel+"/dyn/hold", value);
}

function channel_dyn_release(channel, value) { // // /ch/XX/dyn/release logf [5.000, 4000.000, 101] ms 
	if (channel < 10) {channel = "0"+channel; } 
	local.send("/ch/"+channel+"/dyn/release", value);
}

function channel_dyn_pos(channel, value) { // // /ch/XX/dyn/pos enum {PRE, POST} 
	if (channel < 10) {channel = "0"+channel; } 
	local.send("/ch/"+channel+"/dyn/pos", value);
}

function channel_dyn_keysrc(channel, value) { // // /ch/XX/dyn/keysrc int int with value [0...64] representing {OFF, In01...32, Aux 1...6, USB L, USB R,  Fx 1L...Fx 4R, Bus 01...16} 
	if (channel < 10) {channel = "0"+channel; } 
	local.send("/ch/"+channel+"/dyn/keysrc", value);
}

function channel_dyn_mix(channel, value) { // // /ch/XX/dyn/mix linf [0, 100, 5] % 
	if (channel < 10) {channel = "0"+channel; } 
	local.send("/ch/"+channel+"/dyn/mix", value);
}

function channel_dyn_auto(channel, value) { // // /ch/XX/dyn/auto enum {OFF, ON}
	if (channel < 10) {channel = "0"+channel; } 
	local.send("/ch/"+channel+"/dyn/auto", value);
}

function channel_dyn_filter(channel, value) { // // /ch/XX/dyn/filter/on enum {OFF, ON}
	if (channel < 10) {channel = "0"+channel; } 
	local.send("/ch/"+channel+"/dyn/filter/on", value);
}

function channel_dyn_filter(channel, value) { // // /ch/XX/dyn/filter/type enum int with value [0...8] representing Keysolo (Solo/Q) {LC6, LC12, HC6, HC12, 1.0, 2.0, 3.0, 5.0, 10.0} 
	if (channel < 10) {channel = "0"+channel; } 
	local.send("/ch/"+channel+"/dyn/filter/type", value);
}

function channel_dyn_filter(channel, value) { // // /ch/XX/dyn/filter/f logf [20.000, 20000, 201] Hz 
	if (channel < 10) {channel = "0"+channel; } 
	local.send("/ch/"+channel+"/dyn/filter/f", value);
}

function channel_insert_on(channel, value) { // // /ch/XX/insert/on enum {OFF, ON}
	if (channel < 10) {channel = "0"+channel; } 
	local.send("/ch/"+channel+"/insert/on", value);
}

function channel_insert_pos(channel, value) { // // /ch/XX/insert/pos enum {PRE, POST}
	if (channel < 10) {channel = "0"+channel; } 
	local.send("/ch/"+channel+"/insert/pos", value);
}

function channel_insert_sel(channel, value) { // // /ch/XX/insert/sel enum int with value [0...22] representing {OFF, FX1L, FX1R, FX2L, FX2R, FX3L, FX3R, FX4L, FX4R, FX5L, FX5R, FX6L, FX6R, FX7L, FX7R, FX8L, FX8R, AUX1, AUX2, AUX3, AUX4, AUX5, AUX6} 
	if (channel < 10) {channel = "0"+channel; } 
	local.send("/ch/"+channel+"/insert/sel", value);
}

function channel_eq_on(channel, value) { // // /ch/XX/eq/on enum {OFF, ON}
	if (channel < 10) {channel = "0"+channel; } 
	local.send("/ch/"+channel+"/eq/on", value);
}

function channel_eq_type(channel, band, value) { // // /ch/XX/eq/1_4/type enum int [0...5] representing  {LCut, LShv, PEQ, VEQ, HShv, HCut} 
	if (channel < 10) {channel = "0"+channel; }
	local.send("/ch/"+channel+"/eq/"+band+"/type", value);
}

function channel_eq_f(channel, band, value) { // // /ch/XX/eq/1_4/f logf [20.000, 20000, 201] Hz 
	if (channel < 10) {channel = "0"+channel; } 
	local.send("/ch/"+channel+"/eq/"+band+"/f", value);
}

function channel_eq_g(channel, band, value) { // // /ch/XX/eq/1_4/g linf [-15.000, 15.000, 0.250] dB 
	if (channel < 10) {channel = "0"+channel; } 
	local.send("/ch/"+channel+"/eq/"+band+"/g", value);
}

function channel_eq_q(channel, band, value) { // // /ch/XX/eq/1_4/q logf [10.000, 0.3, 72] 
	if (channel < 10) {channel = "0"+channel; } 
	local.send("/ch/"+channel+"/eq/"+band+"/q", value);
}

function channel_mix_on(channel, value) { // // /ch/XX/mix/on enum {OFF, ON}
	if (channel < 10) {channel = "0"+channel; } 
	local.send("/ch/"+channel+"/mix/on", value);
}

function channel_mix_fader(channel, value) { // // /ch/XX/mix/fader level [0.0...1.0(+10dB), 1024] dB 
	if (channel < 10) {channel = "0"+channel; } 
	local.send("/ch/"+channel+"/mix/fader", value);
}

function channel_mix_st(channel, value) { // // /ch/XX/mix/st enum {OFF, ON}
	if (channel < 10) {channel = "0"+channel; } 
	local.send("/ch/"+channel+"/mix/st", value);
}

function channel_mix_pan(channel, value) { // // /ch/XX/mix/pan linf [-100.000, 100.000, 2.000] 
	if (channel < 10) {channel = "0"+channel; } 
	local.send("/ch/"+channel+"/mix/pan", value);
}

function channel_mix_mono(channel, value) { // // /ch/XX/mix/mono enum {OFF, ON}
	if (channel < 10) {channel = "0"+channel; } 
	local.send("/ch/"+channel+"/mix/mono", value);
}

function channel_mix_mlevel(channel, value) { // // /ch/XX/mix/mlevel level [0.0...1.0 (+10 dB), 161] dB 
	if (channel < 10) {channel = "0"+channel; } 
	local.send("/ch/"+channel+"/mix/mlevel", value);
}

function channel_mix_on(channel, mix, value) { // // /ch/XX/mix/0116/on enum {OFF, ON}
	if (channel < 10) {channel = "0"+channel; } 
	if (mix < 10) {mix = "0"+mix; } 
	local.send("/ch/"+channel+"/mix/"+mix+"/on", value);
}

function channel_mix_send_level(channel, mix, value) { // // /ch/XX/mix/0116/level level [0.0...1.0 (+10 dB), 161] dB 
	if (channel < 10) {channel = "0"+channel; } 
	if (mix < 10) {mix = "0"+mix; } 
	local.send("/ch/"+channel+"/mix/"+mix+"/level", value);
}

function channel_mix_send_pan(channel, mix, value) { // // /ch/XX/mix/01/pan linf [-100.000, 100.000, 2.000] 
	if (channel < 10) {channel = "0"+channel; } 
	if (mix < 10) {mix = "0"+mix; } 
	local.send("/ch/"+channel+"/mix/"+mix+"/pan", value);
}

function channel_mix_send_Type(channel, mix, value) { // // /ch/XX/mix/01/type enum int [0...5] representing  {IN/LC, <-EQ, EQ->, PRE, POST, GRP} 
	if (channel < 10) {channel = "0"+channel; } 
	if (mix < 10) {mix = "0"+mix; } 
	local.send("/ch/"+channel+"/mix/"+mix+"/pan", value);
}

/* a voir plus tard
function channel_grp_dca(channel, value) { // // /ch/XX/grp/dca %int [0, 255] (bitmap) 
	if (channel < 10) {channel = "0"+channel; } 
	local.send("/ch/"+channel+"/grp/dca", value);
}

function channel_grp_mute(channel, value) { // // /ch/XX/grp/mute %int [0, 63] (bitmap)
	if (channel < 10) {channel = "0"+channel; } 
	local.send("/ch/"+channel+"/grp/mute", value);
}
*/
