;(function(){
class Textbase {
    constructor() {
        this._D = [new ArrayDeserializer(), new ObjectDeserializer(), new TableDeserializer()]
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
//        console.log(/^ary[\.: =]/.test(text))
        if (/^ary[\.: =]/.test(text)) {return this.#ary(text)}
    }
    #ary(text) {
        const match = text.match(/^ary(?<name>\.[_a-zA-Z][_a-zA-Z0-9]*)?(?<type>:(s|i(H|2|8|10|12|16|24|32|36)?|b|f|I|str|int(H|2|8|10|12|16|24|32|36)?|bln|flt|bi|bool|string|integer(H|2|8|10|12|16|24|32|36)|boolean|float|bigint|biginteger))?(?<defVal>=([^ ,;]+))? (?<valueText>.+)/)
        if (match) {
//            console.log(match)
            const textValues = this._S.split(match.groups.valueText);
            const defVal = match.groups.defVal?.slice(1)
            const typeT = match.groups.type?.slice(1)
            const type = this._T.read(typeT, defVal, textValues);
//            console.log(match.groups.type, defVal, textValues, type)
            const values = textValues.map(t=>type.deserialize(t));
//            if (type instanceof StringDataType) console.log(values.map(v=>v.replace(/\\n/g,'X')))
            return values;
        } else {console.log('Not Array format.')}
    }
}
class ObjectDeserializer {// obj key value
    constructor() {
        this._S = new Splitter();
        this._T = new TypeParser();
    }
    deserialize(text) {
//        console.log(/^obj[\.: =]/.test(text))
        if (/^obj[\.: =]/.test(text)) {return this.#obj(text)}
    }
    #obj(text) {
        //const match = text.match(/^obj(?<name>\.[_a-zA-Z][_a-zA-Z0-9]*)?(?<types>:\([\S]+\))? (?<valueText>.+)/)
        const match = text.match(/^obj(?<name>\.[_a-zA-Z][_a-zA-Z0-9]*)? (?<valueText>.+)/)
        if (match) {
            const textValues = this._S.split(match.groups.valueText);
            const kvs = this.#kvs(textValues)
            return [...Object.keys(kvs)].reduce((o,k,i)=>Object.assign(o,{[k]:kvs[k].value}),{})
        } else {console.log('Not Object format.')}
    }
    #kvs(textValues) {
        const keyTypes = {}
        for (let i=0; i<textValues.length; i++) {
            if (1===(i%2)) {continue}
            const [name,typeTxt] = textValues[i].split(':')
            const valTxt = (i+1 < textValues.length) ? textValues[i+1] : undefined
//            console.log(name, typeTxt, valTxt)
            const type = this.#getType(typeTxt, valTxt)
//            console.log(name, type)
            keyTypes[name] = {type:type, value:type.deserialize(valTxt) ?? type.defaultValue}
        }
        return keyTypes
    }
    #getType(typeTxt, valTxt) {
        const type = this._T.getType(typeTxt)
        if (type){return type}
        else {// typeが無いなら値で型を推測する
            if (valTxt) {return LiteralType.get(valTxt)}
            else {return new StringDataType()}
        }
    }
    #types(text) { // {type,defaultValue}
        const texs = text.split(',')
        return texs.map(t=>{const s = t.split('='); return ({type:s[0],defaultValue:s[1]})})
    }
}
class TableDeserializer {// tbl(name,age:i=5) yamada 12 suzuki 24
    constructor() {
        this._S = new Splitter();
        this._T = new TypeParser();
    }
    deserialize(text) {
        //console.log(/^tbl[\.: =]/.test(text))
        //if (/^tbl[\.: =]/.test(text)) {return this.#tbl(text)}
        if (/^tbl/.test(text)) {return this.#tbl(text)}
    }
    #tbl(text) {
        //const match = text.match(/^obj(?<name>\.[_a-zA-Z][_a-zA-Z0-9]*)?(?<types>:\([\S]+\))? (?<valueText>.+)/)
        const match = text.match(/^tbl(?<name>\.[_a-zA-Z][_a-zA-Z0-9]*)?\((?<colsText>[\S]+)\) (?<rowsText>.+)/)
        console.log(match)
        if (match) {
            const rowsValues = this._S.split(match.groups.rowsText);
            const cols = this.#cols(match.groups.colsText, rowsValues)
//            const rows = this.#rows(cols, rowsValues)
            return this.#rows(cols, rowsValues)
//            const kvs = this.#kvs(textValues)
//            return [...Object.keys(kvs)].reduce((o,k,i)=>Object.assign(o,{[k]:kvs[k].value}),{})
        } else {console.log('Not Table format.')}
    }
    #cols(colsText, rowsValues) {
        //const cols = {}
        const cols = []
        const colTs = colsText.split(',')
        //for (let col of colsText.split(',')) {
        for (let i=0; i<colTs.length; i++) {
            const colT = colTs[i]
            console.log(colTs, i, colT)
//            const typeIdx = colT.findIndex(':')
//            const defIdx = colT.findIndex('=')
            const typeIdx = colT.indexOf(':')
            const defIdx = colT.indexOf('=')
            console.log(typeIdx , defIdx)
            const nameLen = ((-1===typeIdx && -1===defIdx)
                ? colT.length
                : ((-1!==typeIdx && -1!==defIdx)
                    ? Math.min(typeIdx,defIdx)
                    : Math.max(typeIdx,defIdx)))
            //const nameLen = ((-1!==typeIdx && -1!==defIdx) ? Math.min(typeIdx,defIdx) : Math.max(typeIdx,defIdx))
//            const nameLen = (-1===typeIdx && -1===defIdx) ? colT.length : Math.max(typeIdx,defIdx)
            console.log(typeIdx, defIdx, nameLen)
            const name = colT.slice(0, nameLen)
            const typeTxt = -1===typeIdx ? undefined : colT.slice(nameLen+1, -1===defIdx ? colT.length : defIdx)
            //const defTxt = -1===defIdx ? undefined : colT.slice(Math.max(nameLen, typeIdx)+1)
            const defTxt = -1===defIdx ? undefined : colT.slice(defIdx+1)
            console.log(name, typeTxt, defTxt)
//            cols[name] = this.#getType(typeTxt, defTxt, rowsValues, colTs.length, i)
            cols.push({name:name, type:this.#getType(typeTxt, defTxt, rowsValues, colTs.length, i)})
//            cols.push({name:name, type:this.#getType(colT, rowsValues, colTs.length, i)})
        }
        return cols
    }
    #kvs(textValues) {
        const keyTypes = {}
        for (let i=0; i<textValues.length; i++) {
            if (1===(i%2)) {continue}
            /*
            const name = textValues[i].slice(0, )
            const [name,typeTxt,defTxt] = textValues[i].split(':')
            const [name,typeTxt] = textValues[i].split(':')
            const valTxt = (i+1 < textValues.length) ? textValues[i+1] : undefined
//            console.log(name, typeTxt, valTxt)
            const type = this.#getType(typeTxt, valTxt)
//            console.log(name, type)
            keyTypes[name] = {type:type, value:type.deserialize(valTxt) ?? type.defaultValue}
            */
        }
        return keyTypes
    }
    /*
    #getType(colT, rowsValues, colLen, colIdx) {
        const type = this._T.getType(colT)
        if (type){return type}
        else {// typeが無いなら値で型を推測する
            for (let i=0; i<rowsValues.length/colLen; i++){
                const v = rowsValues[(colLen*i)+colIdx]
                if (''!==v){return LiteralType.get(v)} // この列の最初に発見した空値以外の値で型推論する
            }
            return new StringDataType()
        }
    }
    */
    #getType(typeTxt, defTxt, rowsValues, colLen, colIdx) {
        const type = this._T.getType(typeTxt, defTxt)
        if (type){return type}
        else {// typeが無いなら値で型を推測する
            for (let i=0; i<rowsValues.length/colLen; i++){
                const v = rowsValues[(colLen*i)+colIdx]
                if (''!==v){return LiteralType.get(v)} // この列の最初に発見した空値以外の値で型推論する
            }
            return new StringDataType(defTxt)
        }
    }
    /*
    #getType(typeTxt, valTxt) {
        const type = this._T.getType(typeTxt)
        if (type){return type}
        else {// typeが無いなら値で型を推測する
            if (valTxt) {return LiteralType.get(valTxt)}
            else {return new StringDataType()}
        }
    }
    */
    #rows(cols, rowsValues) {
        return rowsValues.reduce((a,v,i)=>{
            console.log(a, v, i)
            const r = Math.floor(i / cols.length);
            const c = i % cols.length;
            console.log(r, c)
            //if (0===c) {a.push([])}
            if (0===c) {a.push({})}
            console.log(a, 0===c)
            console.log(cols, c, cols[c])
            console.log(a, r, a[r], v, cols[c].type)
//            a[r].push(cols[c].type.deserialize(v))
            a[r][cols[c].name] = cols[c].type.deserialize(v)
            //return a[r].push(cols[c].type.deserialize(v))
            return a
        }, [])
        /*
        rowsValues.map((v,i)=>{
            const r = i / cols.length;
            const c = i % cols.length;
            return cols[c].deserialize(v);
        })
        const rows = []
        for (let i=0; i<rowsValues.length; i++) {
            cols[
            if (0===rowsValues.length % cols.length) {
                
            }
//            const r = rowsValues.length / cols.length;
//            const c = rowsValues.length % cols.length;
            const r = i / cols.length;
            const c = i % cols.length;
            cols[c].deserialize(rowsValues[i])
        }

        for (let r=0; r<rowsValues.length / cols.length; r++) {
            for (let c=0; c<cols.length; c++) {
                const i = r * cols.length + c;
                const v = rowsValues[i];
                cols[i].type.deserialize(v)
            }
        }
        */
        /*
        const rows = []
        const colLen = [...Object.keys(cols)].length
        for (let r=0; r<rowsValues.length / colLen; r++) {
            for (let c=0; c<colLen; c++) {
                const i = r * colLen + c;
                const v = rowsValues[i];

            }
        }
        */
    }
}
class Splitter {
    constructor() {
        this._candidates = [' ',',',';','\t']
    }
    split(text) {
        const D = this.suggestDelimiter(text);
        return D ? text.split(D) : [text];
    }
    suggestDelimiter(text) {
        if (text.includes(' ') && !text.includes(',') && !text.includes(';') && !text.includes('\t')) {return ' '}
        else if (text.includes(',') && !text.includes(';') && !text.includes('\t')) {return ','}
        else if (text.includes(';') && !text.includes('\t')) {return ';'}
        else if (text.includes('\t')) {return '\t'}
        else {return ''}
    }
}
class LiteralType {//リテラル値から型を推論する
    static get(text) {
             if (/^[_v]+$/.test(text)){return new BooleanDataType()}
//        else if (/^(\d+)?\.\d+$/.test(text)){return new FloatDataType()}
        else if (/^(-)?(\d+)?\.\d+$/.test(text)){return new FloatDataType()}
        else if (/^(-)?\d+$/.test(text)){return new IntDataType(10)}
        else if (/^0b[0-1]+$/.test(text)){return new IntDataType(2)}
        else if (/^0o[0-7]+$/.test(text)){return new IntDataType(8)}
        else if (/^0x[0-9a-fA-F]+$/.test(text)){return new IntDataType(16)}
        else if (/^0z[0-9a-zA-Z]+$/.test(text)){return new IntDataType(36)}
        else if (/^(-)?\d+n$/.test(text)){return new BigIntDataType(10)}
        else if (/^0B[0-1]+$/.test(text)){return new BigIntDataType(2)}
        else if (/^0O[0-7]+$/.test(text)){return new BigIntDataType(8)}
        else if (/^0X[0-9a-fA-F]+$/.test(text)){return new BigIntDataType(16)}
        else {return new StringDataType()}
    }
}
class TypeParser {
    constructor() {
        this._string = new DataType();
        this._integer = new IntDataType();
        this._float = new DataType('float',0.0);
        this._boolean = new BooleanDataType();
    }
    getType(typeTxt, defTxt) {// 型名や初期値から型インスタンスを取得する
            console.log('XXXXXXXXXXXXXXXXXXXXXXXXX', typeTxt, defTxt)
        if (!DataType.isStr(typeTxt)) {return null}
        // 型名のみ
        for (let type of [BooleanDataType, FloatDataType, StringDataType]){
            if (type.alias.some(t=>t===typeTxt)){return new type(defTxt)}
        }
        for (let type of [IntDataType, BigIntDataType]){
            if (type.alias.some(t=>t===typeTxt)){return new type(10,defTxt)}
        }
        // 型名＝初期値
        for (let type of [IntDataType, BigIntDataType]){
            if (type.alias.some(t=>typeTxt.startsWith(t+'='))){
            //if (type.alias.some(t=>typeTxt.includes(t+'='))){
                const defaultValue = typeTxt.slice(typeTxt.indexOf('=')+1)
                console.log('******************************************', defaultValue)
                return new type(10, defaultValue)
            }
        }
        for (let type of [BooleanDataType, FloatDataType, StringDataType]){
//            console.log('******************************************', type.alias, typeTxt)
            if (type.alias.some(t=>typeTxt.startsWith(t+'='))){
            //if (type.alias.some(t=>typeTxt.includes(t+'='))){
                //const defaultValue = typeTxt.slice(typeTxt.indexOf('=')+1)
                const E = typeTxt.indexOf('=')
                const defaultValue = typeTxt.slice(-1===E ? typeTxt.length : E+1)
                return new type(defaultValue)
            }
        }
        // 型名＋基数
        for (let type of [IntDataType, BigIntDataType]){
            if (type.alias.some(t=>typeTxt.startsWith(t) && type.BaseAlias.some(b=>typeTxt.endsWith(b)))){
            //if (type.alias.some(t=>typeTxt.includes(t) && type.BaseAlias.some(b=>typeTxt.endsWith(b)))){
                const base = type.BaseAlias.filter(b=>typeTxt.endsWith(b))[0]
                return new type(base)
            }
        }
        // 型名＋基数＝初期値
        for (let type of [IntDataType, BigIntDataType]){
            if (type.alias.some(t=>typeTxt.startsWith(t) && type.BaseAlias.some(b=>typeTxt.includes(b+'=')))){
            //if (type.alias.some(t=>typeTxt.includes(t) && type.BaseAlias.some(b=>typeTxt.includes(b+'=')))){
//                const keyT = typeTxt.slice(0, typeTxt.findIndex('='))
//                const valT = typeTxt.slice(typeTxt.findIndex('=')+1)
                const E = typeTxt.indexOf('=')
                const keyT = typeTxt.slice(0, E)
                const valT = typeTxt.slice(E+1)
                const base = type.BaseAlias.filter(b=>keyT.endsWith(b))[0]
                return new type(base, valT)
            }
        }
    }
    /*
    getType(typeTxt) {// 型宣言した文字列から型インスタンスを取得する
        if (!DataType.isStr(typeTxt)) {return null}
//        if (!DataType.isStr(typeTxt)) {return new StringDataType()}
        //if (!typeTxt) {return StringDataType()}
        // 名＋型＋値 name:str=yamada

        // 型名のみ
        for (let type of [BooleanDataType, IntDataType, BigIntDataType, FloatDataType, StringDataType]){
            if (type.alias.some(t=>t===typeTxt)){return new type()}
        }
        // 型名＝初期値
        for (let type of [IntDataType, BigIntDataType]){
            //if (type.alias.some(t=>typeTxt.startsWith(t+'='))){
            if (type.alias.some(t=>typeTxt.includes(t+'='))){
                //const defaultValue = typeTxt.slice(typeTxt.findIndex('='))
                const defaultValue = typeTxt.slice(typeTxt.indexOf('=')+1)
                return new type(10, defaultValue)
            }
        }
        for (let type of [BooleanDataType, FloatDataType, StringDataType]){
            console.log('******************************************', type.alias, typeTxt)
            //if (type.alias.some(t=>typeTxt.startsWith(t+'='))){
            if (type.alias.some(t=>typeTxt.includes(t+'='))){
                //const defaultValue = typeTxt.slice(typeTxt.findIndex('='))
                const defaultValue = typeTxt.slice(typeTxt.indexOf('=')+1)
                return new type(defaultValue)
            }
        }
        // 型名＋基数
        for (let type of [IntDataType, BigIntDataType]){
            //if (type.alias.some(t=>typeTxt.startsWith(t) && type.BaseAlias.some(b=>typeTxt.endsWith(b)))){
            if (type.alias.some(t=>typeTxt.includes(t) && type.BaseAlias.some(b=>typeTxt.endsWith(b)))){
                const base = type.BaseAlias.filter(b=>typeTxt.endsWith(b))[0]
                return new type(base)
            }
        }
        // 型名＋基数＝初期値
        for (let type of [IntDataType, BigIntDataType]){
            //if (type.alias.some(t=>typeTxt.startsWith(t) && type.BaseAlias.some(b=>typeTxt.includes(b+'=')))){
            if (type.alias.some(t=>typeTxt.includes(t) && type.BaseAlias.some(b=>typeTxt.includes(b+'=')))){
//                const keyT = typeTxt.slice(0, typeTxt.findIndex('='))
//                const valT = typeTxt.slice(typeTxt.findIndex('=')+1)
                const keyT = typeTxt.slice(0, typeTxt.indexOf('='))
                const valT = typeTxt.slice(typeTxt.indexOf('=')+1)
                const base = type.BaseAlias.filter(b=>keyT.endsWith(b))[0]
                return new type(base, valT)
            }
        }
    }
    */
    read(typeTxt, defValTxt, textValues) {
//        console.log(typeTxt, 'i|int|integer'.split('|').some(t=>typeTxt?.includes(t)), typeTxt?.includes('int'))
        if (['s','str','string'].some(t=>t===typeTxt)) {return  new StringDataType(defValTxt)}
        //else if ('i|int|integer'.split('|').some(t=>typeTxt?.includes(t))){
        else if ('i|int|integer'.split('|').some(t=>typeTxt?.startsWith(t))){
            const base = IntDataType.BaseAlias.some(b=>typeTxt.endsWith(b))
            //const base = IntDataType.BaseAlias.some(b=>typeTxt.includes(b))
                //? typeTxt.split(IntDataType.BaseAlias.filter(b=>typeTxt.includes(b))[0])[1]
                //? typeTxt.split(IntDataType.BaseAlias.filter(b=>typeTxt.endsWith(b))[0])[1]
                ? IntDataType.BaseAlias.filter(b=>typeTxt.endsWith(b)).map(b=>b)[0]
                : 10
//            console.log(base, IntDataType.BaseAlias, IntDataType.BaseAlias.filter(b=>typeTxt.endsWith(b)).map(b=>b)[0])
            return new IntDataType('H'===base ? 16 : parseInt(base), defValTxt)
        }
        else if (['f','flt','float'].some(t=>t===typeTxt)) {return new FloatDataType(defValTxt)}
        else if (['b','bln','bool','boolean'].some(t=>t===typeTxt)) {return new BooleanDataType(defValTxt)}
        else if (['I','bi','bgi','bigint','biginteger'].some(t=>t===typeTxt)) {
            const base = BigIntDataType.BaseAlias.some(b=>typeTxt.includes(b))
                ? typeTxt.split(BigIntDataType.BaseAlias.filter(b=>typeTxt.includes(b))[0])[1]
                : 10
            return new BigIntDataType(base,defValTxt)
        }
        else {return this.#suggestFromValueText(textValues, defValTxt)}
    }
    #suggestFromValueText(textValues, defValTxt) {
//        console.log(`suggestFromValueText:`, textValues)
        //console.log(`suggestFromValueText:`, textValues, textValues.every(t=>/^$/))
        // ^$ で空文字判定する。空文字を許可するには ^(.+)?$ とする。各型の書式と空値(略記)を許容する
             if (textValues.every(t=>/^$/.test(t))){return new StringDataType(defValTxt)} // すべて空値なら文字列と判断する
        else if (textValues.every(t=>/^((\-)?[0-9]+)?$/.test(t))){return new IntDataType(10,defValTxt)}
        else if (textValues.every(t=>/^(0b[01]+)?$/.test(t))){return new IntDataType(2,defValTxt)}
        else if (textValues.every(t=>/^(0o[0-7]+)?$/.test(t))){return new IntDataType(8,defValTxt)}
        else if (textValues.every(t=>/^(0x[0-9a-fA-F]+)?$/.test(t))){return new IntDataType(16,defValTxt)}
        else if (textValues.every(t=>/^(0z[0-9a-zA-Z]+)?$/.test(t))){return new IntDataType(36,defValTxt)}
        else if (textValues.every(t=>/^((\-)?(\d)*\.[\d]+)?$/.test(t))){return new FloatDataType(defValTxt)}
        else if (textValues.every(t=>/^([_v])?$/.test(t))){return new BooleanDataType()}
        else if (textValues.every(t=>/^(0B[0-9]+)?$/.test(t))){return new BigIntDataType(2,defValTxt)}
        else if (textValues.every(t=>/^(0O[0-7]+)?$/.test(t))){return new BigIntDataType(8,defValTxt)}
        else if (textValues.every(t=>/^((\-)?([0-9]+n))?$/.test(t))){return new BigIntDataType(10,defValTxt)}
        else if (textValues.every(t=>/^(0X[0-9a-zA-Z]+)?$/.test(t))){return new BigIntDataType(16,defValTxt)}
        else {return new StringDataType()}
        /*
             if (textValues.every(t=>/^$/.test(t))){return new StringDataType(defValTxt)} // すべて空値なら文字列と判断する
        else if (textValues.every(t=>/^((\-)?[0-9]+)?$/.test(t))){console.log('Int10');return new IntDataType(10,defValTxt)}
        else if (textValues.every(t=>/^(0b[01]+)?$/.test(t))){console.log('Int2');return new IntDataType(2,defValTxt)}
        else if (textValues.every(t=>/^(0o[0-7]+)?$/.test(t))){console.log('Int8');return new IntDataType(8,defValTxt)}
        else if (textValues.every(t=>/^(0x[0-9a-fA-F]+)?$/.test(t))){console.log('Int16');return new IntDataType(16,defValTxt)}
        else if (textValues.every(t=>/^(0z[0-9a-zA-Z]+)?$/.test(t))){console.log('Int36');return new IntDataType(36,defValTxt)}
        else if (textValues.every(t=>/^((\-)?(\d)*\.[\d]+)?$/.test(t))){console.log('Float');return new FloatDataType(defValTxt)}
        else if (textValues.every(t=>/^([_v])?$/.test(t))){console.log('Boolean');return new BooleanDataType()}
        else if (textValues.every(t=>/^(0B[0-9]+)?$/.test(t))){console.log('BigInt2');return new BigIntDataType(2,defValTxt)}
        else if (textValues.every(t=>/^(0O[0-7]+)?$/.test(t))){console.log('BigInt8');return new BigIntDataType(8,defValTxt)}
        else if (textValues.every(t=>/^((\-)?([0-9]+n))?$/.test(t))){console.log('BigInt10');return new BigIntDataType(10,defValTxt)}
        else if (textValues.every(t=>/^(0X[0-9a-zA-Z]+)?$/.test(t))){console.log('BigInt16');return new BigIntDataType(16,defValTxt)}
        else {return new StringDataType()}
        */
        /*
        if (textValues.every(t=>/^( )*$/)){return new DataType}
        if (textValues.every(t=>/^(\-)?[0-9]+$/.test(t))){console.log('Int10');return new IntDataType()}
        else if (textValues.every(t=>/^0b[01]+$/.test(t))){console.log('Int2');return new IntDataType(2)}
        else if (textValues.every(t=>/^0o[0-7]+$/.test(t))){console.log('Int8');return new IntDataType(8)}
        else if (textValues.every(t=>/^0x[0-9a-fA-F]+$/.test(t))){console.log('Int16');return new IntDataType(16)}
        else if (textValues.every(t=>/^0z[0-9a-zA-Z]+$/.test(t))){console.log('Int36');return new IntDataType(36)}
        else if (textValues.every(t=>/^(\-)?(\d)*\.[\d]+$/.test(t))){console.log('Float');return new FloatDataType()}
        else if (textValues.every(t=>/^[_v]$/.test(t))){console.log('Boolean');return new BooleanDataType()}
        else {return new DataType()}
        */
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
//        this._defaultValue = this._getDefaultValue(defaultValue);
    }
    /*
    _getDefaultValue(defVal){
        if ([null,undefined].some(v=>v===defVal)) {return 0}
        else {return this.deserialize(text)}
    }
    */
    get id() {return this._id}
    get defaultValue() {return this._defaultValue}
//    get alias() {return 's|str|string'.split('|')}
    //deserialize(text) {return text}
    //deserialize(text) {return ''===text ? this.defaultValue : text}
    deserialize(text) {
        // NaNは「false===(NaN===Nan)」「'number'===typeof NaN」になるため注意。反意図性のクソ仕様であり禁止すべき。
        // undefinedもJS内部エラー値のため禁止すべき
        // nullもNULL安全をめざして禁止すべき
        // ''はデフォルト値に変換する
        //if (null===text || undefined===text || Number.isNaN(text)){throw new TypeError(`不正値です。:${defVal}`)}
        //if (this._isNUN(text)){throw new TypeError(`不正値です。:${text}`)}
        if (this._isNUN(text)){text=''}
        return ''===text ? this.defaultValue : text
    }
    _isNUN(v) {return null===v || undefined===v || Number.isNaN(v)}
    _isStr(v) {return typeof v === 'string' || v instanceof String;}
    _isInt(v) {return Number.isInteger(v)}
    _isFlt(v) {return !this._isNUN(v) && !this._isInt(v) && 'number'===typeof v}
    _isBln(v) {return !this._isNUN(v) && 'boolean'===typeof v}
    static isNUN(v) {return null===v || undefined===v || Number.isNaN(v)}
    static isStr(v) {return typeof v === 'string' || v instanceof String;}
    static isInt(v) {return Number.isInteger(v)}
    static isFlt(v) {return !this._isNUN(v) && !this._isInt(v) && 'number'===typeof v}
    static isBln(v) {return !this._isNUN(v) && 'boolean'===typeof v}
 }
