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
`enum`|`{key:{name:'', value:'', text:''}}`, `[{key:'', name:'', value:0, text:''},...]`
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


# 型

* 値の型
* 表記の型


　コレクション型は値の型を定義できる。

```
obj.human(name:str='山田',age:int=12)
cols.human(name:str='', age:int=0)
```

### Boolean(bln,b)

　真偽値を示す文字を定義する。


偽|真|補足
--|--|----
`0`|`1`|C言語において真偽値は整数`0`,`1`で表す。その慣例を踏襲した。
`_`|`v`|英語圏において真偽はチェックマーク✔と空欄で表現する。これをASCIIの英字で代用した。
`x`|`o`|日本語圏において真偽は⭕❌で表現する。これをASCIIの英字で代用した。海外では`x`が真を表す場合もあるため国際的標準でない。
`F`|`T`|C言語における真偽値`False`と`True`の頭文字である。

記号|長所|短所
----|----|----
`01`|プログラマにとって明瞭|整数型との見分けが付きにくい
`_v`|✔に類似しており視覚的に判りやすくキーボード入力も容易|このような慣例や習慣がない
`xo`|⭕❌に類似しており日本人の視覚的に判りやすくキーボード入力も容易|このような慣例や習慣がないし、国際標準でない。
`FT`|プログラマにとって察しがつく|このような慣例や習慣がない

```
b01 = {_: 0, v: 1}
b_v = ['_', 'v']
bxo = ['x', 'o']
bFT = ['F', 'T']
```

　以下のような記述で定義する。最初の要素がデフォルトになる。尚、使える文字は真偽各一字の`_a-zA-Z0-9`のみ。将来の拡張に備えて減らす。少なくとも`()`,`,`は使えない。以下のようにメタ文字だから。もし使うなら`\c`,`\(`,`\)`となる。

```
b(01,xo,_v,FT)
bln(01,xo,_v,FT)
boolean(01,xo,_v,FT)
```

　偽は`0`,`_`,`x`であり、真は`v`は`1`,`v`,`o`で表す。

```
table(isA:b01) 0 1 1 0
table(isA:b_v) _ v v _
table(isA:bxo) x o o x
table(isA:bFT) F T T F
```

　初期値は偽`false`である。空値なら初期値の偽であると判断する。初期値は`名:型=初期値`のようにセットする。以下のように略記できる。

```
bln(01,xo,_v)
table(isA:b01=0)   1 1  
table(isA:bxo=x)   o o  
table(isA:b_v=_)   v v  
table(isA:bFT=F)   v v  
```

　Boolean型の初期値は偽`false`である。わざわざ指定する必要はないため以下のように略せる。

```
bln(01,xo,_v)
table(isA:b01)   1 1  
table(isA:bxo)   o o  
table(isA:b_v)   v v  
table(isA:bFT)   T T  
```

　もし真を初期値にしたいときは次のようにセットする。

```
bln(01,xo,_v)
table(isA:b01=1) 0     0
table(isA:bxo=o) x     x
table(isA:b_v=v) _     _
table(isA:bFT=T) F     F
```

### Flags(Booleans,blns,bs)

　真偽値の配列をまとめて扱うフラグス型は以下のように定義する。

```
flags.filePermission(readable,writable,executable)
```

　表示テキストを任意に変更したい場合は`偽真`の順に一字ずつ渡す。省略されたら真偽値の標準である`01`,`_v`を用いる。

```
flags.filePermission(readable=-r,writable=-w,executable=-x)
```

　ちなみに初期値は`0`である。だが範囲内の値を初期値としてセットできる。以下は初期値に`1`をセットした。

```
flags.filePermission(readable=-r,writable=-w,executable=-x) 1
```

　尚、エンディアン（バイトオーダー）はビッグエンディアンである。即ち左から右へビット配列が並んでいるものとする。これは`(readable,...)`の順と同じように並んでいる想定だ。よって十進数の値`1`を初期値とした時、二進数の`0b001`のことであり、`executable`だけが真である状態を表している。

名|偽|真
--|--|--
`readable`|`-`|`r`
`writable`|`-`|`w`
`executable`|`-`|`x`

　JSデータで表現すると以下のようになる。ポイントは`value`。二進数値として加算したとき重ならない値にする。

```
flags.filePermission = {
  readable: {value:1, textF:'-', textT:'r'},
  writable: {value:2, textF:'-', textT:'w'},
  executable: {value:4, textF:'-', textT:'x'},
}
```
```
flags.filePermission = {
  readable: {value:1, text:['-','r']},
  writable: {value:2, text:['-','w']},
  executable: {value:4, text:['-','x']},
}
```
```
table(name:str,p:flags.filePermission) a.txt --- b.txt rwx c.txt r-- d.txt -w- e.txt --x
table(name:str,p:flags.filePermission) a.txt 0b000 b.txt 0b111 c.txt 0b100 d.txt 0b010 e.txt 0b001
table(name:str,p:flags.filePermission) a.txt 0 b.txt 7 c.txt 1 d.txt 3 e.txt 4
```

　状態パターンは次の通り。

