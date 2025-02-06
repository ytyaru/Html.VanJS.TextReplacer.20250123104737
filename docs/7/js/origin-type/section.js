;(function(){
class Section {// 区間（連続するRangeリスト）
    static new(min,max) {
        const ins = new Section(min,max,'Section.new()');
        const pxy = new Proxy(ins, this.#handler())
        pxy._originalTarget = ins
        return pxy
    }
    constructor(min,max,from) {
        if ('Section.new()'!==from){throw new TypeError(`Sectionコンストラクタは呼出禁止です。代わりにSection.new()を使用してください。`)}
        this.#min = min;
        this.#max = max;
        this.#isSection();
    }
    static #handler() { return {
        get(target, key, receiver) {
            if (key in target) {
                if (Type.hasGetter(target, key)) { return Reflect.get(target, key) } // ゲッター
                else if ('function'===typeof target[key]) { return target[key].bind(target) } // メソッド参照
                return target[key] // プロパティ値
            }
            else { throw new ReferenceError(`Property does not exist: ${key}`) }
        },
        set(target, key, value, receiver) {
            if ('_originalTarget'===key && value instanceof Section) {target[key]=value;return true}
            else {throw new TypeError(`代入禁止です。`)}
        },
        ownKeys(target) {return []}, // _min, _max, _originalTarget だが、これらを隠す
        deleteProperty(target, key) {throw new TypeError(`削除禁止です。`)},
        isExtensible(target) {return false}, // 新しいプロパティ追加禁止
        setPrototypeOf(target, prototype) {throw new TypeError(`プロトタイプへの代入禁止です。`)}
    } }
    get min() {return this._min}
    get max() {return this._max}
    set #min(v) {this.#throw(v);this._min=v;}
    set #max(v) {this.#throw(v);this._max=v;}
    #isValid(v){return Number.isInteger(v) && v <= Number.MAX_SAFE_INTEGER && Number.MIN_SAFE_INTEGER <= v}
    #throw(v){if (!this.#isValid(v)){throw new TypeError(`値は整数型2^53範囲内であるべきです。:${v}`)}}
    #isSection(){if (this.max < this.min || this.min===this.max){throw new TypeError(`Sectionの引数はmin,maxの順で指定します。minとmaxは1以上差のある整数値であるべきです。:min=${this.min},max=${this.max},max-min=${this.max-this.min}`)}}
    within(v){this.#throw(v);return this.min <= v && v <= this.max;}
    without(v){return !this.within(v);}
    lower(v){this.#throw(v);return v < this.min;}
    upper(v){this.#throw(v);return this.max < v;}
    state(v){return this.state3(v)}
    state2(v){return this.within(v) ? 'within' : 'without'}
    state3(v){return this.within(v) ? 'within' : (this.lower(v) ? 'lower' : 'upper')}
}
window.Section = Section;
})();
