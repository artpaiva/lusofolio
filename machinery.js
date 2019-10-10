
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
			var verbing = isVerb(temp_word);
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
			} else if(verbing){
				createMeta(temp_word, 'verb', verbing);
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
var pronomes = [ 'Eu', 'Tu', 'Ele/Ela/Você', 'Nós', 'Vós', 'Eles/Elas/Vocês' ]
function isPronoun (text) {
	var tex = text.toLowerCase();
	for(var item in pronouns){
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
	for(var item in nouns){
		var allform = getAllforms(nouns, item, text);
		if (allform){
			var classing = 'substantivo';
			// classing += nouns[item].masc ? ' masculino' : ' feminino';
			classing = `${classing} ${allform}`;
			return classing;
		}
	}
	if (/^[A-Z]/.test(text)){
		return 'substantivo próprio';
	}
	return false;
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
	var init = nouns[item].masc ? ' masculino' : ' feminino';
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
	amor: {name: 'amor',masc: true,hasp: true,},
	floresta: {name: 'floresta',masc: false,hasp: true,},
	montanha: {name: 'montanha',masc: false,hasp: true,},
	rua: {name: 'rua',masc: false,hasp: true,},
	estrada: {name: 'estrada',masc: false,hasp: true,},
	chuva: {name: 'chuva',masc: false,hasp: true,},
	bruega: {name: 'bruega',masc: false,hasp: true,definition: 'Chuva passageira',},
	cidade: {name: 'cidade',masc: false,hasp: true,},
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
	alem: { name: 'além',},
	alias: { name: 'aliás',},
	enfim: { name: 'enfim',},
	finalmente: { name: 'finalmente',},
}

var verbs = {
	agir: {name: 'agir', regular: true, light: true},
	participar: {name: 'participar', regular: true},
	falar: {name: 'falar', regular: true},
	aquecer: {name: 'aquecer', regular: true, light: true},
	acontecer: {name: 'acontecer', regular: true, light: true},
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
}
var verbTypes = [ 'Presente do Indicativo', 'Pretérito Imperfeito do Indicativo', 'Pretérito Perfeito do Indicativo', 'Pretérito Mais-que-Perfeito', 'Futuro do Presente', 'Futuro do Pretérito', 'Presente do Subjuntivo', 'Pretérito Imperfeito do Subjuntivo', 'Futuro do Subjuntivo', 'Imperativo Afirmativo', 'Imperativo Negativo', 'Infinitivo Pessoal', 'Gerùndio', 'Particípio Passado', 'Infinitivo' ];
function conjugate (verb) {
	var radical = verb.name.slice(0, -2);
	var vowel = verb.name.slice(-2).slice(0,1);
	var desinence = vowel.slice(0, 1);
	var altRadical = radical.slice(-1);
	if(verb.light){
		switch(altRadical){
			case 'g':
				if('i' === vowel)
					altRadical = radical.slice(0, -1)+'j';
				else
					altRadical = radical+'u';
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
			default:
				altRadical = radical;
		}
	} else {
		altRadical = radical;
	}

	var conjugates = verbRegular(vowel, radical, altRadical);
	verb.gerund = radical+vowel+'ndo';
	switch(vowel){
		case 'a': case 'i':
			verb.participle = radical+vowel+'do';
			break;
		case 'e':
			verb.participle = radical+'ido';
			break;
	}
	for(var tell in conjugates){
		for(var kind in conjugates[tell]){
			// console.log(`\t${pronomes[kind]} ${conjugates[tell][kind]}`);
		}
	}
	return conjugates;
}

function verbRegular (vowel, radical, altRadical) {
	var conjugates = [];
	conjugates[0] = getIndPresent (vowel, radical, altRadical);
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

function getIndPresent (vowel, radical, altRadical) {
	var tense = [];
	switch(vowel){
		case 'a': case 'e':
			if('o' === altRadical.slice(-1))
				tense[0] = `${altRadical.slice(0, -1)}ôo`;
			else
				tense[0] = `${altRadical}o`;
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
