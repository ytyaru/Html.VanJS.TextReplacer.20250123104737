# Table(columns, rows)

# 表記パターン

```
tbl(name,age) yamada 12 suzuki 24
```
```
tbl(name:str,age:int) yamada 12 suzuki 24
```
```
tbl(name:str=yamada,age:int=12)   suzuki 24
```
```
tbl.humans(name:str=nanashi,age:int=5)   suzuki 24
```

　返される値は以下。

```
[
  {name:'yamada', age:12},
  {name:'suzuki', age:24},
]
```
