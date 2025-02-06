# 独自コレクション型

　プリミティブ型を複数持つ、独自のコレクション型について。

独自コレクション型|要約
------------------|----
`Range`(`rng`)|範囲値。最小値と最大値を整数値で持つ。
`Section`(`sct`)|区間値。`Enum`の値が`Range`限定版。前後の`MAX`と`MIN`の差は`1`であるべき。最初の`MIN`や`MAX`には`Infinity`可。
`Enum`(`enm`)|列挙値。候補値を網羅する。添字に整数や名前を使えて個別参照可。全名前を網羅でき存在確認可。値は任意の型で全値統一。

独自コレクション型|要約
------------------|----
`Tuple`(`tpl`)|固定配列。配列だが名前や型を割当可。要素数はその定義数で固定される。
`Table`(`tbl`)|表。列と行を持つ。列は順、名、型、値を持つ。行は各列の値を持つ配列。

## Range

　整数値を二つ引数に取る。下限超過、上限超過、範囲内、の三値判定できる。

```javascript
class Range {
    constructor(min,max) {
//        this._min = min;
//        this._max = max;
        this.#min = min;
        this.#max = min;
    }
    get min() {return this._min}
    get max() {return this._max}
    set #min(v) {if (!this.#isValid(v)){throw new TypeError(`minは整数型2^53範囲内であるべきです。:${v}`)}else {this._min = v}}
    set #max(v) {if (!this.#isValid(v)){throw new TypeError(`minは整数型2^53範囲内であるべきです。:${v}`)}else {this._min = v}}
    #isValid(v){return Number.isInteger(v) && v <= Number.MAX_SAFE_INTEGER && Number.MIN_SAFE_INTEGER <= v}
    within(v)
    without(v)
    lower(v)
    upper(v)
}
```

