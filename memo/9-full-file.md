# All pattern

　単一行と複数行、ary/obj/tbl、全6パターンの表記例。

```
ary.names1 Yamada Suzuki Tanaka
---ary.names2
Yamada
Suzuki
Tanaka
---
---ary.names3
Yamada Suzuki
Tanaka
---
---ary.names4
Yamada Suzuki
Tanaka
---ary.names5
Yamada Suzuki
Tanaka
---ary.names6
Yamada Suzuki
Tanaka
---
obj.yamada1 id 0 name Yamada age 12
---obj.yamada2
id	0	name	Yamada
age	12
---obj.yamada3
id	0	name	Yamada
age	12
---
tbl.humans1(id:i,name:s,age:i) 0 Yamada 12 1 Suzuki 24 2 Tanaka 36
---tbl.humans2
id	name	age
0	Yamada	12
1	Suzuki	24
2	Tanaka	36
---tbl.humans3
id	name	age
:i	s	i
0	Yamada	12
1	Suzuki	24
2	Tanaka	36
---tbl.humans4
id	name	age
=0	Yamada	12
		
1	Suzuki	24
2	Tanaka	36
---tbl.humans5
id	name	age
:i	s	i
=0	Yamada	12
		
1	Suzuki	24
2	Tanaka	36
---tbl.humans6
id	name	age
:i	s	i
=0	Suzuki	36
	Yamada	12
1		24
2	Tanaka	
---
```

## 複数行

　複数行で表記する場合はフェンスを記述する。

```
---
---
```

　フェンスは開始と終了があり、同じ記号を三つ以上連続したものである。開始と終了の間にあるテキストがそのフェンスの内容となる。

```
---ヘッダ
内容
---
```

　フェンスのヘッダには、その内容を解釈する引数を指定する。`ary`,`obj`,`tbl`がそれだ。

```
---ary
one
two
three
---
```

　フェンス内では改行コードがデリミタの一つになる。ただしデータ型によっては他の字もデリミタになり、複数存在する場合もある。

　たとえば以下のように、`ary`のヘッダに`%b`と書けば半角スペースもデリミタになる。

```
---ary.numbers \b
one two
three
---
```

　追加デリミタとして指定できるのは`\b`,`\c`,`\s`のみ。

指定子|表記字|名前
------|------|----
`\b`|` `|半角スペース
`\c`|`,`|半角カンマ
`\s`|`;`|半角セミコロン

　もしデリミタを追加指定しなければ、半角スペース、カンマ、セミコロンなど改行コード以外はすべて文字列データになる。

```
---ary
My name is Andy.
A,B, and C.
A;B;C;
---
```
```
[
  'My name is Andy.',
  'A,B, and C.',
  'A;B;C;',
]
```

　もし文字列データに改行コードを含めたければ`\\n`エスケープする。

```
---ary
first line\\nsecond line.
third line\\nfourth line.
---
```
```
[
  'first line\nsecond line',
  'third line\nfourth line.',
]
```

