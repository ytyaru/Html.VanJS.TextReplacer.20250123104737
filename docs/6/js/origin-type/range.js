;(function(){
class Range {
    static new(min,max) {
        const ins = new Range(min,max);
        const pxy = new Proxy(ins, this.#handler())
        pxy._originalTarget = ins
        return pxy
        //return new Proxy(ins, this.#handler())
//        this.#throw(min);this.#throw(max);this.#isRange(min,max);
//        this.#validMinMax(min,max)
//        return new Proxy(this.#target(), this.#handler())
    }
    constructor(min,max,from) {
//        if ('Range.new()'!==from){throw new TypeError(`Rangeコンストラクタは呼出禁止です。代わりにRange.new()を使用してください。`)}
        this.#min = min;
        this.#max = max;
        this.#isRange();
//        return Object.freeze(this);
    }
    /*
    static #target() {return Object.create(null, this.#propObj(min,max))}
    static #propObj(min,max) { return {
        _min: {value:min, enumerable:false, writable:false, configurable:false},
        _max: {value:max, enumerable:false, writable:false, configurable:false},
    } }
    */
    static #handler() { return {
        get(target, key, receiver) {
//            if ('min max'.split(' ').some(v=>v===key)) {return target[`_${key}`]}
//            else if('within without lower upper state state2 state3'.split(' ').some(v=>v===key)){return target[key]}
            //if('min max within without lower upper state state2 state3'.split(' ').some(v=>v===key)){return target[key]}
            //if('min max within without lower upper state state2 state3'.split(' ').some(v=>v===key)){return Reflect.get(target, key)}
            //if('min max within without lower upper state state2 state3'.split(' ').some(v=>v===key)){console.log(target, key, target[key]);return Reflect.get(target, key, receiver)}
            //if('min max within without lower upper state state2 state3'.split(' ').some(v=>v===key)){console.log(target, key, target[key]);return receiver[key]}
//            console.log(`target:`, target, target instanceof Range, target instanceof Proxy)
//            console.log(`receiver:`, receiver, receiver instanceof Range, receiver instanceof Proxy)
            console.log(`key:`, key)
            console.log(`target[key]:`, target[key])
            console.log(`Reflect.get(target,key):`, Reflect.get(target,key))
            console.log(`Reflect.get(target,key,target):`, Reflect.get(target,key,target))
//            console.log(`this._originalTarget:`, this._originalTarget)
            console.log(`target._originalTarget:`, target._originalTarget, target._originalTarget instanceof Range)
//            console.log(`receiver._originalTarget:`, receiver._originalTarget)


            /*
            //if('min max within without lower upper state state2 state3'.split(' ').some(v=>v===key)){console.log(target, key, target[key]);return target[key]}
            if('min max'.split(' ').some(v=>v===key)){console.log(target, key, target[key]);return Reflect.get(target._originalTarget, key)}
            if('within without lower upper state state2 state3'.split(' ').some(v=>v===key)){console.log(target, key, target[key]);return target._originalTarget[key]}
            //if('within without lower upper state state2 state3'.split(' ').some(v=>v===key)){console.log(target, key, target[key]);return this.originalTarget[key]}
            //if('min max within without lower upper state state2 state3'.split(' ').some(v=>v===key)){console.log(target, key, target[key]);return this.originalTarget[key]}
//            if('min max within without lower upper state state2 state3'.split(' ').some(v=>v===key)){console.log(target, key, target[key]);return Reflect.get(target,key,target)}
//            if('min max within without lower upper state state2 state3'.split(' ').some(v=>v===key)){console.log(target, key, target[key]);return return Reflect.get(...arguments);}
//            if('min max'.split(' ').some(v=>v===key)){console.log(target, key, target[key]);return Reflect.get(target, key)}
//            if('within without lower upper state state2 state3'.split(' ').some(v=>v===key)){console.log(target, key, target[key]);return target[key].apply(target)}
            throw new TypeError(`存在しないプロパティです。:${key}`)
            */
            if (key in target) {
                if (Type.hasGetter(target, key)) { return Reflect.get(target, key) } // ゲッター
                else if ('function'===typeof target[key]) { return target[key].bind(target) } // メソッド参照
                return target[key] // プロパティ値
            }
            else { throw new ReferenceError(`Property does not exist: ${key}`) }

        },
        //set(target, key, value, receiver) {throw new TypeError(`代入禁止です。`)},
        set(target, key, value, receiver) {
            console.log(key, value, value instanceof Range)
            console.log(key, value, value instanceof Range)
            //if ('_originalTarget'===key && value instanceof Range) {target[key]=value}
            if ('_originalTarget'===key && value instanceof Range) {target[key]=value;return true}
            else {throw new TypeError(`代入禁止です。`)}
        },
        deleteProperty(target, key) {throw new TypeError(`削除禁止です。`)},
        isExtensible(target) {return false}, // 新しいプロパティ追加禁止
        setPrototypeOf(target, prototype) {throw new TypeError(`プロトタイプへの代入禁止です。`)}

    } }
    /*
    constructor(min,max) {
        this.#min = min;
        this.#max = max;
        this.#isRange();
        return Object.freeze(this);
    }
    */
    // Proxyを介すると#で始まるPrivateプロパティにアクセスできなくなる！以下例外発生によって。
    // TypeError: Object must be an instance of class Range
    get min() {return this._min}
    get max() {return this._max}
//    static #validMinMax(min,max) {this.#throw(min);this._min=min;this._max=max;}
//    static #isRange(min,max){if (max < min || min===max){throw new TypeError(`Rangeの引数はmin,maxの順で指定します。minとmaxは1以上差のある整数値であるべきです。:min=${min},max=${max},max-min=${max-min}`)}}
    set #min(v) {this.#throw(v);this._min=v;}
    set #max(v) {this.#throw(v);this._max=v;}
    #isValid(v){return Number.isInteger(v) && v <= Number.MAX_SAFE_INTEGER && Number.MIN_SAFE_INTEGER <= v}
    #throw(v){if (!this.#isValid(v)){throw new TypeError(`値は整数型2^53範囲内であるべきです。:${v}`)}}
    #isRange(){if (this.max < this.min || this.min===this.max){throw new TypeError(`Rangeの引数はmin,maxの順で指定します。minとmaxは1以上差のある整数値であるべきです。:min=${this.min},max=${this.max},max-min=${this.max-this.min}`)}}
    within(v){console.log(this,v);this.#throw(v);return this.min <= v && v <= this.max;}
    without(v){return !this.within(v);}
    lower(v){this.#throw(v);return v < this.min;}
    upper(v){this.#throw(v);return this.max < v;}
    state(v){return this.state3(v)}
    state2(v){return this.within(v) ? 'within' : 'without'}
    state3(v){return this.within(v) ? 'within' : (this.lower(v) ? 'lower' : 'upper')}
}
window.Range = Range;
})();
