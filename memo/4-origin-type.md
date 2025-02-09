# 独自コレクション型

　プリミティブ型を複数持つ、独自のコレクション型について。

独自コレクション型|要約
------------------|----
`Namespace`(`ns`)|名前空間。親子関係を持つオブジェクト。所定の名前以外を参照すると例外発生する。
`Range`(`rng`)|範囲値。最小値と最大値を整数値で持つ。
`Section`(`sct`)|区間値。`Enum`の値が`Range`限定版。前後の`MAX`と`MIN`の差は`1`であるべき。最初の`MIN`や`MAX`には`Infinity`可。
`Enum`(`enm`)|列挙値。候補値を網羅する。添字に整数や名前を使えて個別参照可。全名前を網羅でき存在確認可。値は任意の型で全値統一。

独自コレクション型|要約
------------------|----
`NamedArray(`na`)`|名前付き配列。キーとして`0`から始まる整数以外に一意の識別子からも参照できる。その関係上個数固定。(Tupleと同じ?)
`Tuple`(`tpl`)|固定配列。配列だが名前や型を割当可。要素数はその定義数で固定される。
`Table`(`tbl`)|表。列と行を持つ。列は順、名、型、値を持つ。行は各列の値を持つ配列。

## Namespace

　名前空間。親子関係を持つオブジェクト。所定の名前以外を参照すると例外発生する。

```javascript
class Namespace {
    static #NOT_CALL_CONSTRUCTOR = 'Namespaceのコンストラクタは呼出禁止です。代わりにNamespace.new()してください。'
    static new(text) {return new Namespace(text, this.#NOT_CALL_CONSTRUCTOR)}
    constructor(nsTxt,from) {//nsTxt:'parent.child'または'parent\n\tchild'のように表現する
        if (this.#NOT_CALL_CONSTRUCTOR!==from){throw new TypeError(this.#NOT_CALL_CONSTRUCTOR)}
        this._obj = {} // 名前空間の実態。オブジェクトのネスト構造で表す。
        return new Proxy(this.#target(), this.#handler()); // 指定した名前以外にアクセスしたら例外発生する
    }
    #validName(name) {return /^[a-zA-Z][a-zA-Z0-9]+$/.test(name)} // obj['key']でなくobj.keyで参照可能かつキャメルケースのみ
    static has(ns, name) {}
    static hasOwn(ns, name) {}
}
```
```
A.a.one
A.a.two
A.b.one
A.b.two
```
```
{
  A:{
    a:{
      one:null,
      two:null
    },
    b:{
      one:null,
      two:null
    }
  }
}
```

## Range

　整数値を二つ引数に取る。下限超過、上限超過、範囲内、の三値判定できる。

```
rng 0 100
```

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

## Section

　範囲を`min-max`で表記する。でも負数の場合は記号が重複する。

```
section.novelScale -0:none=無 1-:palm=掌編 801-:ss=SS 4001-:short:短編 20001-:middle=中編 100001-:long=長編 500001-:huge:巨編
```

　範囲を`min,max`で表記する。最初の`min`を略したら`-Infinity`になる。最後の`max`を略したら`Infinity`になる。途中の`min`,`max`を略したら前後にある要素から`+1`,`-1`した値をセットする。

```
section.novelScale ,0:none=無 1,:palm=掌編 801,:ss=SS 4001,:short:短編 20001,:middle=中編 100001,:long=長編 500001,:huge:巨編
```

　複数行表記なら以下。

```
---section.novelScale
,0	none	無
1,	palm	掌編
801,	ss	SS
4001,	short	短編
20001,	middle	中編
100001,	long	長編
500001,	huge	巨編
---
```
```
---section.novelScale
	-500001	task	課題(巨編)
	-100001	task	課題(長編)
	-20001	task	課題(中編)
	-4001	task	課題(短編)
	-801	task	課題(SS)
	-1	task	課題(掌編)
	0	none	白紙
1		palm	掌編
801		ss	SS
4001		short	短編
20001		middle	中編
100001		long	長編
500001		huge	巨編
---
```

```javascript
[
  {i:0, range:new Range(-Infinity,0), key:'none', value='無'},
  {i:1, range:new Range(1,800), key:'palm', value='掌編'},
  {i:2, range:new Range(801,4000), key:'ss', value='SS'},
  {i:3, range:new Range(4001,20000), key:'short', value='短編'},
  {i:4, range:new Range(20001,100000), key:'middle', value='中編'},
  {i:5, range:new Range(100001,500000), key:'long', value='長編'},
  {i:6, range:new Range(500001,Infinity), key:'huge', value='巨編'},
]
```
```javascript
const sec = textbase.deserialize('section.novelScale -0:none=無 1-:palm=掌編 801-:ss=SS 4001-:short:短編 20001-:middle=中編 100001-:long=長編 500001-:huge:巨編')
sec[0]   // {i:0, range:new Range(-Infinity,0), key:'none', value='無'}
sec.palm // {i:1, range:new Range(1,800), key:'palm', value='掌編'}
```
```
class Section {
  static keys(sct) {return sct.map(s=>s.key)}
  static values(sct) {return sct.map(s=>s.value)}
  static ranges(sct) {return sct.map(s=>s.range)}
  static keys(sct) {return sct.map(s=>s.key)}
}
```

## Enum

　Enumは配列、オブジェクト、Map、Setと違い、キーが整数と文字列の二種類ある。また、他のコレクション型と同様、`length`/`size`, `keys`, `values`のように全体を取得できる。他にも型一致なども可能。

```javascript
class Enum {
    static new () {}
    static is(e) {} // 型と値が一致する
    static isType(e) {} // 型のみ一致する（値は不一致でも真を返す）
    static getType(e) {}
    static get(v) {}
    static getIndex(v) {}
    static getKey(v) {}
    static getValue(v) {}
    constructor(id, valueType, kvs) {//name:Enum型インスタンスを識別する名前, valueType:値の型, kvs:要素のキーと値

    }
}
```
```javascript
[
  {i:0, key:'', value:''}
]
```

```javascript
const fileOpenModes = Enum.new('FileOpenModes', 'int', 'read write append')
Enum.ids // ['FileOpenModes']
Enum.has(fileOpenModes) // Enum.ids.includes(fileOpenModes.id)
Enum.isType('FileOpenModes', fileOpenModes)
Enum.isType('FileOpenModes', fileOpenModes.read)

fileOpenModes.read    // Enumインスタンス?
fileOpenModes.write   // Enumインスタンス?
fileOpenModes.append  // Enumインスタンス?

const mode = fileOpenModes.read
Enum.isType('FileOpenModes', fileOpenModes)
Enum.is('FileOpenModes.read', fileOpenModes.read)

fileOpenModes.read === fileOpenModes.read   // 0 === 0
fileOpenModes.read < fileOpenModes.write    // 0 < 1    Enumインスタンスだと <,> で比較できない
fileOpenModes.write < fileOpenModes.append  // 1 < 2    Int型なら可能。でもEnum型判定ができなくなる

Enum.getEnum('FileOpenModes')
Enum.getValue('FileOpenModes.read')

Enum.isType('FileOpenModes', fileOpenModes)
```
