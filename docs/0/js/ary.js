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
            const textValues = this._S.split(match.groups.valueText);
            console.log(textValues )
            //const type = this._T.read(match.groups.type, match.groups.defVal, match.groups.valueText, this._S.suggestDelimiter(match.groups.valueText));
            const type = this._T.read(match.groups.type, match.groups.defVal, textValues);
            const values = textValues.map(t=>type.deserialize(t));
            //const values = textValues.map(t=>this._T.deserialize(type, t));
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
        this._basePrefix = Object.create({b:2, o:8, x:16, z:36})
    }
    get base() {return this._base}
    get alias() {return 'i|int|integer'.split('|')}
    get baseAlias() {return 'H|8|12|16|24|32|36'.split('|')}
//    get baseValues() {return [2,8,16,36]}
//    get basePrefixs() {return 'b|o|x|z'.split('|').map(v=>`0${v}`)}
    get baseValues() {return this.basePrefixs.map(k=>this._basePrefix[k])}
    get basePrefixs() {return Object.getOwnPropertyNames(this._basePrefix)}
    get basePrefix() {
        /*
             if ( 2===this._base){return '0b'}
        else if ( 8===this._base){return '0o'}
        else if (16===this._base){return '0x'}
        else if (36===this._base){return '0z'}
        else {return ''}
        */
        /*
        const [2,8,16,36].filter(b=>b===this.base)
        switch(this._base) {
            case 2: return '0b'
            case 8: return '0o'
            case 16: return '0x'
            case 36: return '0z'
            default: return ''
        }
        */
        //const bi = [2,8,16,36].indexOf(this.base)
        const bi = this.baseValues.indexOf(this.base)
        return bi===-1 ? '' : this.basePrefixs[bi];
    }
    //deserialize(text) {return parseInt(text, this.base)}
    deserialize(text) {return parseInt(text.replace(this.basePrefix,''), this.base)}
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
class RangeDataType extends DataType {
    constructor(defVal=0, min=0, max=100) {
        super('range', defVal ?? 0);
        this._min = min; // range.age(0,0,100)
        this._max = max; // cols(age:range.age=5)
    }
    get alias() {return 'rng|range'.split('|')} // rはRegExpのために取っておく
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
        //else {return new DataType()}
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
        /*
        if (textValues.every(t=>/^(\-)?[0-9]+$/.test(t))){console.log('Int10');return new IntDataType()}
        else if (textValues.every(t=>/^0b[01]+$/.test(t))){console.log('Int2');return new IntDataType(2)}
        else if (textValues.every(t=>/^0o[0-7]+$/.test(t))){console.log('Int8');return new IntDataType(8)}
        else if (textValues.every(t=>/^0x[0-9a-fA-F]+$/.test(t))){console.log('Int16');return new IntDataType(16)}
        else if (textValues.every(t=>/^0z[0-9a-zA-Z]+$/.test(t))){console.log('Int36');return new IntDataType(36)}
        else if (textValues.every(t=>/^(\-)?(\d)*\.[\d]+$/.test(t))){console.log('Float');return new FloatDataType()}
        else if (textValues.every(t=>/^[_v]$/.test(t))){console.log('Boolean');return new BooleanDataType()}
        */
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
console.log(s.read('ary .1 0.2 1.1 2.2 3.3'))
console.log(s.read('ary 0b00 0b01 0b10 0b11'))
console.log(s.read('ary 0o00 0o77 0o10'))
console.log(s.read('ary 0x00 0xFF 0x10'))
console.log(s.read('ary 0z00 0zZZ 0z10'))
console.log(s.read('ary _ v v _'))
console.log(s.read('ary  v v ')) // false 略記
console.log(s.read('ary  v v _ _ _')) // 末尾 false 3 連続
console.log(s.read('ary  v v  _ ')) // 末尾 false 3 連続(最初と最後は空文字で略記した)
console.log(s.read('ary  v v   ')) // 末尾 false 3 連続(3つ共全部略記した)
s.read('ary A B C')
s.read('ary 1 2 3')
