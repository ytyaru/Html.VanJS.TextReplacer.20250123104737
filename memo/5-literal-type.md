# リテラル型

　リテラル値のテキスト表現形式によって、型を判別する方法を定める。

　そもそもtextbaseはプリミティブ型のみを扱うものとする。即ち文字列を基本とし、場合によっては整数や真偽値も扱えると嬉しい。

型|例
--|--
`string`|`全値`
`int`|`0`
`bool`|`v`,`_`
`bigint`|`0n`
`float`|`0`

　限定的に利用可能にする予定の値は以下。

リテラル表記|JSリテラル表記
------------|--------------
`Infinity`|`Infinity`,`∞`
`-Infinity`|`-Infinity`,`-∞`
`MAX`|`Number.MAX_SAFE_INTEGER`|
`MIN`|`Number.MIN_SAFE_INTEGER`|

　尚、次の値はtextbaseでは使用禁止である。

禁止型|理由
------|----
Symbol|JS内部で利用する型でありテキストデータの用途に不一致。
Object|テキストデータの用途に不一致。文字列から変換するにしてもtextbaseの仕事としてはstring型で十分。`Date`,`URL`,`RegExp`等も同様

禁止値|理由
------|----
`null`|テキストデータの用途に不一致。プリミティブのみ有効。NULL安全にしたい。
`undefined`|テキストデータの用途に不一致。そもそも例外発生させるべき場面でありJSの言語欠陥。
`NaN`|テキストデータの用途に不一致。そもそも例外発生させるべき場面でありJSの言語欠陥。
`Number.MAX_VALUE`|`Number.MAX_SAFE_INTEGER`より大きいと誤差が生じる。論外でありJSの言語欠陥。
`Number.MIN_VALUE`|`Number.MIN_SAFE_INTEGER`より小さいと誤差が生じる。論外でありJSの言語欠陥。

　リテラル値から型を推論する。

リテラル値|使用する型
----------|----------
`0`|`int`,`float`,`string`
`_`|`bool`,`string`
`v`|`bool`,`string`
`0n`|`bigint`,`string`
`.0`,`0.0`|`float`,`string`
`他`|`string`

　基本的には「使用する型」の最初の型であると判断する。
