# Serializer

　テキストからJavaScriptのデータ構造に変換する処理。またはその逆。

## 構造

* FunctinalText
    * Store
        * Serializer <- ここ
    * Replacer
    * Generator

## API

```javascript
serialize('定義テキスト') // [], {}, new Map, new Set, function, Class, new Class, ...
```
```javascript
deserialize(JSオブジェクト) // '定義テキスト'
```

## 出力

　コレクションを出力する。それはキーと値を持つ。キーは整数か文字列、値は任意の型である。値の型は`String`が基本である。

型|和名|コード例
--|----|--------
`Array`|配列|`['A','B','C']`
`Object`|オブジェクト|`{name:'山田', age:12}`
`Set`|セット|`new Set(['A','B','C'])`
`Map`|マップ|`new Map([['name','山田'],['age',12]])`

　ネストしたコレクションもある。

型|和名|コード例
--|----|--------
`2DArray`|二次元配列|`[['A','B'],['C','D'],...]`
`ObjectArray`|オブジェクト配列|`[{name:'山田', age:12},...]`
`NamedArray`|名前付き配列|`{names:['name','age'], types:['str','int'], validates:[(v)=>0<v.length, (v)=>0<=v], values:['山田',12]}`
`2DNamedArray`|二次元配列|`{names:['name','age'], types:['str','int'], validates:[...], values:[['A','B'],['C','D'],...]}`
`Tree`|木|`{root:{parent:child:'value/他の型の値を参照する'}}`
`Table`|表|`{cols:[{name:'name',type:'str',validate:v=>v}], rows:[{k1:'v1, k2:'v2'}]}`
`Column`|列|`{name:'name', type:'str', validate:(v)=>0<v.length}`
`Row`|行|`{key1:'value1', key2:'value2'}`
`Class`|無名クラス|`class {constructor(name,age){this.name=name;this.age=age;}}`
`Instance`|無名インスタンス|`new (class {constructor(name,age){this.name=name;this.age=age;}})(name,age)`
`Class NAME`|クラス|`class NAME {constructor(name,age){this.name=name;this.age=age;}}`
`Instance NAME`|インスタンス|`new (class NAME {constructor(name,age){this.name=name;this.age=age;}})(name,age)`

略1|略3|全名
---|---|----
`a`|`ary`|`Array`
`o`|`obj`|`Object`
`s`|`set`|`Set`
`m`|`map`|`Map`

略1|略3|全名
---|---|----
`A`|`2a`,`2da`|`2DArray`
`O`|`oa`|`ObjectArray`
`na`|`nary`|`NamedArray`
`2na`|`2nary`|`2DNamedArray`
`no`|`nobj`|`NamedObject`
`ns`|`nset`|`NamedSet`
`nm`|`nmap`|`NamedMap`
`t`|`tree`|`Tree`
`t`|`tbl`|`Table`
`c`|`col`|`Column`
`r`|`row`|`Row`
`c`|`cls`|`Class`
`i`|`ins`|`Instance`

　プリミティブ型は以下を使う。

略1|略3|全名|和名|コード例
---|---|----|----|--------
`s`|`str`|`String`|文字列|`'文'`, `"字"`, `` `列` ``
`i`|`int`|`Integer`|整数|`123`
`f`|`flt`|`Float`|浮動少数点数|`0.1`
`b`|`bln`|`Boolean`|真偽|`true`,`false`
`I`|`bi`|`BigInt`|長整数|`9007199254740991n`

　基本的にはNULL安全にする。つまり`null`,`undefined`は使わない。また、`Integer`型にしても`NaN`や`Infinity`は計算不能になるため使わない。有限数のみ使用する。`MAX`や`MIN`は使ってもいい。`Symbol`型も使わない。

　オブジェクト型は以下を使う。

