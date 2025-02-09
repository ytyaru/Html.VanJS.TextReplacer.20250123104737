;(function(){
class Namespace {// 区間（連続するRangeリスト）
    static #NOT_CALL_CONSTRUCTOR = 'Namespaceのコンストラクタは呼出禁止です。代わりにNamespace.new()してください。'
    static #PATTERN = /^[a-zA-Z][a-zA-Z0-9]+$/;
    static new(text) {
        const ins = new Namespace(text, this.#NOT_CALL_CONSTRUCTOR);
        const pxy = new Proxy(ins, this.#handler())
        pxy._originalTarget = ins
        return pxy
    }
    constructor(text,from) {
        if (this.#NOT_CALL_CONSTRUCTOR!==from){throw new TypeError(this.#NOT_CALL_CONSTRUCTOR)}
//        this._obj = {} // 名前空間の実態。オブジェクトのネスト構造で表す。
        this._obj = this.#parse(text)
    }
//    static #validName(name) {return /^[a-zA-Z][a-zA-Z0-9]+$/.test(name)} // obj['key']でなくobj.keyで参照可能かつキャメルケースのみ
    static #validName(name) {return this.#PATTERN.test(name)} // obj['key']でなくobj.keyで参照可能かつキャメルケースのみ
    static #throwName(name) {if(!this.#validName(name)){throw new TypeError(`無効な名前です。次のパターンのみ有効です。:${name}:${this.#PATTERN}`)}}
    static #isObj(v){return null!==v && undefined!==v && !Number.isNaN(v) && 'object'===typeof v && '[object Object]'===this.#toString(v)}
    static #throwObj(v){if(!this.#isObj(ns)){throw new TypeError(`値はオブジェクトであるべきです。:${v}:${typeof v}`)}}
    static #toString(ns, ...args){return Object.prototype.toString.call(ns, ...args)}
    static has(ns, name) {// nsをルートとしてnameで指定した名前が存在するか。もしnameに.があればルートから開始したものとして。
        this.#throwObj(ns); this.#throwName(name);
        //return name in ns;
        const names = name.split('.')
        if (names.length < 2) { return name in ns }
        let target = ns;
        for (let i=0; i<names.length; i++) {
            if (!this.hasOwn(target, names[i])) {return false}
            target = target[names[i]]
        }
        return true
        /*
        try {
            this.get(ns, name)
            return true;
        } catch (err) {return false}
        */
    }
    static hasOwn(ns, name) {this.#throwObj(ns); this.#throwName(name); return Object.prototype.hasOwnProperty.call(ns, name);}
    static get(ns, name) {
        this.#throwObj(ns); this.#throwName(name);
        if (!this.has(ns, name)){throw new TypeError(`指定した名前空間は存在しません。:${ns},${name}`)}
        const names = name.split('.')
        let target = ns;
        for (let i=0; i<names.length; i++) {
            if (!this.hasOwn(target, names[i])) {throw new TypeError(`指定した名前空間は存在しません。:${ns},${name},${i},${names[i]}`)}
            target = target[names[i]]
        }
        return target
    }
    static isLeaf(ns, name) {
        this.#throwObj(ns); this.#throwName(name);
        if (!this.has(ns, name)){throw new TypeError(`指定した名前空間は存在しません。:${ns},${name}`)}
        return null===this.get(ns, name)
    }
    static #handler() { return {
        //get(target, key, receiver) {
        get: (target, key, receiver)=>{
            if ('_obj'===key){return target[key]}
            this.#throwName(key);
            if (key in target) {
                if (Type.hasGetter(target, key)) { return Reflect.get(target, key) } // ゲッター
                else if ('function'===typeof target[key]) { return target[key].bind(target) } // メソッド参照
                return target[key] // プロパティ値
            }
            else { throw new ReferenceError(`Property does not exist: ${key}`) }
        },
        //set(target, key, value, receiver) {
        set: (target, key, value, receiver)=>{
            this.#throwName(key);
            //if ('_originalTarget'===key && value instanceof Namespace) {target[key]=value;return true}
            if (['_originalTarget', '_obj'].some(v=>v===k) && value instanceof Namespace) {target[key]=value;return true}
            else {throw new TypeError(`代入禁止です。`)}
        },
        ownKeys(target) {return []}, // _min, _max, _originalTarget だが、これらを隠す
        deleteProperty(target, key) {throw new TypeError(`削除禁止です。`)},
        isExtensible(target) {return false}, // 新しいプロパティ追加禁止
        setPrototypeOf(target, prototype) {throw new TypeError(`プロトタイプへの代入禁止です。`)}
    } }
    static #parse(text) {//text:'parent.child'または'parent\n\tchild'のように表現する。これをオブジェクトに変換する。
        const hasDot = text.includes('.');
        const hasTab = text.includes('\t')
             if ( hasDot &&  hasTab) {return this.parseNestLine(text)}
        else if ( hasDot && !hasTab) {return this.parseLine(text)}
        else if (!hasDot &&  hasTab) {return this.parseNest(text)}
        else if (!hasDot && !hasTab) {return this.parseNest(text)}
        if (text.includes('\t') && text.includes('.'))
    }
    static #parseLine(text) {// 'parent.child'形式（\t使用禁止）
        const obj = {}
        const lines = text.split('\n').filter(v=>v.trim())
        //const items = lines.map(line=>line.split('.').filter(v=>v.trim()))
        const items = lines.map(line=>line.split('\t').filter(v=>v.trim())).filter(v=>0 < v.length && 0 < v[0].length)
        for (let names of items) {
            //for (let name of names) {
            for (let i=0; i<names.length; i++) {
                const name = names[i];
                this.#throwName(name);
                const treeTxt = 0===i ? '' : names.slice(0, i+1).join('.');
                const parent = this.get(obj, treeTxt);
                //const obj = {[names[i]]:null}
                if (''===treeTxt) {obj[name]=null;}
                //else if (this.has(obj, treeTxt)) {
                else if (parent) {parent[name] = obj;}
                else {throw new TypeError(`parentが存在しません。:${parent}:${text}:${i}:${treeTxt},${names[i]}`)}
            }
        }
        return obj
    }
    static #parseNest(text) {// 'parent\n\tchild'形式（.使用禁止）
        const obj = {}
        const lines = text.split('\n').filter(v=>v.trim())
        const items = lines.map(line=>line.split('\t').filter(v=>v.trim())).filter(v=>0 < v.length && 0 < v[0].length)
        let preParent = obj;
        let preLevel = 0;
        let preName = null;
        let breadcrumb = []; // 親候補（前行で参照した名前空間）
        for (let l=0; l<lines.length; l++) {
            const name = items.slice(-1)[0];
            const level = items.length-1;
            //if (0===level){obj[name]=null;}
            if (0===level){
                obj[name]=null;
                if (0===breadcrumb.length){breadcrumb.push(name)}
                else {breadcrumb[level]=name}
            }
            else {
                const lvDiff = level - preLevel
                if (0===lvDiff) {// 前行と現行は同じ親
                    preParent[name] = null;
                    //breadcrumb[breadcrumb.length-1] = preParent[name];
                    breadcrumb[level]=name;
                }
                else if (1===lvDiff) {// 前行は親、現行は子
                    target = preParent[preName]
                    target[name] = null;
                    //breadcrumb[breadcrumb.length-1] = target[name];
                    if (breadcrumb.length <= level+1){breadcrumb.push(name)}
                    else {breadcrumb[level+1]=name;}
                }
                else if (lvDiff < 0) {// 前行と現行は別の親
                    target = this.get(obj, breadcrumb.join('.'));
                    target[name] = null;
                    if (breadcrumb.length <= level){breadcrumb.push(name)}
                    else {breadcrumb[level]=name;}
                }
                else {throw new TypeError(`前行と元行のネスト数差は一、ゼロ、負数のみ有効です。:${lvDiff}:${lines[l]},${l}${0<l ? ','+lines[l-1] : ''}`)}
            }
        }
        return obj
    }
    static #parseNestLine(text) {// 'root.parent\n\tleaf.child'形式（NestとLineの併用。親子に.を含めることが可能）
        throw new SyntaxError(`未実装`)
    }
    _has(name) {}
    _hasOwn(name) {}

    /*
    get min() {return this._min}
    get max() {return this._max}
    set #min(v) {this.#throw(v);this._min=v;}
    set #max(v) {this.#throw(v);this._max=v;}
    #isValid(v){return Number.isInteger(v) && v <= Number.MAX_SAFE_INTEGER && Number.MIN_SAFE_INTEGER <= v}
    #throw(v){if (!this.#isValid(v)){throw new TypeError(`値は整数型2^53範囲内であるべきです。:${v}`)}}
    #isNamespace(){if (this.max < this.min || this.min===this.max){throw new TypeError(`Namespaceの引数はmin,maxの順で指定します。minとmaxは1以上差のある整数値であるべきです。:min=${this.min},max=${this.max},max-min=${this.max-this.min}`)}}
    within(v){this.#throw(v);return this.min <= v && v <= this.max;}
    without(v){return !this.within(v);}
    lower(v){this.#throw(v);return v < this.min;}
    upper(v){this.#throw(v);return this.max < v;}
    state(v){return this.state3(v)}
    state2(v){return this.within(v) ? 'within' : 'without'}
    state3(v){return this.within(v) ? 'within' : (this.lower(v) ? 'lower' : 'upper')}
    */
}
window.Namespace = Namespace;
})();

