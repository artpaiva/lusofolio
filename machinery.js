
var analysis = document.getElementById('analysis-field');
var writing = document.getElementById('write');
var typeTimer;

writing.addEventListener('keyup', () => {
    clearTimeout(typeTimer);
    if (writing.value) {
        typeTimer = setTimeout(runAnalysis, 400);
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
	var analysis_now = text.split(/([, .?!\n;—/\(\)")])/g);
	// var analysis_now = text.split(/(?<=[, .?!\n;—/\(\)'")])/);
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

			// Get any number of morphological matches for a given word
			var atual = document.createElement("span");
			atual.classList = 'wrong';
			atual.innerHTML = temp_word;
			var content = [];
			var segments = ['number', 'conjunction', 'preposition', 'article', 'adverb', 'pronoun', 'adjective', 'noun', 'verb'];
			var segmenting = [numbering, conjuctioning, prepositioning, articling, adverbing, pronouning, adjectiving, nouning, verbing];
			// var segments = ['number', 'conjunction'];
			// var segmenting = [numbering, conjuctioning];
			for(var y in segmenting){
				atual.classList = segmenting[y].found ? segments[y] : atual.classList;
				// console.log(segmenting[y].class);
				for(var z in segmenting[y].class){
					if( segmenting[y].class[z] != undefined ){
						if(content.length > 0)
							content[content.length] = `\n- ${segmenting[y].class[z]}`;
						else
							content[content.length] = `- ${segmenting[y].class[z]}`;
					}
				}
			}
			if(content.length === 0){
				content[0] = '???';
			}
			var describe = '';
			for(var y in content){
				describe += content[y];
			}
			atual.setAttribute("description", describe);
			element[element.length] = atual;

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
        case '—':
        case '.':
        case '...':
        case ';':
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
		return{
			found: true,
			class: ['Número Ordinal'],
		}
	}
	return {
		found: false,
		class: [],
	};
}

function suggest (word, tex) {
	var letters = ['a', 'ã', 'ão', 'á', 'b', 'c', 'ç', 'd', 'e', 'é', 'f', 'g', 'h', 'i', 'í', 'j', 'k', 'l', 'lh', 'm', 'n', 'nh', 'o', 'ó', 'õ', 'p', 'q', 'qu', 'r', 'rr', 's', 'ss', 't', 'u', 'ú', 'ü', 'v', 'w', 'x', 'y', 'z'];
	// console.log(`Trying suggestion ${tex} to ${word}.`);
	if(tex.length > 1){
		for(var x = 0; x < tex.length; x++){
			for(var y in letters){
				if(tex.close(x, 1, letters[y]) === word){
					console.log(`Suggestion: change ${tex} to ${word}.`);
					return {
						found: true,
						word: word,
					};
				}
			}
		}
	}
	return {
		found: false,
		word: word,
	};
}
String.prototype.close = function(idx, rem, str) {
    return this.slice(0, idx) + str + this.slice(idx + Math.abs(rem));
};

function isConjunction (text) {
	var tex = text.toLowerCase();
	var classing = [];
	for(var item in conjuctions){
		if (conjuctions[item].name == tex){
			classing[classing.length] = 'Conjunção';
			// return classing;
			return {
				found: true,
				class: classing,
			}
		} else {
			var suggestion = suggest(conjuctions[item].name, tex);
			if(suggestion.found){
				classing[classing.length] = `Suggestion: ${suggestion.word}`;
			}
		}
	}
	return {
		found: false,
		class: classing,
	};
}
function isAdverb (text) {
	var tex = text.toLowerCase();
	var classing = [];
	for(var item in adverbs){
		if (adverbs[item].name == tex){
			classing[classing.length] = 'Advérbio';
			return {
				found: true,
				class: classing,
			}
		} else {
			var suggestion = suggest(adverbs[item].name, tex);
			if(suggestion.found){
				classing[classing.length] = `Suggestion: ${suggestion.word}`;
			}
		}
	}
	return {
		found: false,
		class: classing,
	};
}
function isArticle (text) {
	var tex = text.toLowerCase();
	var classing = [];
	for(var item in articles){
		if (articles[item].name == tex){
			var when = classing.length;
			classing[when] = 'Artigo';
			classing[when] += articles[item].masc ? ' masculino' : ' feminino';
			classing[when] += articles[item].singular ? ' singular' : ' plural';
			classing[when] += articles[item].definite ? ' definido' : ' indefinido';
			return {
				found: true,
				class: classing,
			}
		} else {
			var suggestion = suggest(articles[item].name, tex);
			if(suggestion.found){
				classing[classing.length] = `Suggestion: ${suggestion.word}`;
			}
		}
	}
	return {
		found: false,
		class: classing,
	};
}

function isPronoun (text) {
	var tex = text.toLowerCase();
	var classing = [];
	classing[0] = forPronouns(subPronouns, tex, 'Pronome de Sujeito');
	if (classing[0]) return returnExtra(classing);
	classing[0] = forPronouns(verbPronouns, tex, 'Objeto do Verbo');
	if (classing[0]) return returnExtra(classing);
	classing[0] = forPronouns(prepPronouns, tex, 'Objeto da Preposição');
	if (classing[0]) return returnExtra(classing);
	classing[0] = forPronouns(possPronouns, tex, 'Objeto Possessivo');
	if (classing[0]) return returnExtra(classing);
	classing = [];
	for(var item in pronouns){
		if (pronouns[item].name == tex
		|| (pronouns[item].hasp && tex === getPlural(pronouns[item].name))
		|| (pronouns[item].biform && tex === getGender(pronouns[item].name))
		|| (pronouns[item].biform && tex === getPlural(getGender(pronouns[item].name)))){
			classing[classing.length] = 'Pronome';
			return {
				found: true,
				class: classing,
			}
		} else {
			var suggestion = suggest(pronouns[item].name, tex);
			if(suggestion.found){
				classing[classing.length] = `Suggestion: ${suggestion.word}`;
			}
		}
	}
	return {
		found: false,
		class: classing,
	};
}
function returnExtra (classing) {
	return {
		found: true,
		class: classing,
	}
}
function forPronouns(list, tex, callit){
	for(var item in list){
		if (list[item].name == tex || getPlural(list[item].name) == tex){
			var classing = callit;
			classing += list[item].hasp ? ' pluralizado' : '';
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
	var classing = [];
	for(var item in prepositions){
		if (prepositions[item].name == tex
		|| (prepositions[item].hasp && tex === getPlural(prepositions[item].name))){
			classing[classing.length] = 'Preposição';
			// classing += prepositions[item].hasp ? ' plural' : '';
			return {
				found: true,
				class: classing,
			}
		} else {
			var suggestion = suggest(prepositions[item].name, tex);
			if(suggestion.found){
				classing[classing.length] = `Suggestion: ${suggestion.word}`;
			}
		}
	}
	return {
		found: false,
		class: classing,
	};
}

function isNoun (text, number) {
	var classing = [];
	for(var item in nouns){
		var allform = isAllForms(nouns, item, text);
		if (allform){
			var when = classing.length;
			classing[when] = 'Substantivo';
			// classing += nouns[item].masc ? ' masculino' : ' feminino';
			classing[when] = `${classing[when]} ${allform}`;
			return {
				found: true,
				class: classing,
			}
		} else {
			var suggestion = suggest(nouns[item].name, text);
			if(suggestion.found){
				classing[classing.length] = `Suggestion: ${suggestion.word}`;
			}
		}
	}
	if (/^[A-Z]/.test(text) && number > 1){
		return {
			found: true,
			class: ['Substantivo Próprio'],
		}
	}
	return {
		found: false,
		class: classing,
	};
}
function isAdjective (text) {
	var tex = text.toLowerCase();
	var classing = [];
	for(var item in adjectives){
		var allform = isAllForms(adjectives, item, tex);
		if (allform || tex == `${getAdjectiveForm(adjectives[item].name)}mente`){
			var when = classing.length;
			classing[when] = 'Adjetivo';
			classing[when] += allform ? ` ${allform}` : '';
			return {
				found: true,
				class: classing,
			}
		} else {
			var suggestion = suggest(adjectives[item].name, tex);
			if(suggestion.found){
				classing[classing.length] = `Suggestion: ${suggestion.word}`;
			}
		}
	}
	return {
		found: false,
		class: classing,
	};
}
function getAdjectiveForm (text) {
	var final = text.slice(-1);
	switch(final){
		case 'o':
			var normal = text.slice(0, -1)+'a';
			normal = normal.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
			return normal;
	}
	var normal = text.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
	return normal;
}

function isVerb (text) {
	var tex = text.toLowerCase();
	var classing = [];
	for(var verb in allverbs){
		for(var conjugate in allverbs[verb]){
			for(var item in allverbs[verb][conjugate]){
				var when = classing.length;
				var possible = `Verbo '${allverbs[verb][allverbs[verb].length-1][0]}' no ${verbTypes[conjugate]}`;
				var current = allverbs[verb][conjugate][item];
				var person = (item % 3)+1;
				var number = item >= 3 ? 'plural' : 'singular';
				if (current == tex
					||(conjugate == (allverbs[verb].length - 2) && getCleanFormsHard(current, tex) )){
					if( conjugate < allverbs[verb].length-3){
						classing[when] = `${possible} na ${person}ª pessoa do ${number}`;
					}
					// classing += prepositions[item].hasp ? ' plural' : '';
					return {
						found: true,
						class: classing,
					}
				} else {
					var suggestion = suggest(current, tex);
					if(suggestion.found){
						classing[classing.length] = `Sugestão do ${possible} na ${person}ª pessoa do ${number}: ${suggestion.word}`;
					}
				}
			}
		}
	}
	return {
		found: false,
		class: classing,
	};
}

function isAllForms (list, item, word) {
	var tex = word.toLowerCase();
	var plural = getPlural(list[item].name);
	var gender = getGender(list[item].name);
	var diminutive = getDiminuitive(list[item].name);
	var init = ` '${list[item].name}'`;
	if(list[item].biform)
		init += list[item].masc ? ' masculino' : ' feminino';
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
function getCleanFormsHard (word, tex) {
	word = word.toLowerCase();
	var plural = getPlural(word);
	var gender = getGender(word);
	if(tex === plural){
		return true;
	}
	if(tex === gender){
		return true;
	}
	if(tex === getPlural(gender)){
		return true;
	}
	return false
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
			switch(text){
				case 'irmão': return 'irmãos';
			}
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
function getAugmentative (text, fem) {
	if(fem){
		var final = text.slice(-1);
		switch(final){
			case 'o': case 'e': case 'a':
			return text.slice(0, -1)+'ona';
		}
	} else {
		var bifinal = text.slice(-2);
		switch(bifinal){
			case 'ça':
				return text.slice(0, -1)+'ão';
		}
		var final = text.slice(-1);
		switch(final){
			case 'o': case 'a':
				return text.slice(0, -1)+'ão';
			case 'e':
				return text.slice(0, -1)+'aço';
			case 'm':
				return text.slice(0, -1)+'nzão';
			case 'z': case 'l':
				return text+'zão';
		}
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
		case 'o': case 'e':
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
	moco: {name: 'moço',masc: true,biform: true,hasp: true,},
	estudante: {name: 'estudante',masc: true,hasp: true,},
	pecado: {name: 'pecado',masc: true,hasp: true,},
	frete: {name: 'frete',masc: true,hasp: true,},
	mundo: {name: 'mundo',masc: true,hasp: true,},
	par: {name: 'par',masc: true,hasp: true,},
	ato: {name: 'ato',masc: true,hasp: true,},
	acto: {name: 'acto',masc: true,hasp: true,},
	banho: {name: 'banho',masc: true,hasp: true,},
	hotel: {name: 'hotel',masc: true,hasp: true,},
	soco: {name: 'soco',masc: true,hasp: true,},
	enxovalho: {name: 'enxovalho',masc: true,hasp: true,},
	tapete: {name: 'tapete',masc: true,hasp: true,},
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
	coisa: {name: 'coisa',masc: false,hasp: true,},
	possibilidade: {name: 'possibilidade',masc: false,hasp: true,},
	vergonha: {name: 'vergonha',masc: false,hasp: true,},
	infamia: {name: 'infâmia',masc: false,hasp: true,},
	covardia: {name: 'covardia',masc: false,hasp: true,},
	cobardia: {name: 'cobardia',masc: false,hasp: true,},
	vileza: {name: 'vileza',masc: false,hasp: true,},
	violencia: {name: 'violência',masc: false,hasp: true,},
	angustia: {name: 'angústia',masc: false,hasp: true,},
	porrada: {name: 'porrada',masc: false,hasp: true,},
	paciencia: {name: 'paciência',masc: false,hasp: true,},
	etiqueta: {name: 'etiqueta',masc: false,hasp: true,},
	terra: {name: 'terra',masc: false,hasp: true,},
	forma: {name: 'forma',masc: false,hasp: true,},
	dia: {name: 'dia',masc: true,hasp: true,},
	pe: {name: 'pé',masc: true,hasp: true,},
	mao: {name: 'mão',masc: false,hasp: true,},
	mae: {name: 'mãe',masc: false,hasp: true,},
	vez: {name: 'vez',masc: false,hasp: true,},
	voz: {name: 'voz',masc: false,hasp: true,},
	irmao: {name: 'irmão',masc: true,biform: true,hasp: true,},
	princesa: {name: 'princesa',masc: false,hasp: true,},
	principe: {name: 'príncipe',masc: true,hasp: true,},
	mamae: {name: 'mamãe',masc: false,hasp: true,},
	pai: {name: 'pai',masc: true,hasp: true,},
	papai: {name: 'papai',masc: true,hasp: true,},
	vida: {name: 'vida',masc: false,hasp: true,},
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
	isso: { name: 'isso', masc: true, hasp: true, indefinite: true,},
	disso: { name: 'disso', masc: true, hasp: true, indefinite: true,},
	nisso: { name: 'nisso', masc: true, hasp: true, indefinite: true,},
	esse: { name: 'esse', biform: true, masc: true, hasp: true, indefinite: true,},
	desse: { name: 'desse', biform: true, masc: true, hasp: true, indefinite: true,},
	nesse: { name: 'nesse', biform: true, masc: true, hasp: true, indefinite: true,},
	tanto: { name: 'tanto', biform: true, masc: true, hasp: true, indefinite: true,},
	isto: { name: 'isto', masc: true, hasp: true, indefinite: true,},
	nisto: { name: 'nisto', masc: true, hasp: true, indefinite: true,},
	neste: { name: 'neste', biform: true, masc: true, hasp: true, indefinite: true,},
	deste: { name: 'deste', biform: true, masc: true, hasp: true, indefinite: true,},
	comigo: { name: 'comigo',},
	contigo: { name: 'contigo',},
	consigo: { name: 'consigo',},
	conosco: { name: 'conosco',},
	connosco: { name: 'connosco',},
	convosco: { name: 'convosco',},
	quem: { name: 'quem',},
	qual: { name: 'qual',},
	que: { name: 'que',},
	algo: { name: 'algo',},
	alguem: { name: 'alguém',},
	gente: { name: 'gente',},
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
var possPronouns = {
	meu: { name: 'meu', singular: true, masc: true, person: 1, hasp: true},
	minha: { name: 'minha',  singular: true, masc: false, person: 1, hasp: true},
	teu: { name: 'teu', singular: true, masc: true, person: 2, hasp: true},
	tua: { name: 'tua',  singular: true, masc: false, person: 2, hasp: true},
	seu: { name: 'seu', singular: true, masc: true, person: 3, hasp: true},
	sua: { name: 'sua',  singular: true, masc: false, person: 3, hasp: true},
	nosso: { name: 'nosso', masc: true, person: 1, hasp: true},
	nossa: { name: 'nossa', masc: false, person: 1, hasp: true},
	vosso: { name: 'vosso', masc: true, person: 1, hasp: true},
	vossa: { name: 'vossa', masc: false, person: 1, hasp: true},
	seu1: { name: 'seu', masc: true, person: 3, hasp: true},
	sua2: { name: 'sua', masc: false, person: 3, hasp: true},
};

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
	a: { name: 'a', hasp: true,},
	a1: { name: 'à', hasp: true,},
	ao: { name: 'ao', hasp: true,},
	em: { name: 'em',},
	no: { name: 'no', hasp: true,},
	na: { name: 'na', hasp: true,},
	d: { name: 'd\'',},
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
	apenas: { name: 'apenas',},
	enfim: { name: 'enfim',},
	entao: { name: 'então',},
	nao: { name: 'não',},
	sim: { name: 'sim',},
	mesmo: { name: 'mesmo',},
	sempre: { name: 'sempre',},
	onde: { name: 'onde',},
	qual: { name: 'qual',},
	cade: { name: 'cadê',},
	nunca: { name: 'nunca',},
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
	proposital: {name: 'proposital',hasp: true,},
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
	preferencial: {name: 'preferencial',hasp: true,},
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
	literal: {name: 'literal',hasp: true,},
	irrespondivel: {name: 'irrespondivel',hasp: true,},
	indescupavel: {name: 'indesculpável',hasp: true,},
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
	vil: {name: 'vil',hasp: true,},
	vil1: {name: 'víl',hasp: true,},
	parasita: {name: 'parasita',masc: true,hasp: true,},
	cobarde: {name: 'cobarde',masc: true,hasp: true,},
	covarde: {name: 'covarde',masc: true,hasp: true,},
	superior: {name: 'superior',masc: true,hasp: true,},
	porco: {name: 'porco',masc: true,biform: true,hasp: true,},
	sujo: {name: 'sujo',masc: true,biform: true,hasp: true,},
	submisso: {name: 'submisso',masc: true,biform: true,hasp: true,},
	mesquinho: {name: 'mesquinho',masc: true,biform: true,hasp: true,},
	ridiculo: {name: 'ridículo',masc: true,biform: true,hasp: true,},
	grotesco: {name: 'grotesco',masc: true,biform: true,hasp: true,},
	deus: {name: 'deus',masc: true,biform: true,hasp: true,},
	semideus: {name: 'semideus',masc: true,biform: true,hasp: true,},
	absurdo: {name: 'absurdo',masc: true,biform: true,hasp: true,},
	comico: {name: 'cômico',masc: true,biform: true,hasp: true,},
	comico1: {name: 'cómico',masc: true,biform: true,hasp: true,},
	erroneo: {name: 'errôneo',masc: true,biform: true,hasp: true,},
	erroneo1: {name: 'erróneo',masc: true,biform: true,hasp: true,},
	arrogante: {name: 'arrogante',hasp: true,},
	infame: {name: 'infame',hasp: true,},
	infame1: {name: 'ínfame',hasp: true,},
	infame2: {name: 'infâme',hasp: true,},
	rele: {name: 'rele',hasp: true,},
	financeiro: {name: 'financeiro',masc: true,biform: true,hasp: true,},
	campeao: {name: 'campeão',masc: true,biform: true,hasp: true,},
	farto: {name: 'farto',masc: true,biform: true,hasp: true,},
	largo: {name: 'largo',masc: true,biform: true,hasp: true,},
}

var verbs = {
	ser: {name: 'ser'},
	ter: {name: 'ter'},
	ir: {name: 'ir'},
	haver: {name: 'haver'},
	estar: {name: 'estar'},
	dar: {name: 'dar'},
	poder: {name: 'poder', regular: true, light: true},
	seguir: {name: 'seguir', regular: true, light: true},
	preferir: {name: 'preferir', regular: true, light: true},
	caber: {name: 'caber', regular: true},
	saber: {name: 'saber', regular: true},
	agir: {name: 'agir', regular: true, light: true},
	reagir: {name: 'reagir', regular: true, light: true},
	surgir: {name: 'surgir', regular: true, light: true},
	participar: {name: 'participar', regular: true},
	falar: {name: 'falar', regular: true},
	levar: {name: 'levar', regular: true},
	sentir: {name: 'sentir', regular: true},
	trair: {name: 'trair', regular: true},
	lavar: {name: 'lavar', regular: true},
	calar: {name: 'calar', regular: true},
	tentar: {name: 'tentar', regular: true},
	criar: {name: 'criar', regular: true},
	verificar: {name: 'verificar', regular: true},
	procurar: {name: 'procurar', regular: true},
	confessar: {name: 'confessar', regular: true},
	agachar: {name: 'agachar', regular: true},
	pagar: {name: 'pagar', regular: true},
	piscar: {name: 'piscar', regular: true},
	contar: {name: 'contar', regular: true},
	sofrer: {name: 'sofrer', regular: true},
	olhar: {name: 'olhar', regular: true},
	titubear: {name: 'titubear', regular: true},
	aquecer: {name: 'aquecer', regular: true, light: true},
	acontecer: {name: 'acontecer', regular: true, light: true},
	nascer: {name: 'nascer', regular: true, light: true},
	descer: {name: 'descer', regular: true, light: true},
	agradecer: {name: 'agradecer', regular: true, light: true},
	poer: {name: 'poer', regular: true},
	voar: {name: 'voar', regular: true},
	doar: {name: 'doar', regular: true},
	fascinar: {name: 'fascinar', regular: true},
	jogar: {name: 'jogar', regular: true, light: true},
	equivaler: {name: 'equivaler', regular: true, light: true},
	enrolar: {name: 'enrolar', regular: true},
	comprar: {name: 'comprar', regular: true},
	chamar: {name: 'chamar', regular: true},
	amar: {name: 'amar', regular: true},
	corrigir: {name: 'corrigir', regular: true, light: true},
	medir: {name: 'medir', regular: true, light: true},
	pedir: {name: 'pedir', regular: true, light: true},
	emprestar: {name: 'emprestar', regular: true,},
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
	tomar: {name: 'tomar', regular: true,},
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
	garoar: {name: 'garoar', natural: true, regular: true,},
	erguer: {name: 'erguer', regular: true, light: true},
	por: {name: 'pôr', regular: true},
	supor: {name: 'supor', regular: true},
	repor: {name: 'repor', regular: true},
	dispor: {name: 'dispor', regular: true},
	pospor: {name: 'pospor', regular: true},
	prepor: {name: 'prepor', regular: true},
	propor: {name: 'propor', regular: true},
	sobpor: {name: 'sobpor', regular: true},
	sotopor: {name: 'sotopor', regular: true},
	antepor: {name: 'antepor', regular: true},
	sobrepor: {name: 'sobrepor', regular: true},
	superpor: {name: 'superpor', regular: true},
	entrepor: {name: 'entrepor', regular: true},
	interpor: {name: 'interpor', regular: true},
	justapor: {name: 'justapor', regular: true},
}
var verbTypes = [ 'Presente do Indicativo', 'Pretérito Imperfeito do Indicativo', 'Pretérito Perfeito do Indicativo', 'Pretérito Mais-que-Perfeito', 'Futuro do Presente', 'Futuro do Pretérito', 'Presente do Subjuntivo', 'Pretérito Imperfeito do Subjuntivo', 'Futuro do Subjuntivo', 'Imperativo Afirmativo', 'Imperativo Negativo', 'Infinitivo Pessoal', 'Gerùndio', 'Particípio Passado', 'Infinitivo' ];
function conjugate (verb) {
	var radical = verb.name.slice(0, -2);
	var vowel = verb.name.slice(-2).slice(0,1);
	if(vowel === 'ô'){
		vowel = 'o';
	}
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
					firstAlt = altRadical;
					break;
				case 'd':
					if('i' === vowel)
						altRadical = radical.slice(0, -1)+'ç';
					else
						altRadical = radical.slice(0, -1)+'c';
					if('pod' === radical)
						altRadical = radical.slice(0, -1)+'ss';
					firstAlt = altRadical;
					break;
				case 'l':
					altRadical = radical.slice(0, -1)+'lh';
					firstAlt = altRadical;
					break;
				case 'u':
					altRadical = radical.slice(0, -1);
					firstAlt = altRadical;
					break;
				default:
					altRadical = radical;
					firstAlt = altRadical;
					break;
			}
			switch(radical){
				case 'segu': case 'prefer':
					altRadical = altRadical.replaceAt(altRadical.lastIndexOf('e'), 'i');
			}
		} else {
			altRadical = radical;
			firstAlt = altRadical;
		}

		var conjugates = verbRegular(vowel, radical, altRadical, firstAlt, verb.name);
	} else {
		var conjugates = verbIrregular(verb, vowel, radical, altRadical, firstAlt);
	}
	verb.gerund = radical+vowel+'ndo';
	switch(vowel){
		case 'a':
			verb.participle = radical+vowel+'do';
			break;
		case 'e':
			verb.participle = radical+'ido';
			break;
		case 'i':
			verb.participle = radical+vowel+'do';
			verb.participlus = radical+'ído';
			break;
		case 'o':
			verb.participle = radical+'osto';
			break;
	}
	return conjugates;
}
String.prototype.replaceAt=function(index, replacement) {
    return this.substr(0, index) + replacement+ this.substr(index + replacement.length);
}

function verbRegular (vowel, radical, altRadical, firstAlt, name) {
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
	conjugates[11] = getPersonalInfinitive(vowel, radical, altRadical, name);
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
			var consonants = isHas(radical);
			if(consonants){
				tense[0] = `${consonants[0]}ai${consonants[1]}o`;
			}
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
		case 'o':
			tense[0] = `${radical+vowel}nho`;
			tense[1] = `${radical}ões`;
			tense[2] = `${radical}õe`;
			tense[3] = `${radical+vowel}mos`;
			tense[4] = `${radical+vowel}s`;
			tense[5] = `${radical}õem`;
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
		case 'o':
			tense[0] = `${radical}unha`;
			tense[1] = `${radical}unhas`;
			tense[2] = `${radical}unha`;
			tense[3] = `${radical}únhamos`;
			tense[4] = `${radical}únheis`;
			tense[5] = `${radical}unham`;
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
			var consonants = isHas(radical);
			if(consonants){
				tense[0] = `${consonants[0]}ou${consonants[1]}e`;
				tense[1] = `${consonants[0]}ou${consonants[1]}este`;
				tense[2] = `${consonants[0]}ou${consonants[1]}e`;
				tense[3] = `${consonants[0]}ou${consonants[1]}emos`;
				tense[4] = `${consonants[0]}ou${consonants[1]}estes`;
				tense[5] = `${consonants[0]}ou${consonants[1]}eram`;
			}
			break;
		case 'o':
			tense[0] = `${radical}us`;
			tense[1] = `${radical}useste`;
			tense[2] = `${radical}ôs`;
			tense[3] = `${radical}usemos`;
			tense[4] = `${radical}usestes`;
			tense[5] = `${radical}useram`;
			break;
	}
	return tense;
}
function isHas (radical) {
	var option = ['cab', 'hav', 'sab'];
	for(now in option){
		if(radical === option[now]){
			return [ option[now].slice(0, 1), option[now].slice(-1)];
		}
	}
	return false;
}
function getPlusPerfect (vowel, radical, altRadical) {
	var tense = [];
	switch(vowel){
		case 'a': case 'e': case 'i':
			var consonants = isHas(radical);
			tense[0] = `${radical+vowel}ra`;
			tense[1] = `${radical+vowel}ras`;
			tense[2] = `${radical+vowel}ra`;
			tense[3] = `${radical+aCuteAccent(vowel)}ramos`;
			tense[4] = `${radical+aCuteAccent(vowel)}reis`;
			tense[5] = `${radical+vowel}ram`;
			if(consonants){
				tense[0] = `${consonants[0]}ou${consonants[1]}era`;
				tense[1] = `${consonants[0]}ou${consonants[1]}eras`;
				tense[2] = `${consonants[0]}ou${consonants[1]}era`;
				tense[3] = `${consonants[0]}ou${consonants[1]}éramos`;
				tense[4] = `${consonants[0]}ou${consonants[1]}éreis`;
				tense[5] = `${consonants[0]}ou${consonants[1]}eram`;
			}
			break;
		case 'o':
			tense[0] = `${radical}usera`;
			tense[1] = `${radical}useras`;
			tense[2] = `${radical}usera`;
			tense[3] = `${radical}uséramos`;
			tense[4] = `${radical}uséreis`;
			tense[5] = `${radical}useram`;
			break;
	}
	return tense;
}
function getFuturePresent (vowel, radical, altRadical) {
	var tense = [];
	switch(vowel){
		case 'a': case 'e': case 'i': case 'o':
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
		case 'a': case 'e': case 'i': case 'o':
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
		case 'o':
			tense[0] = `${radical+vowel}nha`;
			tense[1] = `${radical+vowel}nhas`;
			tense[2] = `${radical+vowel}nha`;
			tense[3] = `${radical+vowel}nhamos`;
			tense[4] = `${radical+vowel}nheis`;
			tense[5] = `${radical+vowel}nham`;
			break;
	}
	return tense;
}
function getSubPast (vowel, radical, altRadical) {
	var tense = [];
	switch(vowel){
		case 'o': vowel = 'use';
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
		case 'o': vowel = 'use';
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
		case 'o':
			tense[0] = '';
			tense[1] = `${radical}õe`;
			tense[2] = `${radical+vowel}nha`;
			tense[3] = `${radical+vowel}nhamos`;
			tense[4] = `${radical+vowel}nde`;
			tense[5] = `${radical+vowel}nham`;
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
		case 'o': altRadical = radical+'onh';
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
function getPersonalInfinitive (vowel, radical, altRadical, name) {
	var tense = [];
	switch(vowel){
		case 'a': case 'e': case 'i': case 'o':
			tense[0] = name;
			tense[1] = `${radical+vowel}res`;
			tense[2] = name;
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
		case 'use':
			return 'usé';
	}
	return letter;
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
		if(verbs[item].participlus){
			allverbs[item][allverbs[item].length] = [verbs[item].participle, verbs[item].participlus];
		} else {
			allverbs[item][allverbs[item].length] = [verbs[item].participle];
		}
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
			conjugates[11] = getPersonalInfinitive(vowel, radical, altRadical, verb.name);
			break;
		case 'ter':
			conjugates[0] = ['tenho', 'tens', 'tem', 'temos', 'tendes', 'têm'];
			conjugates[1] = ['tinha', 'tinhas', 'tinha', 'tínhamos', 'tínheis', 'tinham'];
			conjugates[2] = ['tive', 'tiveste', 'teve', 'tivemos', 'tivestes', 'tiveram'];
			conjugates[3] = ['tivera', 'tiveras', 'tivera', 'tivéramos', 'tivéreis', 'tiveram'];
			conjugates[4] = getFuturePresent(vowel, radical, altRadical);
			conjugates[5] = getFuturePast(vowel, radical, altRadical);
			conjugates[6] = ['tenha', 'tenhas', 'tenha', 'tenhamos', 'tenhais', 'tenham'];
			conjugates[7] = ['tivesse', 'tivesses', 'tivesse', 'tivéssemos', 'tivésseis', 'tivessem'];
			conjugates[8] = ['tiver', 'tiveres', 'tiver', 'tivermos', 'tiverdes', 'tiverem'];
			conjugates[9] = ['', 'tem', 'tenha', 'tenhamos', 'tende', 'tenham'];
			conjugates[10] = ['', 'tenhas', 'tenha', 'tenhamos', 'tendes', 'tenham'];
			conjugates[11] = getPersonalInfinitive(vowel, radical, altRadical, verb.name);
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
			conjugates[11] = getPersonalInfinitive(vowel, radical, altRadical, verb.name);
			break;
		case 'haver':
			conjugates[0] = ['hei', 'hás', 'há', 'havemos', 'haveis', 'hão'];
			conjugates[1] = getIndPretImperfect (vowel, radical, altRadical);
			conjugates[2] = getIndPretPerfect (vowel, radical, altRadical);
			conjugates[3] = getPlusPerfect(vowel, radical, altRadical);
			conjugates[4] = getFuturePresent(vowel, radical, altRadical);
			conjugates[5] = getFuturePast(vowel, radical, altRadical);
			conjugates[6] = irregularSubPresent(vowel, radical, altRadical, false);
			// conjugates[7] = ['fosse', 'fosses', 'fosse', 'fôssemos', 'fôsseis', 'fossem'];
			// conjugates[8] = ['for', 'fores', 'for', 'formos', 'fordes', 'forem'];
			conjugates[9] = ['', 'há', 'haja', 'hajamos', 'havei', 'hajam'];
			conjugates[10] = irregularSubPresent(vowel, radical, altRadical, true);
			conjugates[11] = getPersonalInfinitive(vowel, radical, altRadical, verb.name);
			break;
		case 'estar':
			conjugates[0] = irregularPresent(vowel, radical, altRadical);
			conjugates[1] = getIndPretImperfect (vowel, radical, altRadical);
			conjugates[2] = ['estive', 'estiveste', 'estive', 'estivemos', 'estivestes', 'estiveram'];
			conjugates[3] = getPlusPerfect('e', 'estiv', altRadical);
			conjugates[4] = getFuturePresent(vowel, radical, altRadical);
			conjugates[5] = getFuturePast(vowel, radical, altRadical);
			conjugates[6] = irregularSubPresent(vowel, radical, altRadical, false);
			conjugates[7] = getSubPast('e', 'estiv', altRadical);
			conjugates[8] = getSubFuture('e', 'estiv', altRadical);
			conjugates[9] = ['', 'está', 'esteja', 'estejamos', 'estai', 'estejam'];
			conjugates[10] = irregularSubPresent(vowel, radical, altRadical, true);
			conjugates[11] = getPersonalInfinitive(vowel, radical, altRadical, verb.name);
			break;
		case 'dar':
			conjugates[0] = irregularPresent(vowel, radical, altRadical);
			conjugates[1] = getIndPretImperfect (vowel, radical, altRadical);
			conjugates[2] = ['dei', 'deste', 'deu', 'demos', 'destes', 'deram'];
			conjugates[3] = getPlusPerfect('e', radical, altRadical);
			conjugates[4] = getFuturePresent(vowel, radical, altRadical);
			conjugates[5] = getFuturePast(vowel, radical, altRadical);
			conjugates[6] = ['dê', 'dês', 'dê', 'demos', 'deis', 'deem'];
			conjugates[7] = getSubPast('e', radical, altRadical);
			conjugates[8] = getSubFuture('e', radical, altRadical);
			conjugates[9] = ['', 'dá', 'dê', 'demos', 'dai', 'deem'];
			conjugates[10] = ['', 'dês', 'dê', 'demos', 'deis', 'deem'];
			conjugates[11] = getPersonalInfinitive(vowel, radical, altRadical, verb.name);
			break;
	}
	return conjugates;
}
function irregularPresent(vowel, radical, altRadical){
	var tense = []
	switch(vowel){
		case 'a':
			tense[0] = `${radical}ou`;
			tense[1] = `${radical}ás`;
			tense[2] = `${radical}á`;
			tense[3] = `${radical}amos`;
			tense[4] = `${radical}ais`;
			tense[5] = `${radical}ão`;
			break;
	}
	return tense;
}
function irregularSubPresent(vowel, radical, altRadical, imperative){
	var tense = []
	switch(vowel){
		case 'a':
			if (!imperative)
				tense[0] = `${radical}eja`;
			else
				tense[0] = '';
			tense[1] = `${radical}ejas`;
			tense[2] = `${radical}eja`;
			tense[3] = `${radical}ejamos`;
			tense[4] = `${radical}ejais`;
			tense[5] = `${radical}ejam`;
			break;
		case 'e':
			radical = radical.slice(0, -1);
			if (!imperative)
				tense[0] = `${radical}ja`;
			else
				tense[0] = '';
			tense[1] = `${radical}jas`;
			tense[2] = `${radical}ja`;
			tense[3] = `${radical}jamos`;
			tense[4] = `${radical}jais`;
			tense[5] = `${radical}jam`;
			break;
	}
	return tense;
}
function diphtongTenses(vowel, radical, altRadical) {
	// Verbo cair, sair
}
function xerTenses(vowel, radical, altRadical) {
	// Verbo ler, crer, descrer
}

function isVowel (letter) {
	var vowels = ['a', 'e', 'i', 'o', 'u'];
	for(now in vowels){
		if(letter === vowels[now]){
			return true
		}
	}
	return false;
}
