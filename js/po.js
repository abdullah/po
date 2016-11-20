
function po() {
	this.rulesArray = []
	this.rulesString = ""
	
	this.ruleEl = document.getElementById('rules')
	this.octaveEl = document.getElementById('octave')
	this.durationEl = document.getElementById('duration')
	this.iterasyonEl = document.getElementById('iterasyon')
	this.defaultEl = document.getElementById('default')
	this.axiomEl = document.getElementById('axiom')


	this.duration = 2;
	this.octave = 3;
	this.axiom = "A";
	this.default = "";
	this.iterasyon = 1
}



po.prototype.getRulesFromInput = function(){
	var el = this.ruleEl
	
	this.octave = this.octaveEl.value || 3
	this.duration = this.durationEl.value || 2
	this.iterasyon = this.iterasyonEl.value || 2
	this.default = this.defaultEl.value || 'piano'
	this.axiom = this.axiomEl.value || 'A'

	var r = el.value.trim().replace(/[^\x20-\x7E]/gmi, "").split(",")
	this.rulesArray = r

};


po.prototype.generateRules = function(t){
	this.rulesString = t
	this.rulesArray.map(function (e) {
		var a = e.split("=")
		t = t.replaceAll(a[0].trim(),a[1].trim())
	})

	for (var i = 0; i < this.iterasyon; i++) {
		this.iterasyon -= 1
		this.generateRules(t)
	}

};

po.prototype.start = function(){
	this.getRulesFromInput()
	this.generateRules(this.axiom)
	this.play()
};


var tree = []
var interval = null
var circle = document.querySelector('.circle')

var Synth = new AudioSynth();
var instrument = {
	piano : Synth.createInstrument('piano'),
	organ : Synth.createInstrument('organ'),
	acoustic : Synth.createInstrument('acoustic'),
	edm : Synth.createInstrument('edm'),
}

po.prototype.play = function(){
	document.querySelector('.result').innerHTML = `<b>Result</b><br /> ${this.rulesString}`
	tree = Array.from(this.rulesString)
	var duration = this.duration
	var octave = this.octave
	var Synth = new AudioSynth();


	var l = tree.length
	var s = 0

	interval = setInterval(function () {
		var r = tree[s]

			try {
				if (l > 0) {
					switch (r) {
						case '{':
							getNot(function (not) {
								instrument.organ.play(not,octave,duration)
							})
						break;
						case '}':
							getNot(function (not) {
								instrument.acoustic.play(not,octave,duration)
							})
						break;
						case ']':
							getNot(function (not) {
								instrument.piano.play(not,octave,duration)
							})
						break;
						case '[':
							getNot(function (not) {
								instrument.edm.play(not,octave,duration)
							})
						break;
						case '+':
							randomDraw(2)
							getNot(function (not) {
								instrument[this.default].play(not,octave+1,duration)
							})
						break;
						case '-':
							randomDraw(.4)
							getNot(function (not) {
								instrument[this.default].play(not,octave-1,duration)
							})
						break;
						default:
							instrument[this.default].play(r,octave,duration)
						break;
					}
				}else{
					this.stop()
				}
			} catch(e) {
				// statements
				console.info("Fast!")
				console.log(r);
			}

		l--
		s++

	}.bind(this),duration*100)
};


var disarm = ["{","}","[","]","+","-"]

function getNot(cb) {
	var n = tree.filter(f => disarm.indexOf(f) == -1);
	cb(n[Math.floor(Math.random() * tree.length)])
}

function randomDraw(hy) {
	circle.style.transform = "scale("+Math.random() * hy+")"
	circle.style.animation = "circleAnimaton 1s infinite"
}


po.prototype.stop = function(){
	clearInterval(interval)
	circle.style.animation = ""
	this.iterasyon = 2
};


window.Po = po

