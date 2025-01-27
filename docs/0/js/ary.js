class Serializer {
    constructor() {
        this._S = new Splitter();
        this._T = new TypeParser();
    }
    read(text) {
        console.log(/^ary[\.: =]/.test(text))
        if (/^ary[\.: =]/.test(text)) {return this.#ary(text)}
    }
    #ary(text) {
        const match = text.match(/^ary(?<name>\.[_a-zA-Z][_a-zA-Z0-9]*)?(?<type>:(s|i(H|8|16|32|36)?|b|f|str|int(H|8|16|32|36)|bln|flt))?(?<defVal>=(.+))? (?<valueText>.+)/)
        //const match = text.match(/^ary(?<name>\.[_a-zA-Z][_a-zA-Z0-9]*)?(?<type>:((s|str|string)|(i|int|integer)(H|8|12|16|24|32|36)?|(b|bln|boolean)|(f|flt|float))?(?<defVal>=(.+))? (?<valueText>.+)/)
        if (match) {
            console.log('OK', match)
//            const textValues = match.groups.valueText.split(' ')
//            return textValues 
            const type = this._T.read(match.groups.type, match.groups.defVal);
            const textValues = this._S.split(match.groups.valueText);
            const values = textValues.map(t=>this._T.deserialize(type, t));
            // values.map(v=>this._V.validate(v))
            return values;
        } else {console.log('NO')}
    }
}
class Splitter {
    constructor() {
        this._candidates = [' ',',',';','\t']
    }
    split(text) {
        const D = this.#suggestDelimiter(text);
        return D ? text.split(D) : text;
    }
    #suggestDelimiter(text) {
        if (text.includes(' ') && !text.includes(',') && !text.includes(';') && !text.includes('\t')) {return ' '}
        else if (text.includes(',') && !text.includes(';') && !text.includes('\t')) {return ','}
        else if (text.includes(';') && !text.includes('\t')) {return ';'}
        else if (text.includes('\t')) {return '\t'}
        else {return ''}
    }
}
class DataType {
    constructor(id='string', defaultValue='') {
        this._id = id;
        this._defaultValue = defaultValue;
    }
    get alias() {return 's|str|string'.split('|')}
    deserialize(text) {return text}
}
class RegExpDataType extends DataType {
    constructor(defVal=null) {
        super('regexp', defVal ?? null);
        const l = text.lastIndexOf('/');
        this._pattern = text.slice(0, l);
        this._option = text.slice(l);
    }
    get pattern() {return this._pattern}
    get option() {return this._option}
    get alias() {return 'r|reg|regexp'.split('|')}
    deserialize(text, type) {
//        const l = text.lastIndexOf('/')
//        const pattern = text.slice(0, l)
//        const options = text.slice(l)
//        return new RegExp(pattern, options)
        return new RegExp(type.pattern, type.option)
    }
}

