
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
	var analysis_now = text_write.split(/(?=[.\s]|\b)/);
	// console.log(analysis_now);
	for(var i = 0; i < analysis_now.length; i++){
		var temp_word = analysis_now[i];
		if(isWord(temp_word)){
			var articling = isArticle(temp_word);
			var pronouning = isPronoun(temp_word);
			var nouning = isNoun(temp_word);
			if(articling){
				createMeta(temp_word, 'article', articling);
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

function isArticle (text) {
	for(var item in articles){
		if (articles[item].name == text.toLowerCase()){
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
	for(var item in pronouns){
		console.log(pronouns[item].name);
		if (pronouns[item].name == text.toLowerCase()){
			var classing = 'pronome';
			classing += pronouns[item].masc ? ' masculino' : ' feminino';
			classing += pronouns[item].singular ? ' singular' : ' plural';
			return classing;
		}
	}
	return false;
}

function isNoun (text) {
	for(var item in nouns){
		if (/^[A-Z]/.test(text)){
			return 'substantivo próprio';
		}
		if (nouns[item].name === text){
			var classing = 'substantivo';
			classing += nouns[item].masc ? ' masculino' : ' feminino';
			return classing;
		}
	}
	return false;
}

var nouns = {
	nome: {
		name: 'nome',
		masc: true,
	},
	pessoa: {
		name: 'pessoa',
		masc: false,
	},
	casa: {
		name: 'casa',
		masc: false,
	},
	palavra: {
		name: 'palavra',
		masc: false,
	},
	homem: {
		name: 'homem',
		masc: true,
	},
	garoto: {
		name: 'garoto',
		masc: true,
	},
	mulher: {
		name: 'mulher',
		masc: false,
	},
	garota: {
		name: 'garota',
		masc: false,
	},
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
		gender: false,
		masc: true,
		singular: true,
		possession: false,
		object: false,
	},
	tu: {
		name: 'tu',
		gender: false,
		masc: true,
		singular: true,
		possession: false,
		object: false,
	},
	voce: {
		name: 'você',
		gender: false,
		masc: true,
		singular: true,
		possession: false,
		object: false,
	},
	ele: {
		name: 'ele',
		gender: false,
		masc: true,
		singular: true,
		possession: false,
		object: false,
	},
	ela: {
		name: 'ela',
		gender: false,
		masc: false,
		singular: true,
		possession: false,
		object: false,
	},
	nos: {
		name: 'nós',
		gender: false,
		masc: true,
		singular: false,
		possession: false,
		object: false,
	},
	vos: {
		name: 'vós',
		gender: false,
		masc: true,
		singular: false,
		possession: false,
		object: false,
	},
	eles: {
		name: 'eles',
		gender: false,
		masc: true,
		singular: false,
		possession: false,
		object: false,
	},
	elas: {
		name: 'elas',
		gender: false,
		masc: false,
		singular: false,
		possession: false,
		object: false,
	},
	voces: {
		name: 'vocês',
		gender: false,
		masc: true,
		singular: false,
		possession: false,
		object: false,
	},
}