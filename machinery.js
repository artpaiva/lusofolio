
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
	// var phrases = text_write.split(/(?=[.\!-?\n/])/g);
	var phrases = text_write.split(/(?<=[\.!?\n])/);
	for(var item in phrases){
    var phrase = document.createElement('text');
		phrase.classList.add('phrase');
		var children = phraseMorphology(phrases[item]);
		for(var word in children){
			phrase.appendChild(children[word]);
		}
		analysis.appendChild(phrase);
	}
}

function phraseMorphology (text) {
	var analysis_now = text.split(/([, .?!\n/\(\)")])/g);
	var ran = '';
	var element = [];
	var count = 0;
	// console.log(analysis_now);
	for(var i = 0; i < analysis_now.length; i++){
		var temp_word = analysis_now[i];
		if(isWord(temp_word)){
			var articling = isArticle(temp_word);
			var conjuctioning = isConjunction(temp_word);
			var prepositioning = isPreposition(temp_word);
			var adverbing = isAdverb(temp_word);
			var pronouning = isPronoun(temp_word);
			var nouning = isNoun(temp_word, count);
			var adjectiving = isAdjective(temp_word);
			var verbing = isVerb(temp_word);
			var numbering = isNumber(temp_word);

			if(numbering){
				element[element.length] = createMeta(temp_word, 'number', numbering);
			} else if(conjuctioning){
				element[element.length] = createMeta(temp_word, 'conjunction', conjuctioning);
			} else if(prepositioning){
				element[element.length] = createMeta(temp_word, 'preposition', prepositioning);
			} else if(articling){
				element[element.length] = createMeta(temp_word, 'article', articling);
			} else if(adverbing){
				element[element.length] = createMeta(temp_word, 'adverb', adverbing);
			} else if(pronouning){
				element[element.length] = createMeta(temp_word, 'pronoun', pronouning);
			} else if(verbing){
				element[element.length] = createMeta(temp_word, 'verb', verbing);
			} else if(adjectiving){
				element[element.length] = createMeta(temp_word, 'adjective', adjectiving);
			} else if(nouning){
				element[element.length] = createMeta(temp_word, 'noun', nouning);
			} else {
				element[element.length] = createMeta(temp_word, 'wrong', '???');
			}
			count += 1;
		} else {
			if(temp_word === '\n'){
				// ran += '<br>';
				var linebreak = document.createElement("br");
				element[element.length] = linebreak;
			} else{
				element[element.length] = document.createTextNode(temp_word);
			}
		}
	}
	return element;
}

function createMeta (text, segment, morphology) {
    var section = document.createElement('span');
    section.innerHTML = text;
    section.classList.add(segment);
    section.setAttribute("description", morphology);
    // analysis.appendChild(section);
    return section;
}

function isWord (text) {
    switch(text){
        case ' ':
        case ',':
        case '.':
        case '!':
        case '?':
        case '-':
        case '\n':
            // console.log(text+' is not a word lol');
            return false;
        default:
            return true;
    }
}

function isNumber (text) {
	var pattern = /^\d+$/;
	if(pattern.test(text)){
		return 'Número';
	}
	pattern = /^\d+ª$/;
	var patterm = /^\d+º$/;
	var patterl = /^\d+°$/;
	if(pattern.test(text) || patterm.test(text) || patterl.test(text) ){
		return 'Número Ordinal';
	}
	return false;
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

var subPronouns = {
	eu: { name: 'eu', singular: true, person: 1},
	tu: { name: 'tu', singular: true, person: 2},
	ele: { name: 'ele', biform: true, masc: true, singular: true, person: 3},
	ela: { name: 'ela', biform: true, masc: false, singular: true, person: 3},
	voce: { name: 'você', singular: true, person: 3},
	nos: { name: 'nós', person: 1},
	vos: { name: 'vós', person: 2},
	eles: { name: 'eles', biform: true, masc: true, person: 3},
	elas: { name: 'elas', biform: true, masc: false, person: 3},
	voces: { name: 'vocês', person: 3},
};
var verbPronouns = {
	me: { name: 'me', singular: true, person: 1},
	te: { name: 'te', singular: true, person: 2},
	o: { name: 'o', biform: true, masc: true, singular: true, person: 3},
	a: { name: 'a', biform: true, masc: false, singular: true, person: 3},
	lhe: { name: 'lhe', singular: true, person: 3},
	se: { name: 'se', singular: true, person: 3},
	nos: { name: 'nos', person: 1},
	vos: { name: 'vos', person: 2},
	os: { name: 'os', biform: true, masc: true, person: 3},
	as: { name: 'as', biform: true, masc: false, person: 3},
	lhes: { name: 'lhes', person: 3},
	se: { name: 'se', person: 3},
};
var prepPronouns = {
	mim: { name: 'mim', singular: true, person: 1},
	ti: { name: 'ti', singular: true, person: 2},
	ele: { name: 'ele', biform: true, masc: true, singular: true, person: 3},
	ela: { name: 'ela', biform: true, masc: false, singular: true, person: 3},
	si: { name: 'si', singular: true, person: 3},
	nos: { name: 'nós', person: 1},
	vos: { name: 'vós', person: 2},
	eles: { name: 'eles', biform: true, masc: true, person: 3},
	elas: { name: 'elas', biform: true, masc: false, person: 3},
	si: { name: 'si', person: 3},
};
function isPronoun (text) {
	var tex = text.toLowerCase();
	var classing = false;
	classing = forPronouns(subPronouns, tex, 'Pronome de Sujeito');
	if (classing) return classing;
	classing = forPronouns(verbPronouns, tex, 'Objeto do Verbo');
	if (classing) return classing;
	classing = forPronouns(prepPronouns, tex, 'Objeto da Preposição');
	if (classing) return classing;
	for(var item in pronouns){
		if (pronouns[item].name == tex
		|| (pronouns[item].hasp && tex === getPlural(pronouns[item].name))
		|| (pronouns[item].biform && tex === getGender(pronouns[item].name))
		|| (pronouns[item].biform && tex === getPlural(getGender(pronouns[item].name)))){
			classing = 'Pronome';
			return classing;
		}
	}
	return false;
}
function forPronouns(list, tex, callit){
	for(var item in list){
		if (list[item].name == tex){
			var classing = callit;
			if(list[item].biform)
				classing += list[item].masc ? ' masculino' : ' feminino';
			classing += ` na ${list[item].person}ª pessoa`
			classing += list[item].singular ? ' do singular' : ' do plural';
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

function isNoun (text, number) {
	for(var item in nouns){
		var allform = getAllforms(nouns, item, text);
		if (allform){
			var classing = 'substantivo';
			// classing += nouns[item].masc ? ' masculino' : ' feminino';
			classing = `${classing} ${allform}`;
			return classing;
		}
	}
	if (/^[A-Z]/.test(text) && number > 1){
		return 'substantivo próprio';
	}
	return false;
}
function isAdjective (text) {
	var tex = text.toLowerCase();
	for(var item in adjectives){
		var allform = getAllforms(adjectives, item, tex);
		if (allform || tex == `${getAdjectiveForm(adjectives[item].name)}mente`){
			var classing = 'Adjetivo';
			classing = `${classing} ${allform}`;
			return classing;
		}

	}
	return false;
}
function getAdjectiveForm (text) {
	var final = text.slice(-1);
	switch(final){
		case 'o':
			return text.slice(0, -1)+'a';
	}
	return text;
}

function isVerb (text) {
	var tex = text.toLowerCase();
	for(var verb in allverbs){
		for(var conjugate in allverbs[verb]){
			for(var item in allverbs[verb][conjugate]){
				var classing = `Verbo '${allverbs[verb][allverbs[verb].length-1][0]}' no ${verbTypes[conjugate]}`;
				if (allverbs[verb][conjugate][item] == tex){
					var person = (item % 3)+1;
					if( conjugate < allverbs[verb].length-3){
						var number = item >= 3 ? 'plural' : 'singular';
						classing += ` na ${person}ª pessoa do ${number}`;
					}
					// classing += prepositions[item].hasp ? ' plural' : '';
					return classing;
				}
			}
		}
	}
}

function getAllforms (list, item, word) {
	var tex = word.toLowerCase();
	var plural = getPlural(list[item].name);
	var gender = getGender(list[item].name);
	var diminutive = getDiminuitive(list[item].name);
	var init = list[item].masc ? ' masculino' : ' feminino';
	if (list[item].name === tex){
		return `${init} no singular`;
	}
	if (list[item].hasp && tex === plural){
		return `${init} no plural`;
	}
	if (list[item].biform && tex === gender){
		return 'feminino no singular';
	}
	if (list[item].biform && list[item].hasp && tex === getPlural(gender)){
		return 'feminino no plural';
	}
	if (tex === diminutive){
		return `${init} diminutivo no singular`;
	}
	if (list[item].biform && tex === getGender(diminutive)){
		return 'feminino diminutivo no singular';
	}
	if (list[item].hasp && tex === getPlural(diminutive)){
		return `${init} diminutivo no plural`;
	}
	if (list[item].biform && list[item].hasp && tex === getPlural(getGender(diminutive))){
		return 'feminino diminutivo no plural';
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
		case 'ga':
			return text.slice(0, -2)+'guinha';
		case 'go':
			return text.slice(0, -2)+'guinho';
		case 'ca':
			return text.slice(0, -2)+'quinha';
		case 'co':
			return text.slice(0, -2)+'quinho';
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
			return text+'zinho';
	}
	return text;
}

function getGender (text) {
	var bifinal = text.slice(-2);
	switch(bifinal){
		case 'ão':
			switch(text){
				case 'leão': return 'leoa';
			}
			return text.slice(0, -2)+'ã';
		case 'or':
			return text+'a';
		case 'ês':
			return text.slice(0, -2)+'esa';
		case 'eu':
			return text.slice(0, -2)+'eia';
	}
	var final = text.slice(-1);
	switch(final){
		case 'o':
			return text.slice(0, -1)+'a';
		case 'l': case 'z':
			return text+'a';
	}
	return text;
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
	garoto: {name: 'garoto',masc: true,biform: true,hasp: true,},
	menino: {name: 'menino',masc: true,biform: true,hasp: true,},
	boneco: {name: 'boneco',masc: true,biform: true,hasp: true,},
	gato: {name: 'gato',masc: true,biform: true,hasp: true,},
	cantor: {name: 'cantor',masc: true,biform: true,hasp: true,},
	vendedor: {name: 'vendedor',masc: true,biform: true,hasp: true,},
	programador: {name: 'programador',masc: true,biform: true,hasp: true,},
	campones: {name: 'camponês',masc: true,biform: true,hasp: true,},
	europeu: {name: 'europeu',masc: true,biform: true,hasp: true,},
	leao: {name: 'leão',masc: true,biform: true,hasp: true,},
	estudante: {name: 'estudante',masc: true,hasp: true,},
	lugar: {name: 'lugar',masc: true,hasp: true,},
	campo: {name: 'campo',masc: true,hasp: true,},
	carro: {name: 'carro',masc: true,hasp: true,},
	convite: {name: 'convite',masc: true,hasp: true,},
	braco: {name: 'braço',masc: true,hasp: true,},
	olho: {name: 'olho',masc: true,hasp: true,},
	amor: {name: 'amor',masc: true,hasp: true,},
	floresta: {name: 'floresta',masc: false,hasp: true,},
	montanha: {name: 'montanha',masc: false,hasp: true,},
	rua: {name: 'rua',masc: false,hasp: true,},
	estrada: {name: 'estrada',masc: false,hasp: true,},
	chuva: {name: 'chuva',masc: false,hasp: true,},
	bruega: {name: 'bruega',masc: false,hasp: true,definition: 'Chuva passageira',},
	cidade: {name: 'cidade',masc: false,hasp: true,},
	beleza: {name: 'beleza',masc: false,hasp: true,},
	forma: {name: 'forma',masc: false,hasp: true,},
	mao: {name: 'mão',masc: false,hasp: true,},
	mae: {name: 'mãe',masc: false,hasp: true,},
	mamae: {name: 'mamãe',masc: false,hasp: true,},
	pai: {name: 'pai',masc: true,hasp: true,},
	papai: {name: 'papai',masc: true,hasp: true,},
	mulher: {
		name: 'mulher',
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
	outro: { name: 'outro', hasp: true, indefinite: true,},
	tudo: { name: 'tudo', hasp: false, indefinite: true,},
	todo: { name: 'todo', biform: true, masc: true, hasp: true, indefinite: true,},
	isso: { name: 'isso', biform: true, masc: true, hasp: true, indefinite: true,},
	essa: { name: 'essa', biform: true, masc: false, hasp: true, indefinite: true,},
	comigo: { name: 'comigo',},
	contigo: { name: 'contigo',},
	consigo: { name: 'consigo',},
	conosco: { name: 'conosco',},
	connosco: { name: 'connosco',},
	convosco: { name: 'convosco',},
}

var conjuctions = {
	e: { name: 'e',},
	porém: { name: 'porém',},
	mas: { name: 'mas',},
	contudo: { name: 'contudo',},
	porquanto: { name: 'porquanto',},
	todavia: { name: 'todavia',},
	perol: { name: 'perol',},
	ergo: { name: 'ergo',},
	ou: { name: 'ou',},
	quando: { name: 'quando',},
}

var prepositions = {
	em: { name: 'em',},
	no: { name: 'no', hasp: true,},
	na: { name: 'na', hasp: true,},
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
	conforme: { name: 'conforme', accident: true,},
	consoante: { name: 'consoante', accident: true,},
	excepto: { name: 'excepto', accident: true,},
	entre: { name: 'entre',},
	mediante: { name: 'mediante', accident: true,},
	perante: { name: 'perante',},
	salvo: { name: 'salvo', accident: true,},
	segundo: { name: 'segundo', accident: true,},
	durante: { name: 'durante', accident: true,},
	senao: { name: 'senão', accident: true,},
	tras: { name: 'trás',},
	como: { name: 'como', accident: true,},
	fora: { name: 'fora', accident: true,},
	visto: { name: 'visto', accident: true,},
	feito: { name: 'feito', accident: true,},
}

var adverbs = {
	ja: { name: 'já',},
	depois: { name: 'depois',},
	apos: { name: 'após',},
	logo: { name: 'logo',},
	cedo: { name: 'cedo',},
	tarde: { name: 'tarde',},
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
	alem: { name: 'além',},
	alias: { name: 'aliás',},
	enfim: { name: 'enfim',},
	nao: { name: 'não',},
	sim: { name: 'sim',},
	mesmo: { name: 'mesmo',},
	sempre: { name: 'sempre',},
	ne: { name: 'né',},
	finalmente: { name: 'finalmente',},
}

var adjectives = {
	reto: {name: 'reto',masc: true,biform: true,hasp: true,},
	curvo: {name: 'curvo',masc: true,biform: true,hasp: true,},
	novo: {name: 'novo',masc: true,biform: true,hasp: true,},
	velho: {name: 'velho',masc: true,biform: true,hasp: true,},
	cheio: {name: 'cheio',masc: true,biform: true,hasp: true,},
	vazio: {name: 'vazio',masc: true,biform: true,hasp: true,},
	ultimo: {name: 'último',masc: true,biform: true,hasp: true,},
	proximo: {name: 'próximo',masc: true,biform: true,hasp: true,},
	pequeno: {name: 'pequeno',masc: true,biform: true,hasp: true,},
	grande: {name: 'grande',masc: true,biform: true,hasp: true,},
	otimo: {name: 'ótimo',masc: true,biform: true,hasp: true,},
	menor: {name: 'menor',hasp: true,},
	maior: {name: 'maior',hasp: true,},
	alto: {name: 'alto',masc: true,biform: true,hasp: true,},
	baixo: {name: 'baixo',masc: true,biform: true,hasp: true,},
	bonito: {name: 'bonito',masc: true,biform: true,hasp: true,},
	lindo: {name: 'lindo',masc: true,biform: true,hasp: true,},
	parecido: {name: 'parecido',masc: true,biform: true,hasp: true,},
	mau: {name: 'mau',masc: true,hasp: true,},
	bom: {name: 'bom',masc: true,hasp: true,},
	ma: {name: 'má',hasp: true,},
	boa: {name: 'boa',hasp: true,},
	igual: {name: 'igual',hasp: true,},
	capaz: {name: 'capaz',hasp: true,},
	quente: {name: 'quente',hasp: true,},
	frio: {name: 'frio',masc: true,biform: true,hasp: true,},
	morno: {name: 'morno',masc: true,biform: true,hasp: true,},
	mourno: {name: 'mourno',masc: true,biform: true,hasp: true,},
	humano: {name: 'humano',masc: true,biform: true,hasp: true,},
	facil: {name: 'fácil',hasp: true,},
	dificil: {name: 'difícil',hasp: true,},
	claro: {name: 'claro',masc: true,biform: true,hasp: true,},
	escuro: {name: 'escuro',masc: true,biform: true,hasp: true,},
	branco: {name: 'branco',masc: true,biform: true,hasp: true,},
	preto: {name: 'preto',masc: true,biform: true,hasp: true,},
	vermelho: {name: 'vermelho',masc: true,biform: true,hasp: true,},
	amarelo: {name: 'amarelo',masc: true,biform: true,hasp: true,},
	roxo: {name: 'roxo',masc: true,biform: true,hasp: true,},
	laranja: {name: 'laranja',hasp: true,},
	verde: {name: 'verde',hasp: true,},
	rosa: {name: 'rosa',hasp: true,},
	anil: {name: 'anil',hasp: true,},
	azul: {name: 'azul',hasp: true,},
	ciano: {name: 'ciano'},
	internacional: {name: 'internacional',hasp: true,},
	nacional: {name: 'nacional',hasp: true,},
	certo: {name: 'certo',masc: true,biform: true,hasp: true,},
	correto: {name: 'correto',masc: true,biform: true,hasp: true,},
	verdadeiro: {name: 'verdadeiro',masc: true,biform: true,hasp: true,},
	falso: {name: 'falso',masc: true,biform: true,hasp: true,},
	errado: {name: 'errado',masc: true,biform: true,hasp: true,},
	incorreto: {name: 'incorreto',masc: true,biform: true,hasp: true,},
	esperto: {name: 'esperto',masc: true,biform: true,hasp: true,},
	burro: {name: 'burro',masc: true,biform: true,hasp: true,},
	inteligente: {name: 'inteligente',hasp: true,},
	so: {name: 'só',hasp: true,},
	sozinho: {name: 'sozinho',masc: true,biform: true,hasp: true,},
	longo: {name: 'longo',masc: true,biform: true,hasp: true,},
	curto: {name: 'curto',masc: true,biform: true,hasp: true,},
	amplo: {name: 'amplo',masc: true,biform: true,hasp: true,},
	publico: {name: 'público',masc: true,biform: true,hasp: true,},
	privado: {name: 'privado',masc: true,biform: true,hasp: true,},
	atrasado: {name: 'atrasado',masc: true,biform: true,hasp: true,},
	adiantado: {name: 'adiantado',masc: true,biform: true,hasp: true,},
	absoluto: {name: 'absoluto',masc: true,biform: true,hasp: true,},
	principal: {name: 'principal',hasp: true,},
	possivel: {name: 'possível',hasp: true,},
	impossivel: {name: 'impossível',hasp: true,},
	especial: {name: 'especial',hasp: true,},
	recente: {name: 'recente',hasp: true,},
	jovem: {name: 'jovem',hasp: true,},
	real: {name: 'real',hasp: true,},
	diferente: {name: 'diferente',hasp: true,},
	importante: {name: 'importante',hasp: true,},
	portugues: {name: 'português',masc: true,biform: true,hasp: true,},
	brasileiro: {name: 'brasileiro',masc: true,biform: true,hasp: true,},
	italiano: {name: 'italiano',masc: true,biform: true,hasp: true,},
	ingles: {name: 'inglês',masc: true,biform: true,hasp: true,},
	espanhol: {name: 'espanhol',masc: true,biform: true,hasp: true,},
	alemao: {name: 'alemão',masc: true,biform: true,hasp: true,},
	frances: {name: 'francês',masc: true,biform: true,hasp: true,},
	sueco: {name: 'sueco',masc: true,biform: true,hasp: true,},
	argentino: {name: 'argentino',masc: true,biform: true,hasp: true,},
	uruguaio: {name: 'uruguaio',masc: true,biform: true,hasp: true,},
	paraguaio: {name: 'paraguaio',masc: true,biform: true,hasp: true,},
	canadense: {name: 'canadense',hasp: true,},
}

var verbs = {
	ser: {name: 'ser'},
	ir: {name: 'ir'},
	agir: {name: 'agir', regular: true, light: true},
	surgir: {name: 'surgir', regular: true, light: true},
	participar: {name: 'participar', regular: true},
	falar: {name: 'falar', regular: true},
	aquecer: {name: 'aquecer', regular: true, light: true},
	acontecer: {name: 'acontecer', regular: true, light: true},
	agradecer: {name: 'agradecer', regular: true, light: true},
	poer: {name: 'poer', regular: true},
	voar: {name: 'voar', regular: true},
	comprar: {name: 'comprar', regular: true},
	chamar: {name: 'chamar', regular: true},
	corrigir: {name: 'corrigir', regular: true, light: true},
	medir: {name: 'medir', regular: true, light: true},
	pedir: {name: 'pedir', regular: true, light: true},
	ouvir: {name: 'ouvir', regular: true, light: true},
	valer: {name: 'valer', regular: true, light: true},
	chegar: {name: 'chegar', regular: true, light: true},
	feder: {name: 'feder', regular: true,},
	beijar: {name: 'beijar', regular: true,},
	comer: {name: 'comer', regular: true,},
	voltar: {name: 'voltar', regular: true,},
	virar: {name: 'virar', regular: true,},
	pensar: {name: 'pensar', regular: true,},
	lembrar: {name: 'lembrar', regular: true,},
	responder: {name: 'responder', regular: true,},
	perguntar: {name: 'perguntar', regular: true,},
	devolver: {name: 'devolver', regular: true,},
	tornar: {name: 'tornar', regular: true,},
	entrar: {name: 'entrar', regular: true,},
	observar: {name: 'observar', regular: true,},
	continuar: {name: 'continuar', regular: true,},
	escrever: {name: 'escrever', regular: true,},
	sonhar: {name: 'sonhar', regular: true,},
	enjoar: {name: 'enjoar', regular: true,},
	entender: {name: 'entender', regular: true,},
	ensinar: {name: 'ensinar', regular: true,},
	achar: {name: 'achar', regular: true,},
	analisar: {name: 'analisar', regular: true,},
	comeca: {name: 'começar', regular: true},
	iniciar: {name: 'iniciar', regular: true},
	reconhecer: {name: 'reconhecer', regular: true, light: true},
	conhecer: {name: 'conhecer', regular: true, light: true},
	concluir: {name: 'concluir', regular: true,},
	garoar: {name: 'garoar', natural: true,},
	erguer: {name: 'erguer', regular: true, light: true},
}
var verbTypes = [ 'Presente do Indicativo', 'Pretérito Imperfeito do Indicativo', 'Pretérito Perfeito do Indicativo', 'Pretérito Mais-que-Perfeito', 'Futuro do Presente', 'Futuro do Pretérito', 'Presente do Subjuntivo', 'Pretérito Imperfeito do Subjuntivo', 'Futuro do Subjuntivo', 'Imperativo Afirmativo', 'Imperativo Negativo', 'Infinitivo Pessoal', 'Gerùndio', 'Particípio Passado', 'Infinitivo' ];
function conjugate (verb) {
	var radical = verb.name.slice(0, -2);
	var vowel = verb.name.slice(-2).slice(0,1);
	var desinence = vowel.slice(0, 1);
	var altRadical = radical.slice(-1);
	var firstAlt = altRadical;
	if(verb.regular){
		if(verb.light){
			switch(altRadical){
				case 'g':
					if('i' === vowel)
						altRadical = radical.slice(0, -1)+'j';
					else{
						altRadical = radical+'u';
						firstAlt = radical;
					}
					break;
				case 'c': case 'v':
					altRadical = radical.slice(0, -1)+'ç';
					break;
				case 'd':
					if('i' === vowel)
						altRadical = radical.slice(0, -1)+'ç';
					else
						altRadical = radical.slice(0, -1)+'c';
					break;
				case 'l':
					altRadical = radical.slice(0, -1)+'lh';
					break;
				case 'u':
					altRadical = radical.slice(0, -1);
					break;
				default:
					altRadical = radical;
					firstAlt = altRadical;
					break;
			}
		} else {
			altRadical = radical;
			firstAlt = altRadical;
		}

		var conjugates = verbRegular(vowel, radical, altRadical, firstAlt);
	} else {
		var conjugates = verbIrregular(verb, vowel, radical, altRadical, firstAlt);
	}
	verb.gerund = radical+vowel+'ndo';
	switch(vowel){
		case 'a': case 'i':
			verb.participle = radical+vowel+'do';
			break;
		case 'e':
			verb.participle = radical+'ido';
			break;
	}
	return conjugates;
}

function verbRegular (vowel, radical, altRadical, firstAlt) {
	var conjugates = [];
	conjugates[0] = getIndPresent (vowel, radical, altRadical, firstAlt);
	conjugates[1] = getIndPretImperfect (vowel, radical, altRadical);
	conjugates[2] = getIndPretPerfect (vowel, radical, altRadical);
	conjugates[3] = getPlusPerfect (vowel, radical, altRadical);
	conjugates[4] = getFuturePresent(vowel, radical, altRadical);
	conjugates[5] = getFuturePast(vowel, radical, altRadical);
	conjugates[6] = getSubPresent(vowel, radical, altRadical);
	conjugates[7] = getSubPast(vowel, radical, altRadical);
	conjugates[8] = getSubFuture(vowel, radical, altRadical);
	conjugates[9] = getImpAffirmative(vowel, radical, altRadical);
	conjugates[10] = getImpNegative(vowel, radical, altRadical);
	conjugates[11] = getPersonalInfinitive(vowel, radical, altRadical);
	return conjugates;
}

function getIndPresent (vowel, radical, altRadical, firstAlt) {
	var tense = [];
	switch(vowel){
		case 'a': case 'e':
			if('o' === firstAlt.slice(-1))
				tense[0] = `${firstAlt.slice(0, -1)}ôo`;
			else
				tense[0] = `${firstAlt}o`;
			tense[1] = `${radical+vowel}s`;
			tense[2] = `${radical+vowel}`;
			tense[3] = `${radical+vowel}mos`;
			tense[4] = `${radical+vowel}is`;
			tense[5] = `${radical+vowel}m`;
			break;
		case 'i':
			tense[0] = `${altRadical}o`;
			tense[1] = `${radical}es`;
			tense[2] = `${radical}e`;
			tense[3] = `${radical+vowel}mos`;
			tense[4] = `${radical+vowel}s`;
			tense[5] = `${radical}em`;
			break;
	}
	return tense;
}
function getIndPretImperfect (vowel, radical, altRadical) {
	var tense = [];
	switch(vowel){
		case 'a':
			tense[0] = `${radical+vowel}va`;
			tense[1] = `${radical+vowel}vas`;
			tense[2] = `${radical+vowel}va`;
			tense[3] = `${radical}ávamos`;
			tense[4] = `${radical}áveis`;
			tense[5] = `${radical+vowel}vam`;
			break;
		case 'e':
			tense[0] = `${radical}ia`;
			tense[1] = `${radical}ias`;
			tense[2] = `${radical}ia`;
			tense[3] = `${radical}íamos`;
			tense[4] = `${radical}íeis`;
			tense[5] = `${radical}iam`;
			break;
		case 'i':
			tense[0] = `${radical}ia`;
			tense[1] = `${radical}ias`;
			tense[2] = `${radical}ia`;
			tense[3] = `${radical}íamos`;
			tense[4] = `${radical}íeis`;
			tense[5] = `${radical}iam`;
			break;
	}
	return tense;
}
function getIndPretPerfect (vowel, radical, altRadical) {
	var tense = [];
	switch(vowel){
		case 'a':
			tense[0] = `${altRadical}ei`;
			tense[1] = `${radical+vowel}ste`;
			tense[2] = `${radical}ou`;
			tense[3] = `${radical+vowel}mos`;
			tense[4] = `${radical+vowel}stes`;
			tense[5] = `${radical+vowel}ram`;
			break;
		case 'e': case 'i':
			tense[0] = `${radical}i`;
			tense[1] = `${radical+vowel}ste`;
			tense[2] = `${radical+vowel}u`;
			tense[3] = `${radical+vowel}mos`;
			tense[4] = `${radical+vowel}stes`;
			tense[5] = `${radical+vowel}ram`;
			break;
	}
	return tense;
}
function getPlusPerfect (vowel, radical, altRadical) {
	var tense = [];
	switch(vowel){
		case 'a': case 'e': case 'i':
			tense[0] = `${radical+vowel}ra`;
			tense[1] = `${radical+vowel}ras`;
			tense[2] = `${radical+vowel}ra`;
			tense[3] = `${radical+aCuteAccent(vowel)}ramos`;
			tense[4] = `${radical+aCuteAccent(vowel)}reis`;
			tense[5] = `${radical+vowel}ram`;
			break;
	}
	return tense;
}
function getFuturePresent (vowel, radical, altRadical) {
	var tense = [];
	switch(vowel){
		case 'a': case 'e': case 'i':
			tense[0] = `${radical+vowel}rei`;
			tense[1] = `${radical+vowel}rás`;
			tense[2] = `${radical+vowel}rá`;
			tense[3] = `${radical+vowel}remos`;
			tense[4] = `${radical+vowel}reis`;
			tense[5] = `${radical+vowel}rão`;
			break;
	}
	return tense;
}
function getFuturePast (vowel, radical, altRadical) {
	var tense = [];
	switch(vowel){
		case 'a': case 'e': case 'i':
			tense[0] = `${radical+vowel}ria`;
			tense[1] = `${radical+vowel}rias`;
			tense[2] = `${radical+vowel}ria`;
			tense[3] = `${radical+vowel}ríamos`;
			tense[4] = `${radical+vowel}ríeis`;
			tense[5] = `${radical+vowel}riam`;
			break;
	}
	return tense;
}
function getSubPresent (vowel, radical, altRadical) {
	var tense = [];
	switch(vowel){
		case 'a':
			tense[0] = `${altRadical}e`;
			tense[1] = `${altRadical}es`;
			tense[2] = `${altRadical}e`;
			tense[3] = `${altRadical}emos`;
			tense[4] = `${altRadical}eis`;
			tense[5] = `${altRadical}em`;
			break;
		case 'e': case 'i':
			tense[0] = `${altRadical}a`;
			tense[1] = `${altRadical}as`;
			tense[2] = `${altRadical}a`;
			tense[3] = `${altRadical}amos`;
			tense[4] = `${altRadical}ais`;
			tense[5] = `${altRadical}am`;
			break;
	}
	return tense;
}
function getSubPast (vowel, radical, altRadical) {
	var tense = [];
	switch(vowel){
		case 'a': case 'e': case 'i':
			tense[0] = `${radical+vowel}sse`;
			tense[1] = `${radical+vowel}sses`;
			tense[2] = `${radical+vowel}sse`;
			tense[3] = `${radical+aCuteAccent(vowel)}ssemos`;
			tense[4] = `${radical+aCuteAccent(vowel)}sseis`;
			tense[5] = `${radical+vowel}ssem`;
			break;
	}
	return tense;
}
function getSubFuture (vowel, radical, altRadical) {
	var tense = [];
	switch(vowel){
		case 'a': case 'e': case 'i':
			tense[0] = `${radical+vowel}r`;
			tense[1] = `${radical+vowel}res`;
			tense[2] = `${radical+vowel}r`;
			tense[3] = `${radical+vowel}rmos`;
			tense[4] = `${radical+vowel}rdes`;
			tense[5] = `${radical+vowel}rem`;
			break;
	}
	return tense;
}
function getImpAffirmative (vowel, radical, altRadical) {
	var tense = [];
	switch(vowel){
		case 'a':
			tense[0] = '';
			tense[1] = `${radical+vowel}`;
			tense[2] = `${altRadical}e`;
			tense[3] = `${altRadical}emos`;
			tense[4] = `${radical+vowel}is`;
			tense[5] = `${altRadical}em`;
			break;
		case 'e': case 'i':
			tense[0] = '';
			tense[1] = `${radical}e`;
			tense[2] = `${altRadical}a`;
			tense[3] = `${altRadical}amos`;
			tense[4] = `${radical+vowel+(vowel === 'e' ? 'i' : '')}`;
			tense[5] = `${altRadical}am`;
			break;
	}
	return tense;
}
function getImpNegative (vowel, radical, altRadical) {
	var tense = [];
	switch(vowel){
		case 'a':
			tense[0] = '';
			tense[1] = `${altRadical}es`;
			tense[2] = `${altRadical}e`;
			tense[3] = `${altRadical}emos`;
			tense[4] = `${altRadical}eis`;
			tense[5] = `${altRadical}em`;
			break;
		case 'e': case 'i':
			tense[0] = '';
			tense[1] = `${altRadical}as`;
			tense[2] = `${altRadical}a`;
			tense[3] = `${altRadical}amos`;
			tense[4] = `${altRadical}ais`;
			tense[5] = `${altRadical}am`;
			break;
	}
	return tense;
}
function getPersonalInfinitive (vowel, radical, altRadical) {
	var tense = [];
	switch(vowel){
		case 'a': case 'e': case 'i':
			tense[0] = `${radical+vowel}r`;
			tense[1] = `${radical+vowel}res`;
			tense[2] = `${radical+vowel}r`;
			tense[3] = `${radical+vowel}rmos`;
			tense[4] = `${radical+vowel}rdes`;
			tense[5] = `${radical+vowel}rem`;
			break;
	}
	return tense;
}

function aCuteAccent (letter) {
	switch(letter){
		case 'a':
			return 'á';
		case 'e':
			return 'ê';
		case 'i':
			return 'í';
	}
}

window.onload = function () {
	getAllVerbs();
}
var allverbs = [];
function getAllVerbs () {
	for(var item in verbs){
		// console.log('Calling '+verbs[item].name);
		allverbs[item] = conjugate(verbs[item]);
		allverbs[item][allverbs[item].length] = [verbs[item].gerund];
		allverbs[item][allverbs[item].length] = [verbs[item].participle];
		allverbs[item][allverbs[item].length] = [verbs[item].name];
		// console.log(allverbs[item]);
	}
}

const varToString = varObj => Object.keys(varObj)[0];


function verbIrregular (verb, vowel, radical, altRadical, firstAlt) {
	var conjugates = [];
	switch(verb.name){
		case 'ser':
			conjugates[0] = ['sou', 'és', 'é', 'somos', 'sois', 'são'];
			conjugates[1] = ['era', 'eras', 'era', 'éramos', 'éreis', 'eram'];
			conjugates[2] = ['fui', 'foste', 'foi', 'fomos', 'fostes', 'foram'];
			conjugates[3] = ['fora', 'foras', 'fora', 'fôramos', 'fôreis', 'foram'];
			conjugates[4] = getFuturePresent(vowel, radical, altRadical);
			conjugates[5] = getFuturePast(vowel, radical, altRadical);
			conjugates[6] = ['seja', 'sejas', 'seja', 'sejamos', 'sejais', 'sejam'];
			conjugates[7] = ['fosse', 'fosses', 'fosse', 'fôssemos', 'fôsseis', 'fossem'];
			conjugates[8] = ['for', 'fores', 'for', 'formos', 'fordes', 'forem'];
			conjugates[9] = ['', 'sê', 'seja', 'sejamos', 'sede', 'sejam'];
			conjugates[10] = ['', 'sejas', 'seja', 'sejamos', 'sejais', 'sejam'];
			conjugates[11] = getPersonalInfinitive(vowel, radical, altRadical);
			break;
		case 'ir':
			conjugates[0] = ['vou', 'vais', 'vai', 'vamos', 'ides', 'vão'];
			conjugates[1] = getIndPretImperfect (vowel, radical, altRadical);
			conjugates[2] = ['fui', 'foste', 'foi', 'fomos', 'fostes', 'foram'];
			conjugates[3] = ['fora', 'foras', 'fora', 'fôramos', 'fôreis', 'foram'];
			conjugates[4] = getFuturePresent(vowel, radical, altRadical);
			conjugates[5] = getFuturePast(vowel, radical, altRadical);
			conjugates[6] = ['vá', 'vás', 'vá', 'vamos', 'vades', 'vão'];
			conjugates[7] = ['fosse', 'fosses', 'fosse', 'fôssemos', 'fôsseis', 'fossem'];
			conjugates[8] = ['for', 'fores', 'for', 'formos', 'fordes', 'forem'];
			conjugates[9] = ['', 'vai', 'vá', 'vamos', 'ide', 'vão'];
			conjugates[10] = ['', 'vás', 'vá', 'vamos', 'vades', 'vão'];
			conjugates[11] = getPersonalInfinitive(vowel, radical, altRadical);
			break;
	}
	return conjugates;
}