class IntDataType extends DataType {
    constructor(base=10, defVal=0) {
        super('integer', defVal ?? 0);
        this._base = base;
    }
    get base() {return this._base}
    get alias() {return 'i|int|integer'.split('|')}
    get baseAlias() {return 'H|8|12|16|24|32|36'.split('|')}
    deserialize(text, type) {return parseInt(text, type.base)}
}
class RangeDataType extends DataType {
    constructor(defVal=0, min=0, max=100) {
        super('range', defVal ?? 0);
        this._min = min; // range.age(0,0,100)
        this._max = max; // cols(age:range.age=5)
    }
    get alias() {return 'rng|range'.split('|')} // rはRegExpのために取っておく
}
class BooleanDataType extends DataType {
    constructor(defVal=false) {
        super('boolean', defVal ?? false);
    }
    get alias() {return 'b|bln|boolean'.split('|')}
    get valueTexts() {return ['_','v']}
    deserialize(text, type) {
        if ('_'===text) {return false}
        else if ('v'===text) {return true}
        else {throw new TypeError(`真偽値は_かvで表現されます。それ以外の値は無効です。:${text}`)}
    }
}
class TypeParser {
    constructor() {
        this._string = new DataType();
        this._integer = new IntDataType();
        this._float = new DataType('float',0.0);
        this._boolean = new BooleanDataType();
    }
    read(typeTxt, defValTxt) {
        if (['s','str','string'].some(t=>t===typeTxt)) {return  new DataType()}
        //else if (['i','int','integer'].some(t=>t===type)) {return parseInt(text)}
        else if ('i|int|integer'.split('|').some(t=>t===typeTxt) && (!defValTxt || defValTxt && 'H|8|12|16|24|32|36'.split('|').some(b=>b===defValTxt))){
//        else if (let match = text.match(/(?<type>(i|int|integer))(?<base>(H|8|12|16|24|32|36))?/)){
//        else if (/(?<type>(i|int|integer))(?<base>(H|8|12|16|24|32|36))?/.test(text)){
//            const match = text.match(/(?<type>(i|int|integer))(?<base>(H|8|12|16|24|32|36))?/);
            const type = match.groups.type;
            const base = match.groups.base;
            return parseInt(text, 'H'===base ? 16 : parseInt(base))
            return new IntDataType('H'===base ? 16 : parseInt(base), defVal)
        }
        else if (['f','flt','float'].some(t=>t===typeTxt)) {return parseFloat(text)}
        //else if (['b','bln','boolean'].some(t=>t===type)) {return !!parseInt(text)}
        else if (['b','bln','boolean'].some(t=>t===typeTxt)) {
            return new DataType(['1','v'].some(v=>v===defValTxt));
//            if (/[01]/.test(text)) {return !!parseInt(text)}
//            else if(/[_v]/.test(value)) {return 'v'===value}
//            else {throw new TypeError(`boolean型は0/1,_/vにて偽と真を表します。それ以外の値は不正値です。`)}
        }
        else {return new DataType()}
    }
    serialize(type, value) {
        return null
    }
    deserialize(type, text) {
        if ('string'===type.id) {return text}
        else if ('integer'===type.id) {return parseInt(text, type.base)}
        else if ('float'===type.id) {return parseFloat(text)}
        else if ('boolean'===type.id) {return this._boolean.deserialize(text)}
//            if (/[01]/.test(text)) {return !!parseInt(text)}
//            else if(/[_v]/.test(value)) {return 'v'===value}
        else {return text}
    }
    /*
    deserialize(type, text) {
        if (['s','str','string'].some(t=>t===type)) {return text}
        //else if (['i','int','integer'].some(t=>t===type)) {return parseInt(text)}
        else if (let match = text.match(/(?<type>(i|int|integer))(?<base>(H|8|12|16|24|32|36))?/)){
//        else if (/(?<type>(i|int|integer))(?<base>(H|8|12|16|24|32|36))?/.test(text)){
//            const match = text.match(/(?<type>(i|int|integer))(?<base>(H|8|12|16|24|32|36))?/);
            const type = match.groups.type;
            const base = match.groups.base;
            return parseInt(text, 'H'===base ? 16 : parseInt(base))
        }
        else if (['f','flt','float'].some(t=>t===type)) {return parseFloat(text)}
        //else if (['b','bln','boolean'].some(t=>t===type)) {return !!parseInt(text)}
        else if (['b','bln','boolean'].some(t=>t===type)) {
            if (/[01]/.test(text)) {return !!parseInt(text)}
            else if(/[_v]/.test(value)) {return 'v'===value}
            else {throw new TypeError(`boolean型は0/1,_/vにて偽と真を表します。それ以外の値は不正値です。`)}
        }
        else {return text}
    }
    */
}
class Parser {
    parse(type, value) {

    }
}

const s = new Serializer()
console.log(s.read('ary A B C'))
console.log(s.read('ary 1 2 3'))
s.read('ary A B C')
s.read('ary 1 2 3')