10|2|rwx
--|-|---
`0`|`0b000`|`---`
`1`|`0b001`|`--x`
`2`|`0b010`|`-w-`
`4`|`0b100`|`r--`

　複数組み合わせると次のパターンができる。二進数でも十進数でも`rwx`でも全パターン表現可能。`2^要素数`=`2^3`=`8`通りの状態ができる。

10|2|rwx
--|-|---
`3`|`0b011`|`-wx`
`5`|`0b101`|`r-x`
`6`|`0b110`|`rw-`
`7`|`0b111`|`rwx`

　最小字数で済むのが十進数表記である。ただし判り易さは二進数や`rwx`のほうが上。定義の手間やプレフィクスの面倒さを鑑みて、どの表記で入力するか自由に決定できる。

　基本的には自由形式であり、値の書式が`0b[0-9]+`なら十進数値として判断する。`[0-9]+`なら十進数、それ以外なら自作と判断する。ただし自作だが`0〜3`までの数で表記する場合もあり、その値が定義により十進数値のそれと異なる場合もありうる。

　そこで入力できる形式を、未定義(自動判定)、自作形式、二進数、十進数のいずれかに強制固定する方法を用意する。すなわち以下である。

```
table.name(name:str,p:flags.filePermission) a.txt --- b.txt rwx c.txt r-- d.txt -w- e.txt --x
table.name(name:str,p:flags.filePermission:) a.txt --- b.txt rwx c.txt r-- d.txt -w- e.txt --x
table.name(name:str,p:flags.filePermission:b) a.txt 0b000 b.txt 0b111 c.txt 0b100 d.txt 0b010 e.txt 0b001
table.name(name:str,p:flags.filePermission:d) a.txt 0 b.txt 7 c.txt 1 d.txt 3 e.txt 4
```

　`列名.型名.型固名`(`p:flags.filePermission`)の後ろに`:`がなければ未定義(自動判定)であり、`:`が付くと自作形式であり、`:b`は二進数、`:d`は十進数である。

　ちなみに`b`や`d`は以下の頭文字である。

英語|日本語
----|------
binary number|二進数
digit number|十進数

　`b`と`d`は紛らわしいので以下のように数値で表現することも許可したほうがいいかもしれない。すると`10`は2文字必要になってしまうが。

```
table.name(name:str,p:flags.filePermission) a.txt --- b.txt rwx c.txt r-- d.txt -w- e.txt --x
table.name(name:str,p:flags.filePermission:) a.txt --- b.txt rwx c.txt r-- d.txt -w- e.txt --x
table.name(name:str,p:flags.filePermission:b) a.txt 0b000 b.txt 0b111 c.txt 0b100 d.txt 0b010 e.txt 0b001
table.name(name:str,p:flags.filePermission:d) a.txt 0 b.txt 7 c.txt 1 d.txt 3 e.txt 4
table.name(name:str,p:flags.filePermission:2) a.txt 0b000 b.txt 0b111 c.txt 0b100 d.txt 0b010 e.txt 0b001
table.name(name:str,p:flags.filePermission:10) a.txt 0 b.txt 7 c.txt 1 d.txt 3 e.txt 4
```

　初期値もセットしてみる。

```
table.name(name:str,p:flags.filePermission=---) a.txt  b.txt rwx c.txt r-- d.txt -w- e.txt --x
table.name(name:str,p:flags.filePermission:=---) a.txt --- b.txt rwx c.txt r-- d.txt -w- e.txt --x
table.name(name:str,p:flags.filePermission:b=0b000) a.txt  b.txt 0b111 c.txt 0b100 d.txt 0b010 e.txt 0b001
table.name(name:str,p:flags.filePermission:d=0) a.txt   b.txt 7 c.txt 1 d.txt 3 e.txt 4
table.name(name:str,p:flags.filePermission:2) a.txt  b.txt 0b111 c.txt 0b100 d.txt 0b010 e.txt 0b001
table.name(name:str,p:flags.filePermission:10) a.txt   b.txt 7 c.txt 1 d.txt 3 e.txt 4
```




### Enum(Enumerate,enum,e)

```
enum.fileOpenMode(read,write,append,readP,writeP,appendP)
```
```
enum.fileOpenMode(r:read,w:write,a:append,R:readP,W:writeP,A:appendP)
```
```
enum.fileOpenMode(n:none=0,r:read=1,w:write=2,a:append=3,R:readP=4,W:writeP=5,A:appendP=6)
```
```
enum.fileOpenMode:i16(n:none,r:read,w:write,a:append,R:readP,W:writeP,A:appendP)
enum.fileOpenMode:i32(n:none,r:read,w:write,a:append,R:readP,W:writeP,A:appendP)
enum.fileOpenMode:i36(n:none,r:read,w:write,a:append,R:readP,W:writeP,A:appendP)
enum.fileOpenMode:i64(n:none,r:read,w:write,a:append,R:readP,W:writeP,A:appendP)
```
```
table(enum.fileOpenMode) n r w a R W A
table(enum.fileOpenMode) 0 1 2 3 4 5 6
```




