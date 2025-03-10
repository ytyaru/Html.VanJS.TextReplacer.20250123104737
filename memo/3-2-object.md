# Object(KeyValue)

# 表記パターン網羅

　どれが最善か。判断基準は短く書けること。シンプルであること。実装も楽であること。

```
obj key1 value1 key2 value2
```
```
obj name yamada age 12
```
```
obj(name,age) Yamada 12
```
```
obj(name:str=Yamada,age:int=12)
```
```
obj(name:str,age:int) Yamada 12
```
```
obj(str,int) yamada 12 suzuki 24
```
```
obj(str=yamada,int=12)   suzuki 24
```
```
obj(=yamada,=12)   suzuki 24
```
```
obj.yamada name Yamada age 12
obj.suzuki name Suzuki age 24
```
```
obj name yamada age:int 12
```
```
obj name:str yamada age:int 12
```
```
obj name:str yamada age:flt 12
```
```
obj name:str=yamada age:flt=12
```
```
obj name:str=yamada,age:flt=12
```
```
obj.yamada name:str=yamada,age:flt=12
```
```
obj.yamada name=yamada,age:flt=12
```
```
obj.yamada name yamada age:flt 12
```

　以下の書式がベストか。配列型と基本的には同じで、位置によってキーか値かが決まる。型は名前の直後に`:型`で任意に付加できる。

```
obj 名 値 名 値 ...
```
```
obj 名:型 値 名:型 値 ...
```

　型は省くことができる。未指定なら値から推測する。

```
obj.tarou name Tarou isMale v age 12 weight 65.0 height 175.5
obj.hanako name Hanako isMale _ age 24 weight 52.0 height 158.3
```

　もしリテラル値で型を判断できれば、型の定義は不要である。

```
obj.yamada name Yamada age 12
obj.suzuki name Suzuki age 24
```

　だが、他の型でも使う値の場合、リテラル値だけでは型を特定できない。

リテラル値|使用する型
----------|----------
`0`|`int`,`float`,`string`
`_`|`bool`,`string`
`v`|`bool`,`string`

　上記リテラル値が使用された場合、優先度は「使用する型」で示した順である。たとえば`ary 0 1 2`の場合、`0`のような数字だけで構成されていれば`int`と判断する。ただし、ここで`float`や`string`型にしたい場合も考えられる。`float`なら`ary .0 1.0 2.0`と書けば良いのだが、この場合は小数点以下が冗長になる。そこで型指定して`ary:flt 0 1 2`と短く記述できるようにしたい。`string`型に至っては型指定する必要がある。`ary:str 0 1 2`とすることで`int`ではなく`string`型として読み込める。

```javascript
const obj = textbase.read('obj key value')
// {key:'value'}
```
```javascript
const obj = textbase.read('obj name yamada age 12')
// {name:yamada, age:12}
```
```
obj.yamada name yamada age 12
// {yamada:{name:yamada, age:12}}
```
```javascript
const obj = textbase.read('obj.yamada name yamada age 12')
// {yamada:{
//   name:yamada
//   age:12,
// }}
```
```javascript
const db = textbase.read('obj.yamada name yamada age 12')
db.obj.yamada
// {name:yamada, age:12}
```
```javascript
const db = textbase.read(`obj.yamada name yamada age 12
ary.names yamada suzuki tanaka`)
db.ary.names // [yamada','suzuki','tanaka']
db.obj.yamada // {name:yamada, age:12}
```






　以下は間違い。テーブル型である。

```
obj.human(str,int) yamada 12 suzuki 24
```
```javascript
const obj = textbase.read('obj.human(str,int) yamada 12 suzuki 24')
// {human:{
//   yamada:12,
//   suzuki:24,
// }}
```
```javascript
const db = textbase.read('obj.human(str,int) yamada 12 suzuki 24')
db.obj.human
// {yamada:12, suzuki:24}
```
```javascript
const db = textbase.read(`obj.human(str,int) yamada 12 suzuki 24
ary.names yamada suzuki tanaka`)
db.ary.names // [yamada','suzuki','tanaka']
db.obj.human // {yamada:12, suzuki:24}
```