class StringDataType extends DataType {
    constructor(defVal='') { super('string', defVal ?? '') }
//    get alias() {return 's|str|string'.split('|')}
    static get alias() {return 's|str|string'.split('|')}
    //deserialize(text) {return super.deserialize(text).replace(/\\n/g,'\n').replace(/\\t/g,'\t')}
    deserialize(text) {return ''===text ? this.defaultValue : super.deserialize(text).replace(/\\n/g,'\n').replace(/\\t/g,'\t')}
}
class FloatDataType extends DataType {
    constructor(defVal=0) {
        //super('float', defVal ?? 0);
//        super('float', this.#def(defVal)); // ReferenceError: Must call super constructor in derived class before accessing 'this' or returning from derived constructor
        //super('float');
        super('float', defVal ?? 0);
        //super._defaultValue = this.#def(defVal);
        super._defaultValue = this.deserialize(defVal);
    }
    /*
    #def(defVal) {
        if ([null,undefined].some(v=>v===defVal)) {return 0}
        else {return this.deserialize(defVal)}
    }
    */
//    get alias() {return 'f|flt|float'.split('|')}
    static get alias() {return 'f|flt|float'.split('|')}
    //deserialize(text) {return parseFloat(text, this.base)}
    deserialize(text) {
        /*
        // NaNは「false===(NaN===Nan)」「'number'===typeof NaN」になるため注意。反意図性のクソ仕様
        if (null===text || undefined===text || Number.isNaN(text)){throw new TypeError(`不正値です。:${defVal}`)}
//        if ('number'===typeof super.deserialize(text)){return super.deserialize(text)}
//        if (super._isBlank(text)){return super.defaultValue}
        if (''===text){return super.defaultValue}
        */
        //const v = super.deserialize(text)
        //const v = parseFloat(text)
        const v = parseFloat(super.deserialize(text))
        if (Number.isNaN(v)) {throw new TypeError(`Float型への変換に失敗しました。:${text}:${v}`)}
        return v
    }
    // NaNは禁止
    // -1e5 のような指数表記を認めるべきか
    // Infinity のような無限数を認めるべきか
}
class BooleanDataType extends DataType {
    constructor(defVal=false) {
        super('boolean', defVal ?? false);
    }
//    get alias() {return 'b|bln|bool|boolean'.split('|')}
    static get alias() {return 'b|bln|bool|boolean'.split('|')}
    get valueTexts() {return ['_','v']}
    deserialize(text, type) {
        //if ('boolean'===typeof text) {return text}
        //if (super._isBln(text)) {return text}
        const v = super.deserialize(text)
        if (super._isBln(v)) {return v}
        if (''===v || '_'===v) {return false}
        else if ('v'===v) {return true}
        //else {throw new TypeError(`真偽値は_かvか空文字で表現されます。空文字はデフォルト値です。それ以外の値は無効です。:${text}:${v}`)}
        else {throw new TypeError(`Boolean型への変換に失敗しました。Boolean型の値は_,v,空文字のいずれかで表現されます。:${text}:${v}`)}
        /*
             if (''===v) {return this.defaultValue}
        else if ('_'===v) {return false}
        else if ('v'===v) {return true}
        */
        /*
        if (null===text || undefined===text || Number.isNaN(text)){throw new TypeError(`不正値です。:${defVal}`)}
        if ('_'===text) {return false}
        else if ('v'===text) {return true}
        else if (''===text) {return this.defaultValue}
        else {throw new TypeError(`真偽値は_かvか空文字で表現されます。空文字はデフォルト値です。それ以外の値は無効です。:${text}`)}
    */
    }
}
class IntDataType extends DataType {
    static BaseAlias = 'H|2|8|10|12|16|24|32|36'.split('|');
    constructor(base=10, defVal=0) {
        super('integer', defVal ?? 0);
//        this._base = base;
        this._base = this.#base(base);
        this._basePrefix = {b:2, o:8, x:16, z:36}
    }
    #base(base) {
        if ('H'===base){base=16}
        const baseInt = parseInt(base)
        if (super._isStr(base) && !super._isNUN(baseInt) && 2 <= baseInt && baseInt <= 36){base=baseInt}
        if (super._isNUN(base)  || !super._isInt(base) || base < 2 || 36 < base){throw new TypeError(`Intのbaseは2〜36までの整数値であるべきです。:${base}:${typeof base}`)}
        return base
    }
    /*
    #base(base) {
             if (super._isInt(base) && 2 <= base && base <= 36) {return base}
        else if (super._isStr(base)) {
            return IntDataType.BaseAlias.some(b=>typeTxt.includes(b))
                ? typeTxt.split(IntDataType.BaseAlias.filter(b=>typeTxt.includes(b))[0])[1]
                : 10
        } else {throw new TypeError(`Intのbaseは2〜36までの整数値であるべきです。`)}
//        if (super._isNUN(base) || super._isInt(base) || 2 < base || base < 36){throw new TypeError(`Intのbaseは2〜36までの整数値であるべきです。`)}
//        if (null===base || undefined===base || Number.isNaN(base) || !Number.isInteger(base) || 2 < base || base < 36){throw new TypeError(`Intのbaseは2〜36までの整数値であるべきです。`)}

    }
    */
    get base() {return this._base}
    //get alias() {return 'i|int|integer'.split('|')}
    static get alias() {return 'i|int|integer'.split('|')}
    get baseAlias() {return 'H|2|8|12|16|24|32|36'.split('|')}
    get baseValues() {return this.basePrefixs.map(k=>this._basePrefix[k])}
    get basePrefixs() {return Object.getOwnPropertyNames(this._basePrefix)}
    get basePrefix() {
        const bi = this.baseValues.indexOf(this.base)
//        return bi===-1 ? '' : this.basePrefixs[bi];
        return bi===-1 || 10===this.base ? '' : this.basePrefixs[bi];
    }
    //deserialize(text) {console.log(text, this.basePrefix, this.base);return parseInt(text.replace(this.basePrefix,''), this.base)}
    deserialize(text) {
        const d = super.deserialize(text)
        if ('number'===typeof d){return d}
        //const v = parseInt(d.replace(this.basePrefix,''), this.base)
        //if (Type.isStr(d) && d.startsWith(`0${this.basePrefix}`)) {d = d.slice(2)}
        //new RegExp('^0${this.basePrefix}')
        //const v = parseInt(d.replace(/^0/this.basePrefix,''), this.base)
        //const v = parseInt(d, this.base)
        //const v = parseInt((Type.isStr(d) && d.startsWith(`0${this.basePrefix}`)) ? d.slice(2) : d, this.base)
        const v = parseInt(this.#delPrefix(d), this.base)
//        console.log(d, this.base, d.replace(this.basePrefix,''))
        if (Number.isNaN(v)){throw new TypeError(`Int型への変換に失敗しました。:${text}:${v}:${this.base}:${this.basePrefix}`)}
        if (Infinity!==v && Number.MAX_SAFE_INTEGER < v){throw new TypeError(`Infinityでないにも関わらずNumber.MAX_SAFE_INTEGERよりも大きい値です。正確な値を保てないためエラーとします。:${v}:${text}`)}
        if (-Infinity!==v && v < Number.MIN_SAFE_INTEGER){throw new TypeError(`-Infinityでないにも関わらずNumber.MIN_SAFE_INTEGERよりも小さい値です。正確な値を保てないためエラーとします。:${v}:${text}`)}
        return v
        /*
        if (''===text){return this.defaultValue}
        const v = parseInt(text.replace(this.basePrefix,''), this.base)
        if (Number.isNaN(v)){throw new TypeError(`Int型への変換に失敗しました。:${text}:${v}:${this.base}:${this.basePrefix}`)}
        return v
        */
    }
    #delPrefix(d){return (this._isStr(d) && ''!==this.basePrefix && d.startsWith(`0${this.basePrefix}`)) ? d.slice(2) : d}
}
class BigIntDataType extends DataType {
    static BaseAlias = 'H|2|8|10|16'.split('|');
    constructor(base=10, defVal=0n) {
        super('bigint', defVal ?? 0n);
        //this._base = base;
        //this._base = base;
        this._base = this.#base(base);
        //this._basePrefix = {b:2, o:8, x:16, z:36}
        this._basePrefix = {B:2, O:8, X:16} // parseInt('', 36) のように36進数変換できない
        this._defaultValue = this.deserialize(defVal)
    }
    #base(base) {
        if ('H'===base){base=16}
        const baseInt = parseInt(base)
        if (super._isStr(base) && !super._isNUN(baseInt) && 2 <= baseInt && baseInt <= 16){base=baseInt}
        if (super._isNUN(base)  || !super._isInt(base) || base < 2 || 16 < base){throw new TypeError(`BigIntのbaseは2〜16までの整数値であるべきです。:${base}:${typeof base}`)}
        return base
    }
    get base() {return this._base}
    //get alias() {return 'I|bi|bgi|bigint|biginteger'.split('|')}
    static get alias() {return 'I|bi|bgi|bigint|biginteger'.split('|')}
    get baseAlias() {return 'H|2|8|10|16|'.split('|')}
    get baseValues() {return this.basePrefixs.map(k=>this._basePrefix[k])}
    get basePrefixs() {return Object.getOwnPropertyNames(this._basePrefix)}
    get basePrefix() {
        const bi = this.baseValues.indexOf(this.base)
        return bi===-1 ? '' : this.basePrefixs[bi];
    }
    deserialize(text) {
        const d = super.deserialize(text)
        if ('bigint'===typeof d){return d}
        if (this._isStr(text) && /^[0-9]+n$/.test(text)){text=text.slice(0,-1)}
//        if (this.basePrefixs.some(b=>text.startsWith(b))){text=text.slice(2)}
//        if (''===text){return this.defaultValue}
        //if (10!==this.base && !text.startsWith(this.basePrefix))) {text = '0' + this.basePrefix + text; console.log(text)}
        //if (10!==this.base && !/^0[box]/i.test(text)) {text = '0' + this.basePrefix + text; console.log(text)}
        if (10!==this.base && !/^0[box]/i.test(text)) {text = '0' + this.basePrefix + text}
        //return BigInt(text)
        try {return BigInt(text)}
        catch(err){throw new TypeError(`BigInt型への変換に失敗しました。:${text}`)}
        
    } // BigInt('x') SyntaxError: Cannot convert x to a BigInt
    //deserialize(text) { return BigInt(text) } // BigInt('x') SyntaxError: Cannot convert x to a BigInt
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
//    get alias() {return 'r|reg|regexp'.split('|')}
    static get alias() {return 'r|reg|regexp'.split('|')}
    //deserialize(text, type) { return new RegExp(type.pattern, type.option) }
    deserialize(text, type) {
        const d = super.deserialize(text)
//        if (!(d instanceof RegExp)){throw new TypeError(`RegExp型ではありません。`)}
        if (d instanceof RegExp){return d}
        return new RegExp(type.pattern, type.option)
    }
}
class RangeDataType extends DataType {
    constructor(defVal=0, min=0, max=100) {
        super('range', defVal ?? 0);
        this._min = min; // range.age(0,0,100)
        this._max = max; // cols(age:range.age=5)
    }
    //get alias() {return 'rng|range'.split('|')} // rはRegExpのために取っておく
    static get alias() {return 'rng|range'.split('|')} // rはRegExpのために取っておく
}
class EnumDataType extends DataType {// 列挙値。文字列で指定できる任意型の値リスト。
    constructor(defVal=0, name='') {
        super('enum', defVal ?? 0);
    }
    //get alias() {return 'enm|enum|enumrated'.split('|')}
    static get alias() {return 'enm|enum|enumrated'.split('|')}
}
class SectionDataType extends DataType {// 区間。列挙型の値が整数値であり、歯抜けを許さない版
    constructor(defVal=0, name='') {
        super('section', defVal ?? 0);
    }
    //get alias() {return 'sct|section'.split('|')}
    static get alias() {return 'sct|section'.split('|')}
}


window.Textbase = Textbase;
})();
