;(function(){
class Textbase {
    constructor() {
        this._D = [new ArrayDeserializer()]
    }
    serialize(obj) {// JSオブジェクトをTextbase書式のテキストに変換する
    }
    deserialize(text) {// Textbase書式のテキストをJSオブジェクトに変換する
        for (let d of this._D) {
            const vals = d.deserialize(text)
            if (undefined!==vals) {return vals}
        }
    }
}
class ArrayDeserializer {
    constructor() {
        this._S = new Splitter();
        this._T = new TypeParser();
    }
    deserialize(text) {
        console.log(/^ary[\.: =]/.test(text))
        if (/^ary[\.: =]/.test(text)) {return this.#ary(text)}
    }
    #ary(text) {
        const match = text.match(/^ary(?<name>\.[_a-zA-Z][_a-zA-Z0-9]*)?(?<type>:(s|i(H|8|16|32|36)?|b|f|str|int(H|8|16|32|36)|bln|flt))?(?<defVal>=(.+))? (?<valueText>.+)/)
        if (match) {
            const textValues = this._S.split(match.groups.valueText);
            const type = this._T.read(match.groups.type, match.groups.defVal, textValues);
            const values = textValues.map(t=>type.deserialize(t));
            return values;
        } else {console.log('Not Array format.')}
    }
}
class ObjectDeserializer {
    constructor() {
        this._S = new Splitter();
        this._T = new TypeParser();
    }
    deserialize(text) {
        console.log(/^ary[\.: =]/.test(text))
        if (/^ary[\.: =]/.test(text)) {return this.#obj(text)}
    }
    #obj(text) {
        const match = text.match(/^obj(?<name>\.[_a-zA-Z][_a-zA-Z0-9]*)?(?<types>:\([\S]+\))? (?<valueText>.+)/)
        if (match) {
            const textValues = this._S.split(match.groups.valueText);
            const types = match.groups.types ? this.#types(match.groups.types) : {}
            const type = this._T.read(match.groups.type, match.groups.defVal, textValues);
            const values = textValues.map(t=>type.deserialize(t));
            return values;
        } else {console.log('Not Array format.')}
    }
    #types(text) { // {type,defaultValue}
        const texs = text.split(',')
        return texs.map(t=>{const s = t.split('='); return ({type:s[0],defaultValue:s[1]})})
    }
}

class Splitter {
    constructor() {
        this._candidates = [' ',',',';','\t']
    }
    split(text) {
        const D = this.suggestDelimiter(text);
        return D ? text.split(D) : text;
    }
    suggestDelimiter(text) {
        if (text.includes(' ') && !text.includes(',') && !text.includes(';') && !text.includes('\t')) {return ' '}
        else if (text.includes(',') && !text.includes(';') && !text.includes('\t')) {return ','}
        else if (text.includes(';') && !text.includes('\t')) {return ';'}
        else if (text.includes('\t')) {return '\t'}
        else {return ''}
    }
}
class TypeParser {
    constructor() {
        this._string = new DataType();
        this._integer = new IntDataType();
        this._float = new DataType('float',0.0);
        this._boolean = new BooleanDataType();
    }
    read(typeTxt, defValTxt, textValues) {
        if (['s','str','string'].some(t=>t===typeTxt)) {return  new DataType()}
        else if ('i|int|integer'.split('|').some(t=>t===typeTxt) && (!defValTxt || defValTxt && 'H|8|12|16|24|32|36'.split('|').some(b=>b===defValTxt))){
            const type = match.groups.type;
            const base = match.groups.base;
            return new IntDataType('H'===base ? 16 : parseInt(base), defVal)
        }
        else if (['f','flt','float'].some(t=>t===typeTxt)) {return new FloatDataType()}
        else if (['b','bln','boolean'].some(t=>t===typeTxt)) {return new BooleanDataType()}
        else {return this.#suggestFromValueText(textValues)}
    }
    #suggestFromValueText(textValues) {
        console.log(`suggestFromValueText:`, textValues)
        // ^$ で空文字判定する。空文字を許可するには ^(.+)?$ とする。
        if (textValues.every(t=>/^((\-)?[0-9]+)?$/.test(t))){console.log('Int10');return new IntDataType()}
        else if (textValues.every(t=>/^(0b[01]+)?$/.test(t))){console.log('Int2');return new IntDataType(2)}
        else if (textValues.every(t=>/^(0o[0-7]+)?$/.test(t))){console.log('Int8');return new IntDataType(8)}
        else if (textValues.every(t=>/^(0x[0-9a-fA-F]+)?$/.test(t))){console.log('Int16');return new IntDataType(16)}
        else if (textValues.every(t=>/^(0z[0-9a-zA-Z]+)?$/.test(t))){console.log('Int36');return new IntDataType(36)}
        else if (textValues.every(t=>/^((\-)?(\d)*\.[\d]+)?$/.test(t))){console.log('Float');return new FloatDataType()}
        else if (textValues.every(t=>/^([_v])?$/.test(t))){console.log('Boolean');return new BooleanDataType()}
        else {return new DataType()}
    }
    serialize(type, value) {
        return null
    }
    deserialize(type, text) {
        if (type instanceof DataType) {return type.deserialize(text)}
        else {throw new TypeError(`第一引数typeはDateType型であるべきです。`)}
        /*
        if ('string'===type.id) {return text}
        else if ('integer'===type.id) {return parseInt(text, type.base)}
        else if ('float'===type.id) {return parseFloat(text)}
        else if ('boolean'===type.id) {return this._boolean.deserialize(text)}
        else {return text}
        */
    }
}
class DataType {
    constructor(id='string', defaultValue='') {
        this._id = id;
        this._defaultValue = defaultValue;
    }
    get id() {return this._id}
    get defaultValue() {return this._defaultValue}
    get alias() {return 's|str|string'.split('|')}
    deserialize(text) {return text}
}
class FloatDataType extends DataType {
    constructor(defVal=0) {
        super('float', defVal ?? 0);
    }
    get alias() {return 'flt|float'.split('|')}
    deserialize(text) {return parseFloat(text, this.base)}
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
        else if (''===text) {return this.defaultValue}
        else {throw new TypeError(`真偽値は_かvか空文字で表現されます。空文字はデフォルト値です。それ以外の値は無効です。:${text}`)}
    }
}
class IntDataType extends DataType {
    constructor(base=10, defVal=0) {
        super('integer', defVal ?? 0);
        this._base = base;
        this._basePrefix = {b:2, o:8, x:16, z:36}
    }
    get base() {return this._base}
    get alias() {return 'i|int|integer'.split('|')}
    get baseAlias() {return 'H|2|8|12|16|24|32|36'.split('|')}
    get baseValues() {return this.basePrefixs.map(k=>this._basePrefix[k])}
    get basePrefixs() {return Object.getOwnPropertyNames(this._basePrefix)}
    get basePrefix() {
        const bi = this.baseValues.indexOf(this.base)
        return bi===-1 ? '' : this.basePrefixs[bi];
    }
    //deserialize(text) {console.log(text, this.basePrefix, this.base);return parseInt(text.replace(this.basePrefix,''), this.base)}
    deserialize(text) {
        const v = parseInt(text.replace(this.basePrefix,''), this.base)
        if (Number.isNaN(v)){throw new TypeError(`Int型への変換に失敗しました。:${text}:${v}:${this.base}:${this.basePrefix}`)}
        return v
    }
}
class RangeDataType extends DataType {
    constructor(defVal=0, min=0, max=100) {
        super('range', defVal ?? 0);
        this._min = min; // range.age(0,0,100)
        this._max = max; // cols(age:range.age=5)
    }
    get alias() {return 'rng|range'.split('|')} // rはRegExpのために取っておく
}
class BigIntDataType extends DataType {
    constructor(base=10, defVal=0n) {
        super('biginteger', defVal ?? 0);
        this._base = base;
        //this._basePrefix = {b:2, o:8, x:16, z:36}
        this._basePrefix = {b:2, o:8, x:16} // parseInt('', 36) のように36進数変換できない
    }
    get base() {return this._base}
    get alias() {return 'I|bi|bigint|biginteger'.split('|')}
    get baseAlias() {return 'H|2|8|16|'.split('|')}
    get baseValues() {return this.basePrefixs.map(k=>this._basePrefix[k])}
    get basePrefixs() {return Object.getOwnPropertyNames(this._basePrefix)}
    get basePrefix() {
        const bi = this.baseValues.indexOf(this.base)
        return bi===-1 ? '' : this.basePrefixs[bi];
    }
    deserialize(text) { return BigInt(text) } // BigInt('x') SyntaxError: Cannot convert x to a BigInt
    /*
    get baseAlias() {return 'H|8|12|16|24|32|36'.split('|')}
    get baseValues() {return this.basePrefixs.map(k=>this._basePrefix[k])}
    get basePrefixs() {return Object.getOwnPropertyNames(this._basePrefix)}
    get basePrefix() {
        const bi = this.baseValues.indexOf(this.base)
        return bi===-1 ? '' : this.basePrefixs[bi];
    }
    //deserialize(text) {console.log(text, this.basePrefix, this.base);return parseInt(text.replace(this.basePrefix,''), this.base)}
    deserialize(text) {
        const v = parseInt(text.replace(this.basePrefix,''), this.base)
        if (Number.isNaN(v)){throw new TypeError(`Int型への変換に失敗しました。:${text}:${v}:${this.base}:${this.basePrefix}`)}
        return v
    }*/
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
    deserialize(text, type) { return new RegExp(type.pattern, type.option) }
}
window.Textbase = Textbase;
})();
