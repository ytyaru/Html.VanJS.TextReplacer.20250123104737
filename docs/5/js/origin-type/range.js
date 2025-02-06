;(function(){
class Range {
    constructor(min,max) {
        this.#min = min;
        this.#max = max;
        this.#isRange();
        return Object.freeze(this);
    }
    get min() {return this._min}
    get max() {return this._max}
    set #min(v) {this.#throw(v);this._min=v;}
    set #max(v) {this.#throw(v);this._max=v;}
    #isValid(v){return Number.isInteger(v) && v <= Number.MAX_SAFE_INTEGER && Number.MIN_SAFE_INTEGER <= v}
    #throw(v){if (!this.#isValid(v)){throw new TypeError(`値は整数型2^53範囲内であるべきです。:${v}`)}}
    #isRange(){if (this.max < this.min || this.min===this.max){throw new TypeError(`Rangeの引数はmin,maxの順で指定します。minとmaxは1以上差のある整数値であるべきです。:min=${this.min},max=${this.max},max-min=${this.max-this.min}`)}}
    within(v){this.#throw(v);return this.min <= v && v <= this.max;}
    without(v){return !this.within(v);}
    lower(v){this.#throw(v);return v < this.min;}
    upper(v){this.#throw(v);return this.max < v;}
    state(v){return this.state3(v)}
    state2(v){return this.within(v) ? 'within' : 'without'}
    state3(v){return this.within(v) ? 'within' : (this.lower(v) ? 'lower' : 'upper')}
}
window.Range = Range;
})();
