
var analysis = document.getElementById('analysis-field');
var writing = document.getElementById('write');
var typeTimer;

writing.addEventListener('keyup', () => {
    clearTimeout(typeTimer);
    if (writing.value) {
        typeTimer = setTimeout(runAnalysis, 200);
    }
});

function runAnalysis () {
	// analysis.innerHTML = writing.value;
	analysis.innerHTML = '';
	var text_write = writing.value;
	// var word_now = text_write.split(/(\n)| /g);
	// var analysis_now = text_write.split(/(?=[.\s]|\b)/);
	var analysis_now = text_write.split(/([, .?!/\(\)"')])/g);
	// console.log(analysis_now);
	for(var i = 0; i < analysis_now.length; i++){
		var temp_word = analysis_now[i];
		if(isWord(temp_word)){
			var articling = isArticle(temp_word);
			var conjuctioning = isConjunction(temp_word);
			var prepositioning = isPreposition(temp_word);
			var adverbing = isAdverb(temp_word);
			var pronouning = isPronoun(temp_word);
			var nouning = isNoun(temp_word);
			if(conjuctioning){
				createMeta(temp_word, 'conjunction', conjuctioning);
			} else if(prepositioning){
				createMeta(temp_word, 'preposition', prepositioning);
			} else if(articling){
				createMeta(temp_word, 'article', articling);
			} else if(adverbing){
				createMeta(temp_word, 'adverb', adverbing);
			} else if(pronouning){
				createMeta(temp_word, 'pronoun', pronouning);
			} else if(nouning){
				createMeta(temp_word, 'noun', nouning);
			} else {
				createMeta(temp_word, 'wrong', '???');
			}
		} else {
			if(temp_word == '\n'){
				analysis.innerHTML += '<br>';
			} else{
				analysis.innerHTML += temp_word;
			}
		}
	}
}

function createMeta (text, segment, morphology) {
    var section = document.createElement('span');
    section.innerHTML = text;
    section.classList.add(segment);
    section.setAttribute("description", morphology);
    analysis.appendChild(section);
}

function isWord (text) {
    switch(text){
        case ' ':
        case ',':
        case '.':
        case '!':
        case '?':
        case '\n':
            // console.log(text+' is not a word lol');
            return false;
        default:
            return true;
    }
}

function isConjunction (text) {
	var tex = text.toLowerCase();
	for(var item in conjuctions){
		if (conjuctions[item].name == tex){
			var classing = 'conjunção';
			return classing;
		}
	}
	return false;
}
function isAdverb (text) {
	var tex = text.toLowerCase();
	for(var item in adverbs){
		if (adverbs[item].name == tex){
			var classing = 'advérbio';
			return classing;
		}
	}
	return false;
}
function isArticle (text) {
	var tex = text.toLowerCase();
	for(var item in articles){
		if (articles[item].name == tex){
			var classing = 'artigo';
			classing += articles[item].masc ? ' masculino' : ' feminino';
			classing += articles[item].singular ? ' singular' : ' plural';
			classing += articles[item].definite ? ' definido' : ' indefinido';
			return classing;
		}
	}
	return false;
}
function isPronoun (text) {
	var tex = text.toLowerCase();
	for(var item in pronouns){
		console.log(`comparing ${tex} com ${pronouns[item].name}.`)
		if (pronouns[item].name == tex
		|| (pronouns[item].hasp && tex === getPlural(pronouns[item].name))){
			var classing = 'pronome';
			classing += pronouns[item].masc ? ' masculino' : ' feminino';
			classing += pronouns[item].singular ? ' singular' : ' plural';
			return classing;
		}
	}
	return false;
}
function isPreposition (text) {
	var tex = text.toLowerCase();
	for(var item in prepositions){
		if (prepositions[item].name == tex
		|| (prepositions[item].hasp && tex === getPlural(prepositions[item].name))){
			var classing = 'preposição';
			// classing += prepositions[item].hasp ? ' plural' : '';
			return classing;
		}
	}
	return false;
}

function isNoun (text) {
	var tex = text.toLowerCase();
	for(var item in nouns){
		if (nouns[item].name === tex
		|| (nouns[item].hasp && tex === getPlural(nouns[item].name))
		|| tex === getDiminuitive(nouns[item].name)){
			var classing = 'substantivo';
			classing += nouns[item].masc ? ' masculino' : ' feminino';
			return classing;
		}
	}
	if (/^[A-Z]/.test(text)){
		return 'substantivo próprio';
	}
	return false;
}

function getPlural (text) {
	var bifinal = text.slice(-2);
	switch(bifinal){
		case 'al':
			return text.slice(0, -2)+'ais';
		case 'el':
			return text.slice(0, -2)+'éis';
		case 'ol':
			return text.slice(0, -2)+'óis';
		case 'ul':
			return text.slice(0, -2)+'uis';
		case 'il':
			return text.slice(0, -2)+'is';
		case 'ão':
			return text.slice(0, -2)+'ões';
	}
	var final = text.slice(-1);
	switch(final){
		case 'r': case 'z': case 's':
			return text+'es';
		case 'm':
			return text.slice(0, -1)+'ns';
	}
	return text + 's';
}

function getDiminuitive (text) {
	var bifinal = text.slice(-2);
	switch(bifinal){
		case 'ão': case 'ia': case 'io':
			return text+'zinho';
	}
	var final = text.slice(-1);
	switch(final){
		case 'm':
			return text.slice(0, -1)+'nzinho';
		case 'a':
			return text.slice(0, -1)+'inha';
		case 'e': case 'i': case 'o': case 'u':
			return text.slice(0, -1)+'inho';
		case 'ã': case 'é': case 'á': case 'ó': case 'í': case 'ú': case 'l': case 'r':
			return text+'zinha';
	}
}

var nouns = {
	nome: {
		name: 'nome',
		masc: true,
		hasp: true,
	},
	pessoa: {
		name: 'pessoa',
		masc: false,
		hasp: true,
	},
	casa: {
		name: 'casa',
		masc: false,
		hasp: true,
	},
	palavra: {
		name: 'palavra',
		masc: false,
		hasp: true,
	},
	homem: {
		name: 'homem',
		masc: true,
		hasp: true,
	},
	garoto: {
		name: 'garoto',
		masc: true,
		hasp: true,
	},
	mulher: {
		name: 'mulher',
		masc: false,
		hasp: true,
	},
	garota: {
		name: 'garota',
		masc: false,
		hasp: true,
	},
	lapis: {
		name: 'lápis',
		masc: true,
	},
	hifen: {
		name: 'hífen',
		masc: true,
		hasp: true,
	},
	opiniao: {
		name: 'opinião',
		masc: false,
		hasp: true,
	},
	aluguel: {
		name: 'aluguel',
		masc: true,
		hasp: true,
	},
	garota: {
		name: 'garota',
		masc: false,
		hasp: true,
	},
	tempo: { name: 'tempo', masc: true, hasp: true,},
	hora: { name: 'hora', masc: false, hasp: true,},
}

var articles = {
	o: {
		name: 'o',
		masc: true,
		singular: true,
		definite: true,
	},
	os: {
		name: 'os',
		masc: true,
		singular: false,
		definite: true,
	},
	a: {
		name: 'a',
		masc: false,
		singular: true,
		definite: true,
	},
	as: {
		name: 'as',
		masc: false,
		singular: false,
		definite: true,
	},
	um: {
		name: 'um',
		masc: true,
		singular: true,
		definite: false,
	},
	uns: {
		name: 'uns',
		masc: true,
		singular: false,
		definite: false,
	},
	uma: {
		name: 'uma',
		masc: false,
		singular: true,
		definite: false,
	},
	umas: {
		name: 'umas',
		masc: false,
		singular: false,
		definite: false,
	},
}

var pronouns = {
	eu: {
		name: 'eu',
		singular: true,
	},
	tu: {
		name: 'tu',
		singular: true,
	},
	voce: {
		name: 'você',
		masc: true,
		singular: true,
		hasp: true,
	},
	ele: {
		name: 'ele',
		gender: true,
		masc: true,
		singular: true,
		hasp: true,
	},
	ela: {
		name: 'ela',
		gender: true,
		masc: false,
		singular: true,
		hasp: true,
	},
	nos: {
		name: 'nós',
	},
	vos: {
		name: 'vós',
	},
	outro: { name: 'outro', hasp: true, indefinite: true,},
	tudo: { name: 'tudo', hasp: false, indefinite: true,},
	isso: { name: 'isso', gender: true, masc: true, hasp: true, indefinite: true,},
	essa: { name: 'essa', gender: true, masc: false, hasp: true, indefinite: true,},
}

var conjuctions = {
	e: { name: 'e',},
	ou: { name: 'ou',},
	quando: { name: 'quando',},
}

var prepositions = {
	em: { name: 'em',},
	de: { name: 'de',},
	do: { name: 'do', hasp: true,},
	da: { name: 'da', hasp: true,},
	com: { name: 'com',},
	sem: { name: 'sem',},
	contra: { name: 'contra',},
	por: { name: 'por',},
	pelo: { name: 'pelo', hasp: true,},
	pela: { name: 'pela', hasp: true,},
	para: { name: 'para',},
	ao: { name: 'ao', hasp: true,},
	desde: { name: 'desde',},
	sobre: { name: 'sobre',},
	sob: { name: 'sob',},
}

var adverbs = {
	depois: { name: 'depois',},
	apos: { name: 'após',},
	logo: { name: 'logo',},
	adiante: { name: 'adiante',},
	muito: { name: 'muito',},
	pouco: { name: 'pouco',},
	bem: { name: 'bem',},
	mal: { name: 'mal',},
	antes: { name: 'antes',},
	ainda: { name: 'ainda',},
	mais: { name: 'mais',},
	menos: { name: 'menos',},
	tambem: { name: 'também',},
	ate: { name: 'até',},
}