# Escape


字|`\同`|`\A`|`\uH`
--|-----|----|-----
(改行)|`\(改行)`|`\n`|`\uA`
`	`|`\	`|`\t`|`\u9`
`,`|`\,`|`\c`|`\u2C`
` `|`\ `|`\b`|`\u20`
`\`|`\\`|``|`\u5C`

　`字`をそのまま書く。改行はそのままだと改行されてしまうため便宜上`(改行)`と表記した。

　`\同`は字をそのまま書いたものの直前にバックスラッシュ`\`を置いてエスケープするもの。覚えやすいが、改行やタブは見た目が変わってしまう難点がある。今回のように改行はそのまま表記するとMarkdownとして成立しなくなってしまうため使えない。こうした自体を回避するには他の文字を使って代替表現する必要がある。それが後述した方法である。

　`\A`はバックスラッシュ`\`の後にASCII文字のアルファベット一文字を使って代替表現したものである。改行は`\n`であり、タブは`\t`。それぞれ`Newline`, `Tab`の頭文字を使っている。残念ながらアルファベットの字種が少なすぎて全記号を代替表現するのは難しい。

字|`\uH`|`\A`|補足
--|-----|----|----
` `|20|`\b`|`Blank`, `word Break`
`!`|21|`\e`|`Exclamation mark`
`"`|22|`\Q`|`Double Quotation mark`
`#`|23|`\h`|`Number sign`,`has`,`pound sign`,`井桁(イゲタ)`（♯シャープ（音楽記号）とは別物）
`$`|24|`\D`|`dollar sign`
`%`|25|`\p`|`percent`
`&`|26|`\a`|`ampersand`(アンパサンド)
`'`|27|`\a`,`\q`|`apostrophe`, `Single Quotation mark`
`(`|28|`\b`|`Bracket`,`parentheses`,`round brackets` 開始丸括弧
`)`|29|`\B`|`Bracket`,`parentheses`,`round brackets` 終了丸括弧
`*`|2a|`\A`|`asterisk` (アスタリスク)
`+`|2b|`\p`|`plus`
`,`|2c|`\c`|`comma`
`-`|2d|`\h`|`hyphen`,`minus`
`.`|2e|`\p`|`period`,`full stop`,`dot`
`/`|2f|`\s`|`slash`
`:`|3a|`\c`|`colon`
`;`|3b|`\s`|`Semi colon`
`<`|3c|`\l`|`Less than`, `Angle brackets`, `chevrons`
`=`|3d|`\e`|`Equal`
`>`|3e|`\g`|`Greater than`, `Angle brackets`, `chevrons`
`?`|3f|`\Q`|`Question mark`
`@`|40|`\a`|`At mark`
`[`|5b|`\s`|`Square brackets`,`brackets`
`\`|5c|`\B`|`Back Slash`
`]`|5d|`\S`|`Square brackets`,`brackets`
`^`|5e|`\s`|`circumflex`(サーカムフレックス), キャレット, ハット記号　　（じつはキャレット記号は`‸`である）
`_`|5f|`\u`|`underscore`,`under score`,`underline`,`underbar`,`low line`
`` ` ``|60|`\g`|`Grave accent` グレイヴ・アクセント,抑音符, バッククォート`Back Quote`, `backtick`
`{`|7b|`\b`|`Braces`,`curly brackets`
`|`|7c|`\v`|`Vertical bar`, `Vertical line`, `Pipe`, `PipeLine`
`}`|7d|`\B`|`Braces`,`curly brackets`
`~`|7e|`\T`|`tilde`(チルダ)

　ご覧の通り、`\A`は重複が大量発生している。

　少なくとも見た目が崩れる文字に関しては`\A`形式を作っておきたい。つまり以下。

字|`\A`
--|----
`(改行)`|`\n`(`Newline`)
`	`|`\t`(`Tab`)
` `|`\b`(word Break), `\s`(Space)

　デリミタ(区切文字)のカンマにも`\A`形式があれば、改行,タブ,スペースと切り替える時に視認しやすいし、メタ文字との区別もできて便利そう。ただ、`\A`のアルファベットが重複する場合も考慮して`\同`形式も用意しておく。ついでに絶対重複しないUnicodeの16進数値`\u2C`も。

字|`\同`|`\A`|`\u`
--|-----|----|----
`,`|`\,`|`\c`|`\u2C`

　セミコロン`;`もデリミタの一種だが、`\s`とするとスペースと誤解しそう。利用頻度も低そうなので`\;`とそのままにしたほうが良いか。

　`\`自身のエスケープも必要になる。

字|`\A`
--|----
`\`|`\\`

　頻繁に使う記号に関しても代替記法が欲しい。ただし英字で表記すると解読困難になりそう。かと言ってメタ文字として使われている中で`(\(\))`となっても紛らわしい。もう諦めるしかないか。

`,`
`(`
`)`
`[`
`]`
`<`
`>`
`=`
`:`

`+`
`-`
`*`
`/`

`&`
`|`

`!`
`?`

`"`
`'`
`` ` ``

`_`
`#`
`$`