略1|略3|全名|和名|コード例
---|---|----|----|--------
`r`|`reg`|`RegExp`|正規表現|`/(.+)/g`, `new RegExp('(.+)', 'g')`
`d`|`dt`|`Date`|日時|`yyyy-MM-dd`,`yyyy-MM-ddTHH:mm:ss+0900`
`u`|`url`|`URL`|URL|`new URL(encodeURL(...))`（単なる文字列だが`new URL`や`encodeURL`に渡される）
`c`|`cd`|`Code`|コード|`new SourceCode(文字列)`（単なる文字列だが`new Function()に渡される`）
`F`|`fn`|`Function`|関数|new Function(文字列)`（単なる文字列だが`new Function()に渡される`）
`B`|`b64`|`Base64`|Base64|バイナリデータをテキストで表現する手法。

　自作したいオブジェクト型は以下。

略1|略3|全名|和名|コード例
---|---|----|----|--------
`F`|`fra`|`Fraction`|分数|`1/2`（整数をスラッシュで区切り分子と分母を定義する。分子と分母を取得可能の他、浮動小数点数にも変換可能）
`p`|`pth`|`Path`|パス|`/tmp`, `./dir/file.ext`（単なる文字列だが、パス結合するときの区切り文字調整をしてくれる）

　略字`f`/`F`が重複する。`float`,`function`,`fraction`の三語で重複する。`flt`,`fn`,`fra`なら重複しない。

　`base64`が含まれるとファイルサイズが増大してしまう。`base64`はファイルの末尾に書き、最後にファイル全体を`ZIP`圧縮するのが最高効率と思われる。

文字列圧縮ライブラリ
https://developer.mozilla.org/ja/docs/Web/API/Compression_Streams_API
https://zenn.dev/chot/articles/what-is-lz-string
https://github.com/pieroxy/lz-string

## 定義テキスト書式

　Markdownのフェンス書式のようなものを使う。

```
---store
定義内容
---
```

　フェンスはネストできる。親ほどフェンス記号が長くなる。開始と終端のフェンス記号字数は同じであること。フェンス記号字数は同じ字が`3`以上であること。

```
----store
---ary
V1
V2
V3
---
---obj
name    山田
age 12
---
----
```

　一番ネストが深くなるのが`table`だと思う。

```
------store
-----table
----cols
name    str (v,row)=>0<v.length
age int (v,row)=>0<=v
----
----rows
山田    12
鈴木    24
----
-----
------
```

　フェンスには引数がある。フェンス記号`---`の先にある文字列がそれだ。たとえば`store`,`table`,`cols`などがある。

　フェンス第一引数は解析方法を示す識別子だが、その後に続く引数もセットできる。主にスペース区切りで。

```
---store ID
---
```

　たとえば上記はデータをもつ`store`の中でも、`ID`という固有の名前を持たせることができる。これにて複数の`store`があっても名前によって区別できる。

```
---store A
Aの定義
---
---store B
Bの定義
---
```
```javascript
db.store.A // {Aの定義}
db.store.B // {Bの定義}
```

　おおよそ以下のような意味になる。

```
---解析種別ID 同種固有ID 任意引数 ...
---
```

　ここから先は解析種別ID毎に詳しく見ていく。

* `Array`
* `Object`
* `Set`
* `Map`
* `Tree`
* `2DArray`
* `NamedArray`
* `2DNamedArray`
* `ObjectArray`
* `Column`
* `Row`
* `Table`

`Array`|配列|`['A','B','C']`
`Object`|オブジェクト|`{name:'山田', age:12}`
`Set`|セット|`new Set(['A','B','C'])`
`Map`|マップ|`new Map([['name','山田'],['age',12]])`
`2DArray`|二次元配列|`[['A','B'],['C','D'],...]`
`ObjectArray`|オブジェクト配列|`[{name:'山田', age:12},...]`
`NamedArray`|名前付き配列|`{names:['name','age'], types:['str','int'], validates:[(v)=>0<v.length, (v)=>0<=v], values:['山田',12]}`
`2DNamedArray`|二次元配列|`{names:['name','age'], types:['str','int'], validates:[...], values:[['A','B'],['C','D'],...]}`
`Tree`|木|`{root:{parent:child:'value/他の型の値を参照する'}}`
`Table`|表|`{cols:[{name:'name',type:'str',validate:v=>v}], rows:[{k1:'v1, k2:'v2'}]}`
`Column`|列|`{name:'name', type:'str', validate:(v)=>0<v.length}`
`Row`|行|`{key1:'value1', key2:'value2'}`
`Class`|無名クラス|`class {constructor(name,age){this.name=name;this.age=age;}}`
`Instance`|無名インスタンス|`new (class {constructor(name,age){this.name=name;this.age=age;}})(name,age)`
`Class NAME`|クラス|`class NAME {constructor(name,age){this.name=name;this.age=age;}}`
`Instance NAME`|インスタンス|`new (class NAME {constructor(name,age){this.name=name;this.age=age;}})(name,age)`

### `Array`

　`Array`はJSでいう配列`['A','B','C']`をテキスト形式で表す。

```
---ary
A
B
C
---
```
```javascript
db.store.ary // ['A','B','C']
```

　第二引数で名前を付与できる。

```
---ary names
山田
鈴木
高橋
---
```
```javascript
db.store.ary.names // ['A','B','C']
```

　複数形`arys`は定義済みの`ary`を結合した別名の`ary`を定義できます。以下は`スゲー奴`と`ザコ`を結合した全員を含む配列`all`を定義します。

```
---ary スゲー奴
鈴木
---
---ary ザコ
山田
高橋
---
---arys
all スゲー奴    ザコ
---
```
```javascript
db.store.ary['スゲー奴'] // ['鈴木']
db.store.ary['ザコ']     // ['山田','高橋']
db.store.ary.all         // ['鈴木','山田','高橋']
```

　値には型を付与できます。普通、型は文字列`String`です。その理由は、これがテキストをベースにしたDBだからです。ただし、他の型を使いたい場合もあるでしょう。

　次の場合、一番目の値は`String`、二番目の値は`Integer`型であることを示します。もし変換できなければ例外発生なりログ出力なりします。それ以降に値があっても型チェックしません。

```
---ary str,int
山田
12
---
```

　もし末尾に`;`があれば、それ以上に値があったら例外発生させます。

```
---ary str,int;
山田
12
異常値
---
```

　次の場合、指定した位置にある型チェックを繰り返します。

```
---ary (str,int)
山田
12
鈴木
24
---
```

　`;`があり半端な数なら例外発生させます。

```
---ary (str,int);
山田
12
鈴木
24
異常値
---
```

　しかし上記のように型を必要とした場合は、表（テーブル）にしたほうがいいかもしれません。

　型よりもデリミタ（区切り文字）変更のほうが需要がありそうです。

```
---ary ,
山田,12,鈴木,24
---
```

　あるいは複数のデリミタ（区切り文字）をセットできるようにしてもいいでしょう。

```
---ary ,\n
山田,12
鈴木,24
---
```

エスケープ|意味
----------|----
`\b`|半角スペース
`\n`|改行コード
`\t`|タブコード
`,`|カンマ

　見た目的に二次元配列のようですが、出力は一次元配列`['山田','12','鈴木','24']`です。

　長過ぎるデータで、テキストエディタ上の見た目を綺麗に整えたい場合に使えるでしょう。

　厄介なのは名前、型、デリミタの複合パターンです。それらが省略されているパターンもありうるため、何番目の引数が、何に対する値なのかが判然としません。

ID|型|デリミタ|例
--|--|--------|--
0|0|0|`---ary`
1|0|0|`---ary ID`
0|1|0|`---ary str,int`
0|0|1|`---ary ,\n`
1|1|0|`---ary ID str,int`
1|0|1|`---ary ID ,\n`
0|1|1|`---ary str,int ,\n`
1|1|1|`---ary ID str,int ,\n`

項目|パターン|捕捉
----|--------|----
ID|`[_a-zA-Z][_a-zA-Z0-9]*`|ただし任意文字列でも構わないため必ずしもこのパターンに合致するとは限らない
型|`(str|int|flt|bln|...)`|型を表す文字列パターンだが、もしかするとこれと同じIDやデリミタを付与したい場合も有り得る
デリミタ|`(\b|\n|\t|,)`|区切り文字を表す文字列パターンだが、他にも`;`,`/`,`\`や複数の文字列`<!-- more -->`なども有り得る

　値だけでどれに対するものかを識別することは困難である。よってキー名による指定をするのが正確だろう。

```
---ary id=スゲー奴 type=str,int delimiter=,\n
鈴木    24
---
```

　でもこれだと冗長だ。三つある場合は`ID,TYPE,DELIMITER`の順で定義されていると判断すればキー名は省略できる。

```
---ary スゲー奴 str,int ,\n
鈴木    24
---
```

　問題は引数が一つ、二つの場合である。いっそレアケースは排除してしまおうか。

```
---ary names str,int
鈴木    24
---
---ary names ,\n
鈴木    24
---
---ary str,int ,\n
鈴木    24
---
---ary names
鈴木    24
---
---ary str,int
鈴木    24
---
---ary ,\n
鈴木    24
---
```

* デリミタはエスケープ文字または記号の一文字だけ有効とする
* 型は型文字列とそれを区切るカンマの組合せのみ有効とする
* IDは`[_a-zA-Z][_a-zA-Z0-9]`のみ有効とする

　上記3つのパターンにすれば、かなり正確に判断できる。ただし、以下のような場合は判定不能となる。

```
---ary str str
鈴木
---
```

　一番目と二番目が同じ文字列`str`である。両方ともデリミタでないことは判明する。IDと型の両方が同じ場合、そもそも区別する必要がない。両者ともに`str`をセットすればいいだけだから。

　ん？　問題ないのか？

　最後に短縮形を定義したい。値が短いなら一行で書ける。

```
---ary 山田 12 鈴木 24
```

　ただ、IDを付けたい場合はどうするか。型やデリミタは固定にしてしまうほうがいいか？

```
---ary names 山田 12 鈴木 24
```

　あるいは`()`で構文ネストする？

```
---ary names((str,int),\b) 山田 12 鈴木 24
```

　いっそメタ情報をすべて`()`内に入れる？

```
---ary(names,(str,int),\b) 山田 12 鈴木 24
```

　一行表記のときデリミタは`\b`固定でいいのでは？　なら略せる。（`\b`より`\t`のほうがいい？英文の時なら尚更）

```
---ary(names,(str,int)) 山田 12 鈴木 24
```

　でもデリミタがカンマの時はメタ文字のカンマと区別がつかなくなる。

```
---ary(names,(str,int),,) 山田,12,鈴木,24
```

　クォートするとややこしくなる。

```
---ary(names,(str,int),',') 山田,12,鈴木,24
```

　`\c`をカンマのエスケープということにすればクォートせずにメタ文字重複しなくなる。

```
---ary(names,(str,int),\c) 山田,12,鈴木,24
```

　こうなると`---`も短縮したくなる。

```
ary(names,(str,int)) 山田 12 鈴木 24
```

　型がなくなればもっとシンプル。

```
ary(names) 山田 鈴木
```

　名前もなくせばもっとシンプル。

```
ary() 山田 鈴木
```

　つまり以下は同じ。一行で書くのと複数行で書いた版。

```
---store
ary() 山田 鈴木
---
```

```
----store
---ary
山田
鈴木
---
----
```

　一行で書けるのは配列とオブジェクトくらいか？　

```
---store
ary() 山田 鈴木
obj(yamada) name=山田 age=12
---
```

　他の型も工夫すれば書けなくはない。メタ文字が増えるため値に使える字の制限は受けるが。そこは`\b`,`\c`にエスケープすればいい。

```
---store
grid() 山田,12 鈴木,24
---
```

　表も小さければ一行で済む。

```
----store
---table
cols(name:str='', age:int=0)
rows() 山田,12 鈴木,24
---
----
```

　`table`は`cols`と`rows`の順番で存在するなら、以下のように略せる。

```
---store
table((name:str='', age:int=0), (山田,12 鈴木,24))
---
```

　自身の変数に依存している場合もありうる。バッククォートで囲み、その中をブレースで囲んだものは変数名の値で置換されるものとする。

```
---store
obj(yamada) name=山田 age=12 intro=`My name is {name}.`
---
```

　以下のようにすれば全体で一行になる。これが最高短縮記法かな？

```
store.ary() 山田 鈴木
```
```
db.store.ary // ['山田','鈴木']
```

　JSで書くと以下。データ量が増えないと恩恵を感じにくそう。コードから大量のデータを排除できれば見やすくなったり`import`の高速化になるはず。

```javascript
['山田','鈴木']
```
```javascript
'山田 鈴木'.split(' ')
```

　これをシリアライズ／デシリアライズすると以下。

```javascript
store.serialize('store.ary() 山田 鈴木') // ['山田','鈴木']
```
```javascript
store.deserialize(['山田','鈴木']) // 'store.ary() 山田 鈴木'
```

　いや`store`も略せるか？

```javascript
store.serialize('ary() 山田 鈴木') // ['山田','鈴木']
```
```javascript
store.deserialize(['山田','鈴木']) // 'ary() 山田 鈴木'
```

### `Object`

　`Object`はJSでいう`{name:'山田', age:12}`をテキスト形式で表す。

```
---obj
name    山田
age:i   12
---
```
```javascript
db.store.obj // {name:'山田', age:12}
```

　一行で書くと以下。

```
obj(name=山田,age:i=12)
```
```
obj(name,age:i) 山田 12
```

　第二引数で名前を付与できる。

```
---obj yamada
name    山田
age:i   12
---
```
```javascript
db.store.obj.yamada // {name:'山田', age:12}
```

　一行で書くと以下。値を一緒くたに書いてしまうか否かの違いがある。

```
obj(yamada,(name=山田,age:i=12))
```
```
obj(yamada,(name,age:i)) 山田 12
```

　自身の変数を参照する場合がある。

```
obj(yamada,(name=山田,age:i=12,intro=`My name is {name}.`))
```
```
obj(yamada,(name,age:i,intro)) 山田 12 `My name is {name}.`
```

　ついでにメタ文字のスペース`\b`もそのまま使える。`'`や`"`もサポートすると複雑化するためバッククォートのテンプレート書式のみ対応にする。

### `Set`
### `Map`
### `Tree`
### `2DArray`
### `NamedArray`
### `2DNamedArray`
### `ObjectArray`
### `Column`
### `Row`
### `Table`




### ``

　`table`の`cols`は別の`cols`を継承できる。JSでいうスプレッド構文`{...base, ...super}`で実装する。たとえば以下の場合、`{...human, ...superman}`である。`{...human{name, age}, ...superman{power}}`であり、`{name:, age:, power:}`となる。

```
------store
----cols human
name    str (v,row)=>0<v.length
age int (v,row)=>0<=v
----
----cols superman human
power   int
----
----rows human
山田    12
鈴木    24
----
----rows superman
高橋    36  5
----
-----
------
```


　データとその構造をテキストとプログラムの間で相互変換する。


