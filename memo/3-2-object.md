# Object(KeyValue)

```
obj key1 value1 key2 value2
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



