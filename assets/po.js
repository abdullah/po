function getValue(el) {
	return document.querySelector(el).value
}

function setValue(el,val) {
	document.querySelector(el).value = val
	return val
}

var Synth = new AudioSynth();
var instrument = {
	piano : Synth.createInstrument('piano'),
	organ : Synth.createInstrument('organ'),
	acoustic : Synth.createInstrument('acoustic'),
	edm : Synth.createInstrument('edm'),
}



/**
 * Po
 * @param {Object} options 
 */
function Po(options) {
	
	this.axiom 				= options.axiom
	this.octave 			= options.octave
	this.rules 				= options.rules
	this.iteration 			= options.iteration
	this.duration 			= options.duration
	this.defaultInstrument	= options.defaultInstrument

	this.constant 	= [['[','['],[']',']','+','-']]
	this.LString 	= ""


	setValue("#rules", 
		this.rules.map(function (r) {
			return r[0] + " = " + r[1]
		}).join(',\n')
	) 

	setValue('#iteration',this.iteration)
	setValue('#axiom',this.axiom)
	setValue('#octave',this.octave)
	setValue('#instrument',this.defaultInstrument)
	setValue('#duration',this.duration)

}

Po.prototype.getValuesFromDocument = function(){
	this.iteration = getValue("#iteration")
	this.axiom = getValue("#axiom")
	this.octave = getValue("#octave")
	this.duration = getValue("#duration")
	this.defaultInstrument = getValue("#instrument")

	this.rules =  getValue("#rules")
				.split(',')
				.map(function (r) {
	 	 			return r.replace(/\s/g,"").split("=")
	 			})

};

Po.prototype.init = function(){
	this.getValuesFromDocument()
	this.generateLString(this.axiom)
};

Po.prototype.generateLString = function(str){
	this.LString = str
	var tmp = ""

	Array.from(str).map(function (c) {

        this.rules.map(function (rule) {
            if (rule[0] == c) {
                 tmp += c.replace(rule[0],rule[1])
            }
        })

    }.bind(this))

    if (this.iteration) {
        this.iteration--
        this.generateLString(tmp)
    }  
};


var interval = null

Po.prototype.play = function(){
	
	console.log("Result : ",this.LString)

	var notes = Array.from(this.LString)
	var size = notes.length
	var duration = this.duration

	interval = setInterval(function () {
		var index = notes.length-size
		var note = notes[index]
		var nextNote = notes[index+1]

		if (size > 0) {
			try {
				switch (note) {
					case '{':
						instrument.organ.play(nextNote,this.octave,duration)
					break;
					case '}':
						instrument.acoustic.play(nextNote,this.octave,duration)
					break;
					case '[':
						instrument.edm.play(nextNote,this.octave,duration)
					break;
					case ']':
						instrument.piano.play(nextNote,this.octave,duration)
					break;
					case '+':
						instrument[this.defaultInstrument].play(nextNote,this.octave+1,duration)
					break;
					case '-':
						instrument[this.defaultInstrument].play(nextNote,this.octave-1,duration)
					break;
					default:
						console.log(interval)
						instrument[this.defaultInstrument].play(note,this.octave,duration)
					break;
				}

			} catch(e) {
				// statements
				console.log(e);
			}

		}else{
			clearInterval(interval)
		}

		size--

	}.bind(this), duration*100)

};




Po.prototype.stop = function(){
	clearInterval(interval)
};

Po.prototype.start = function(){
	this.stop()
	this.init()
	this.play()
};

window.Po =  Po