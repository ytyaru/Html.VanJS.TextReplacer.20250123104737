# TextBase Types

　データの型は以下の二つに大別できる。

* コレクション型
* プリミティブ型

　使用しないデータは以下。

* `null`,`undefined`,`NaN`

　局所的に使う可能性があるのは以下。

* `MIN`,`MAX`,`Infinity`,`-Infinity`,`∞`,`-∞`

## コレクション型

型|規定デフォルト値
--|----------------
`ary`|`[]`
`obj`|`{}`
`set`|`new Set()`
`map`|`new Map()`

型|規定デフォルト値
--|----------------
`arys`|`[[],[],...]`
`objs`|`[{},{},...]`
`sets`|`[new Set(), ...]`
`mapt`|`[new Map(), ...]`

型|規定デフォルト値
--|----------------
`tary`|`Typed Array` `[[],[],...]`
`tarys`|`Typed Arrays` `[[],[],...]`

型|規定デフォルト値
--|----------------
`cols`|`[{name:'', type:'', defaultValue:'', validate:()=>{}}]`, `[name:type=defVal, ...]`
`rows`|`[[r1c1,r1c2],[r2c1,r2c1],...]`
`table`|`{cols:[],rows:[]}`
`enum`|`{key:{name:'', value:''}}`, `[{key:'', name:'', value:0},...]`
`flags`|`[{name:'isA', value:0},...]`, `{isA:true, isB:false, isC:true}`, `0b101`

型|規定デフォルト値
--|----------------
`setary`,`uniqary`,`uary`,`ids`|`[...new Set()]`
`objmap`|`{k:new Map(), ...}`

型|規定デフォルト値
--|----------------
`range`,`rng`|`[[1-800],[801-4000],[4001,20000],[20001,100000]]`
`range`,`rng`|`[{name:'掌編',range:[1-800]},{name:'SS',range:[801-4000]},{name:'短編',range:[4001-20000]},{name:'中編',range:[20001-100000]},{name:'長編', range:[100001-500000]},{name:'巨編',range:[500001-Infinity]}}]`

## プリミティブ型

型|規定デフォルト値
--|----------------
`str`|``(空文字列。エスケープ文字`\0`または未入力)
`int`|`0`(-1,MIN,MAX等も候補になる。NaN,Infinityは計算時に例外発生するため使用禁止)
`flt`|`0.0`
`bln`|`false`

　実態はオブジェクトだがプリミティブ型とされる型。

型|規定デフォルト値
--|----------------
`reg`|`new RegExp('','')`, `/(.+)/g` (正規表現)[RegExp][]
`url`|`new URL()` [URL][]
`date`|`new Date()` [Date][]
`b16`|`Binary`(`00FF`など1バイトを16進数2字で表現する。データ量二倍！) [Uint8Array][]
`b64`|`Base64`(バイナリ配列をBase64で表現する。データ量33%増加。) [Uint8Array][]

[URL]:https://developer.mozilla.org/ja/docs/Web/API/URL_API
[RegExp]:https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/RegExp
[Date]:https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/Date
[Uint8Array]:https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array

　真偽値をどう表記するか。

`false`|`true`|解説
-------|------|----
`0`|`1`|C言語などでは数値`0`を`false`,それ以外を`true`と判断する。
`F`|`T`|`False`と`True`の頭文字である。
`f`|`t`|`false`と`true`の頭文字である。
`x`|`o`|`❌`と`⭕`である。これは日本語圏における記号であり国際的には意味が逆になったり別の記号で表現する場合がある。
`O`|`X`|`❌`と`⭕`を大文字で表現した。
`_`|`v`|`❌`と`⭕`の英語圏版である。選挙の投票ではしばしばチェックをつけて真を表す記号に`✔`が使われる。英語圏における未回答は空欄だが、TextBaseでは意図した偽であることを明示するために`-`や`_`を用いることを提案する。`_`のほうが変数名として使いやすいか。

　整数は基数を指定できる。初期値は`10`であり十進数だ。基数は`2`〜`36`の整数値である。これは[parseInt()][]の第二引数である。

[parseInt]:https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/parseInt

記述|JSコード
----|--------
`i`|`parseInt(v, 10)`
`i8`|`parseInt(v, 8)`
`iH`|`parseInt(v, 16)`
`i16`|`parseInt(v, 16)`
`i32`|`parseInt(v, 32)`
`i36`|`parseInt(v, 36)`

　Rustでは`i8`,`i32`などビット数を表記するが、TextBaseにおける数は基数である。

* 型を指定して値を入力する（正確）
* 値から型を推測する（型を省略できる）

```
cols(pattern:regexp=/(.+)/g)
cols(pattern:reg=/(.+)/g)
cols(pattern=/(.+)/g)
```

　上記の場合、値が`/(.+)/(dgimsuvy)?`のパターンにマッチする文字列なら、正規表現型であると判断する。もしこのパターンにマッチする文字列`String`型としてデータ挿入したいときは`String`型であることを明示せねばならない。`cols(name:str=/aaa/g)`のように。

型|値の書式で型を推測する
--|----------------------
`str`|`以下以外のすべて`
`int`|`[\-]?[0-9]+`
`flt`|`[\-]?[0-9]*\.[0-9]+`
`bln`|``（`01`,`xo`,`_v`をサフィックスとして付与してその字であるかで判断する。`01`は整数と区別できないし`xo`,`_v`も文字と区別不能だが、まだ文字列のほうが区別できる可能性が高い）
`reg`|`\/(.+)\/[dgimsuvy]*`
`url`|`^http[s]?://`
`date`|`\d{1,}-\d{2}-\d{2}(T\d{2}:\d{2}:\d{2})?(.\d{1,})?`
`b16`|`[0-9A-F]+`
`b64`|`data://...`
`fra`|`{int}+\/{int}+`, `Fraction`
`rate`|`{int|flt}:{int|flt}`


　コレクション型は値の型を定義できる。

```
obj.human(name:str='山田',age:int=12)
cols.human(name:str='', age:int=0)
```

`i`

