# Object(KeyValue)

```
obj key1 value1 key2 value2
```
```
obj name yamada age 12
```
```
obj(name:str=Yamada,age:int=12)
```
```
obj(name:str,age:int) Yamada 12
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

　上記リテラル値が使用された場合、優先度は「使用する型」で示した順である。たとえば`ary 0 1 2`の場合、`0`のような数字だけで構成されていれば`int`と判断する。ただし、ここで`float`や`string`型にしたい場合も考えられる。`float`なら`ary .0 1.0 2.0`と書けば良いのだが、この場合は小数点以下が冗長になる。そこで型指定して`ary:flt 0 1 2`と記述できるようにしたい。`string`型に至っては型指定する必要がある。`ary:str 0 1 2`とすることで`int`ではなく`string`型として読み込める。


```javascript
const obj = textbase.read('obj key value')
// {key:'value'}
```
```javascript
const obj = textbase.read('obj(str,int) yamada 12 suzuki 24')
// {yamada:12, suzuki:24}
```
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



