window.addEventListener('DOMContentLoaded', (event) => {
    const a = new Assertion();
    const t = new Textbase();
    // 不正な引数を渡すとundefinedを返す（未実装）
    for (let arg of [undefined, null, NaN, '', 'ary', 'ary ', 'a', 'a ']) {
        a.t(()=>{
            const vals = t.deserialize(arg)
            console.log(vals)
            return undefined===vals
        })
    }
    //--------------------------------------
    // 正常系（デリミタ＝スペース）
    //--------------------------------------
    a.t(()=>{
        const strs = t.deserialize('ary A B C')
        return 3===strs.length && Type.isStrs(strs) && 'A'===strs[0] && 'B'===strs[1] && 'C'===strs[2]
    })
    a.t(()=>{
        const vals = t.deserialize('ary 2 4 6')
        return 3===vals.length && Type.isInts(vals) && 2===vals[0] && 4===vals[1] && 6===vals[2]
    })
    a.t(()=>{
        const vals = t.deserialize('ary .1 0.2 1.1 2.2 3.3')
        return 5===vals.length && Type.isFlts(vals) && 0.1===vals[0] && 0.2===vals[1] && 1.1===vals[2] && 2.2===vals[3] && 3.3===vals[4]
    })
    a.t(()=>{
        const vals = t.deserialize('ary 0b00 0b01 0b10 0b11')
        console.log(vals)
        return 4===vals.length && Type.isInts(vals) && 0===vals[0] && 1===vals[1] && 2===vals[2] && 3===vals[3]
    })
    a.t(()=>{
        const vals = t.deserialize('ary 0o00 0o77 0o10')
        console.log(vals)
        return 3===vals.length && Type.isInts(vals) && 0===vals[0] && 63===vals[1] && 8===vals[2]
    })
    a.t(()=>{
        const vals = t.deserialize('ary 0x00 0xFF 0x10')
        console.log(vals)
        return 3===vals.length && Type.isInts(vals) && 0===vals[0] && 255===vals[1] && 16===vals[2]
    })
    a.t(()=>{
        const vals = t.deserialize('ary 0z00 0zZZ 0z10')
        console.log(vals)
        return 3===vals.length && Type.isInts(vals) && 0===vals[0] && 1295===vals[1] && 36===vals[2]
    })
    a.t(()=>{
        const vals = t.deserialize('ary _ v v _')
        return 4===vals.length && Type.isBlns(vals) && false===vals[0] && true===vals[1] && true===vals[2] && false===vals[3]
    })
    a.t(()=>{
        const vals = t.deserialize('ary  v v ') // false略記
        console.log(vals)
        return 4===vals.length && Type.isBlns(vals) && false===vals[0] && true===vals[1] && true===vals[2] && false===vals[3]
    })
    a.t(()=>{
        const vals = t.deserialize('ary  v v _ _ _') // 末尾 false 3 連続
        console.log(vals)
        return 6===vals.length && Type.isBlns(vals) && false===vals[0] && true===vals[1] && true===vals[2] && false===vals[3] && false===vals[4] && false===vals[5]
    })
    a.t(()=>{
        const vals = t.deserialize('ary  v v  _ ') // 末尾 false 3 連続(最初と最後は空文字で略記した)
        console.log(vals)
        return 6===vals.length && Type.isBlns(vals) && false===vals[0] && true===vals[1] && true===vals[2] && false===vals[3] && false===vals[4] && false===vals[5]
    })
    a.t(()=>{
        const vals = t.deserialize('ary  v v   ') // 末尾 false 3 連続(3つ共全部略記した)
        console.log(vals)
        return 6===vals.length && Type.isBlns(vals) && false===vals[0] && true===vals[1] && true===vals[2] && false===vals[3] && false===vals[4] && false===vals[5]
    })
    // BigInt型付リテラル（ary:I 2 4 6）と書いたほうが短くなるので微妙な気がする。ただObject等一要素毎に型が違う場合は有効か。
    // 配列型でのBigInt型付リテラルについては有効性が低いため、いずれ削除すべき機能になるかもしれない。
    // ただしObject型など他の型での有効性はあるかもしれないため、参考にすべく実装は残しておく。
    a.t(()=>{
        const vals = t.deserialize('ary 2n 4n 6n')
        return 3===vals.length && Type.isBigInts(vals) && 2n===vals[0] && 4n===vals[1] && 6n===vals[2]
    })
    a.t(()=>{
        const vals = t.deserialize('ary 0B00 0B01 0B10 0B11')
        console.log(vals)
        return 4===vals.length && Type.isBigInts(vals) && 0n===vals[0] && 1n===vals[1] && 2n===vals[2] && 3n===vals[3]
    })
    a.t(()=>{
        const vals = t.deserialize('ary 0O00 0O77 0O10')
        console.log(vals)
        return 3===vals.length && Type.isBigInts(vals) && 0n===vals[0] && 63n===vals[1] && 8n===vals[2]
    })
    a.t(()=>{
        const vals = t.deserialize('ary 0X00 0XFF 0X10')
        console.log(vals)
        return 3===vals.length && Type.isBigInts(vals) && 0n===vals[0] && 255n===vals[1] && 16n===vals[2]
    })

    // 文字列型
    a.t(()=>{// 値を省略したらデフォルト値になる（文字列型のデフォルト値は空文字）
        const strs = t.deserialize('ary   ')
        console.log(strs)
        return 3===strs.length && Type.isStrs(strs) && ''===strs[0] && ''===strs[1] && ''===strs[2]
    })
    a.t(()=>{// 型を指定する
        const strs = t.deserialize('ary:str A B C')
        return 3===strs.length && Type.isStrs(strs) && 'A'===strs[0] && 'B'===strs[1] && 'C'===strs[2]
    })
    a.t(()=>{// 値を省略したらデフォルト値になる（文字列型のデフォルト値は空文字）
        const strs = t.deserialize('ary:str   ')
        console.log(strs)
        return 3===strs.length && Type.isStrs(strs) && ''===strs[0] && ''===strs[1] && ''===strs[2]
    })
    a.t(()=>{// 型とデフォルト値を任意に設定する
        const strs = t.deserialize('ary:str=x   ')
        console.log(strs)
        return 3===strs.length && Type.isStrs(strs) && 'x'===strs[0] && 'x'===strs[1] && 'x'===strs[2]
    })
    // 整数型
    a.t(()=>{// 型を指定し値を省略したらデフォルト値になる（整数型のデフォルト値は0）
        const vals = t.deserialize('ary:int   ')
        console.log(vals)
        return 3===vals.length && Type.isInts(vals) && 0===vals[0] && 0===vals[1] && 0===vals[2]
    })
    a.t(()=>{// 型を指定する
        const vals = t.deserialize('ary:int 2 4 6')
        return 3===vals.length && Type.isInts(vals) && 2===vals[0] && 4===vals[1] && 6===vals[2]
    })
    a.t(()=>{// 型を指定し値を省略したらデフォルト値になる（整数型のデフォルト値は0）
        const vals = t.deserialize('ary:int  1 2')
        return 3===vals .length && Type.isInts(vals) && 0===vals[0] && 1===vals[1] && 2===vals[2]
    })
    a.t(()=>{// 型とデフォルト値を任意に設定する
        const vals = t.deserialize('ary:int=9   ')
        return 3===vals.length && Type.isInts(vals) && 9===vals[0] && 9===vals[1] && 9===vals[2]
    })
    // 真偽型
    a.t(()=>{// 型を指定し値を省略したらデフォルト値になる（真偽型のデフォルト値はfalse）
        const vals = t.deserialize('ary:bln   ')
        console.log(vals)
        return 3===vals.length && Type.isBlns(vals) && false===vals[0] && false===vals[1] && false===vals[2]
    })
    a.t(()=>{// 型を指定する
        const vals = t.deserialize('ary:bln v _ v')
        return 3===vals.length && Type.isBlns(vals) && true===vals[0] && false===vals[1] && true===vals[2]
    })
    a.t(()=>{// 型を指定し値を省略したらデフォルト値になる（真偽型のデフォルト値はfalse）
        const vals = t.deserialize('ary:bln  v ')
        return 3===vals .length && Type.isBlns(vals) && false===vals[0] && true===vals[1] && false===vals[2]
    })
    a.t(()=>{// 型とデフォルト値を任意に設定する
        const vals = t.deserialize('ary:bln=v   ')
        return 3===vals.length && Type.isBlns(vals) && true===vals[0] && true===vals[1] && true===vals[2]
    })
    // 浮動小数点数型
    a.t(()=>{// 型を指定し値を省略したらデフォルト値になる（浮動小数点数型のデフォルト値は0）
        const vals = t.deserialize('ary:flt   ')
        console.log(vals)
        return 3===vals.length && Type.isFlts(vals) && 0===vals[0] && 0===vals[1] && 0===vals[2]
    })
    a.t(()=>{// 型を指定する
        const vals = t.deserialize('ary:flt .3 0.2 0.1')
        return 3===vals.length && Type.isFlts(vals) && 0.3===vals[0] && 0.2===vals[1] && 0.1===vals[2]
    })
    a.t(()=>{// 型を指定し値を省略したらデフォルト値になる（浮動小数点数型のデフォルト値は0）
        const vals = t.deserialize('ary:flt  .1 .2')
        return 3===vals .length && Type.isFlts(vals) && 0===vals[0] && 0.1===vals[1] && 0.2===vals[2]
    })
    a.t(()=>{// 型とデフォルト値を任意に設定する
        const vals = t.deserialize('ary:flt=.9   ')
        return 3===vals.length && Type.isFlts(vals) && 0.9===vals[0] && 0.9===vals[1] && 0.9===vals[2]
    })
    // 長整数型
    a.t(()=>{// 型を指定し値を省略したらデフォルト値になる（長整数型のデフォルト値は0n）
        const vals = t.deserialize('ary:I   ')
        return 3===vals.length && Type.isBigInts(vals) && 0n===vals[0] && 0n===vals[1] && 0n===vals[2]
    })
    a.t(()=>{// 型を指定する
        const vals = t.deserialize('ary:I 2 4 6')
        return 3===vals.length && Type.isBigInts(vals) && 2n===vals[0] && 4n===vals[1] && 6n===vals[2]
    })
    a.t(()=>{// 型を指定し値を省略したらデフォルト値になる（長整数型のデフォルト値は0n）
        const vals = t.deserialize('ary:I  1 2')
        return 3===vals .length && Type.isBigInts(vals) && 0n===vals[0] && 1n===vals[1] && 2n===vals[2]
    })
    a.t(()=>{// 型とデフォルト値を任意に設定する
        const vals = t.deserialize('ary:I=9   ')
        console.log(vals)
        return 3===vals.length && Type.isBigInts(vals) && 9n===vals[0] && 9n===vals[1] && 9n===vals[2]
    })


    //--------------------------------------
    // 正常系（デリミタ＝カンマ）
    //--------------------------------------
    a.t(()=>{
        const strs = t.deserialize('ary A,B,C')
        return 3===strs.length && Type.isStrs(strs) && 'A'===strs[0] && 'B'===strs[1] && 'C'===strs[2]
    })
    a.t(()=>{
        const vals = t.deserialize('ary 2,4,6')
        return 3===vals.length && Type.isInts(vals) && 2===vals[0] && 4===vals[1] && 6===vals[2]
    })
    a.t(()=>{
        const vals = t.deserialize('ary .1,0.2,1.1,2.2,3.3')
        return 5===vals.length && Type.isFlts(vals) && 0.1===vals[0] && 0.2===vals[1] && 1.1===vals[2] && 2.2===vals[3] && 3.3===vals[4]
    })
    a.t(()=>{
        const vals = t.deserialize('ary 0b00,0b01,0b10,0b11')
        console.log(vals)
        return 4===vals.length && Type.isInts(vals) && 0===vals[0] && 1===vals[1] && 2===vals[2] && 3===vals[3]
    })
    a.t(()=>{
        const vals = t.deserialize('ary 0o00,0o77,0o10')
        console.log(vals)
        return 3===vals.length && Type.isInts(vals) && 0===vals[0] && 63===vals[1] && 8===vals[2]
    })
    a.t(()=>{
        const vals = t.deserialize('ary 0x00,0xFF,0x10')
        console.log(vals)
        return 3===vals.length && Type.isInts(vals) && 0===vals[0] && 255===vals[1] && 16===vals[2]
    })
    a.t(()=>{
        const vals = t.deserialize('ary 0z00,0zZZ,0z10')
        console.log(vals)
        return 3===vals.length && Type.isInts(vals) && 0===vals[0] && 1295===vals[1] && 36===vals[2]
    })
    a.t(()=>{
        const vals = t.deserialize('ary _,v,v,_')
        return 4===vals.length && Type.isBlns(vals) && false===vals[0] && true===vals[1] && true===vals[2] && false===vals[3]
    })
    a.t(()=>{
        const vals = t.deserialize('ary ,v,v,') // false略記
        console.log(vals)
        return 4===vals.length && Type.isBlns(vals) && false===vals[0] && true===vals[1] && true===vals[2] && false===vals[3]
    })
    a.t(()=>{
        const vals = t.deserialize('ary ,v,v,_,_,_') // 末尾 false 3 連続
        console.log(vals)
        return 6===vals.length && Type.isBlns(vals) && false===vals[0] && true===vals[1] && true===vals[2] && false===vals[3] && false===vals[4] && false===vals[5]
    })
    a.t(()=>{
        const vals = t.deserialize('ary ,v,v,,_,') // 末尾 false 3 連続(最初と最後は空文字で略記した)
        console.log(vals)
        return 6===vals.length && Type.isBlns(vals) && false===vals[0] && true===vals[1] && true===vals[2] && false===vals[3] && false===vals[4] && false===vals[5]
    })
    a.t(()=>{
        const vals = t.deserialize('ary ,v,v,,,') // 末尾 false 3 連続(3つ共全部略記した)
        console.log(vals)
        return 6===vals.length && Type.isBlns(vals) && false===vals[0] && true===vals[1] && true===vals[2] && false===vals[3] && false===vals[4] && false===vals[5]
    })

    // 文字列型
    a.t(()=>{// 値を省略したらデフォルト値になる（文字列型のデフォルト値は空文字）
        const strs = t.deserialize('ary ,,')
        console.log(strs)
        return 3===strs.length && Type.isStrs(strs) && ''===strs[0] && ''===strs[1] && ''===strs[2]
    })
    a.t(()=>{// 型を指定する
        const strs = t.deserialize('ary:str A,B,C')
        return 3===strs.length && Type.isStrs(strs) && 'A'===strs[0] && 'B'===strs[1] && 'C'===strs[2]
    })
    a.t(()=>{// 値を省略したらデフォルト値になる（文字列型のデフォルト値は空文字）
        const strs = t.deserialize('ary:str ,,')
        console.log(strs)
        return 3===strs.length && Type.isStrs(strs) && ''===strs[0] && ''===strs[1] && ''===strs[2]
    })
    a.t(()=>{// 型とデフォルト値を任意に設定する
        const strs = t.deserialize('ary:str=x ,,')
        console.log(strs)
        return 3===strs.length && Type.isStrs(strs) && 'x'===strs[0] && 'x'===strs[1] && 'x'===strs[2]
    })
    // 整数型
    a.t(()=>{// 型を指定し値を省略したらデフォルト値になる（整数型のデフォルト値は0）
        const vals = t.deserialize('ary:int ,,')
        console.log(vals)
        return 3===vals.length && Type.isInts(vals) && 0===vals[0] && 0===vals[1] && 0===vals[2]
    })
    a.t(()=>{// 型を指定する
        const vals = t.deserialize('ary:int 2,4,6')
        return 3===vals.length && Type.isInts(vals) && 2===vals[0] && 4===vals[1] && 6===vals[2]
    })
    a.t(()=>{// 型を指定し値を省略したらデフォルト値になる（整数型のデフォルト値は0）
        const vals = t.deserialize('ary:int ,1,2')
        return 3===vals .length && Type.isInts(vals) && 0===vals[0] && 1===vals[1] && 2===vals[2]
    })
    a.t(()=>{// 型とデフォルト値を任意に設定する
        const vals = t.deserialize('ary:int=9 ,,')
        return 3===vals.length && Type.isInts(vals) && 9===vals[0] && 9===vals[1] && 9===vals[2]
    })
    // 真偽型
    a.t(()=>{// 型を指定し値を省略したらデフォルト値になる（真偽型のデフォルト値はfalse）
        const vals = t.deserialize('ary:bln ,,')
        console.log(vals)
        return 3===vals.length && Type.isBlns(vals) && false===vals[0] && false===vals[1] && false===vals[2]
    })
    a.t(()=>{// 型を指定する
        const vals = t.deserialize('ary:bln v,_,v')
        return 3===vals.length && Type.isBlns(vals) && true===vals[0] && false===vals[1] && true===vals[2]
    })
    a.t(()=>{// 型を指定し値を省略したらデフォルト値になる（真偽型のデフォルト値はfalse）
        const vals = t.deserialize('ary:bln ,v,')
        return 3===vals .length && Type.isBlns(vals) && false===vals[0] && true===vals[1] && false===vals[2]
    })
    a.t(()=>{// 型とデフォルト値を任意に設定する
        const vals = t.deserialize('ary:bln=v ,,')
        return 3===vals.length && Type.isBlns(vals) && true===vals[0] && true===vals[1] && true===vals[2]
    })
    // 浮動小数点数型
    a.t(()=>{// 型を指定し値を省略したらデフォルト値になる（浮動小数点数型のデフォルト値は0）
        const vals = t.deserialize('ary:flt ,,')
        console.log(vals)
        return 3===vals.length && Type.isFlts(vals) && 0===vals[0] && 0===vals[1] && 0===vals[2]
    })
    a.t(()=>{// 型を指定する
        const vals = t.deserialize('ary:flt .3,0.2,0.1')
        return 3===vals.length && Type.isFlts(vals) && 0.3===vals[0] && 0.2===vals[1] && 0.1===vals[2]
    })
    a.t(()=>{// 型を指定し値を省略したらデフォルト値になる（浮動小数点数型のデフォルト値は0）
        const vals = t.deserialize('ary:flt ,.1,.2')
        return 3===vals .length && Type.isFlts(vals) && 0===vals[0] && 0.1===vals[1] && 0.2===vals[2]
    })
    a.t(()=>{// 型とデフォルト値を任意に設定する
        const vals = t.deserialize('ary:flt=.9 ,,')
        return 3===vals.length && Type.isFlts(vals) && 0.9===vals[0] && 0.9===vals[1] && 0.9===vals[2]
    })
    // 長整数型
    a.t(()=>{// 型を指定し値を省略したらデフォルト値になる（長整数型のデフォルト値は0n）
        const vals = t.deserialize('ary:I ,,')
        return 3===vals.length && Type.isBigInts(vals) && 0n===vals[0] && 0n===vals[1] && 0n===vals[2]
    })
    a.t(()=>{// 型を指定する
        const vals = t.deserialize('ary:I 2,4,6')
        return 3===vals.length && Type.isBigInts(vals) && 2n===vals[0] && 4n===vals[1] && 6n===vals[2]
    })
    a.t(()=>{// 型を指定し値を省略したらデフォルト値になる（長整数型のデフォルト値は0n）
        const vals = t.deserialize('ary:I ,1,2')
        return 3===vals .length && Type.isBigInts(vals) && 0n===vals[0] && 1n===vals[1] && 2n===vals[2]
    })
    a.t(()=>{// 型とデフォルト値を任意に設定する
        const vals = t.deserialize('ary:I=9 ,,')
        console.log(vals)
        return 3===vals.length && Type.isBigInts(vals) && 9n===vals[0] && 9n===vals[1] && 9n===vals[2]
    })

    //--------------------------------------
    // 正常系（デリミタ＝セミコロン）
    //--------------------------------------
    a.t(()=>{
        const strs = t.deserialize('ary A;B;C')
        return 3===strs.length && Type.isStrs(strs) && 'A'===strs[0] && 'B'===strs[1] && 'C'===strs[2]
    })
    a.t(()=>{
        const vals = t.deserialize('ary 2;4;6')
        return 3===vals.length && Type.isInts(vals) && 2===vals[0] && 4===vals[1] && 6===vals[2]
    })
    a.t(()=>{
        const vals = t.deserialize('ary .1;0.2;1.1;2.2;3.3')
        return 5===vals.length && Type.isFlts(vals) && 0.1===vals[0] && 0.2===vals[1] && 1.1===vals[2] && 2.2===vals[3] && 3.3===vals[4]
    })
    a.t(()=>{
        const vals = t.deserialize('ary 0b00;0b01;0b10;0b11')
        console.log(vals)
        return 4===vals.length && Type.isInts(vals) && 0===vals[0] && 1===vals[1] && 2===vals[2] && 3===vals[3]
    })
    a.t(()=>{
        const vals = t.deserialize('ary 0o00;0o77;0o10')
        console.log(vals)
        return 3===vals.length && Type.isInts(vals) && 0===vals[0] && 63===vals[1] && 8===vals[2]
    })
    a.t(()=>{
        const vals = t.deserialize('ary 0x00;0xFF;0x10')
        console.log(vals)
        return 3===vals.length && Type.isInts(vals) && 0===vals[0] && 255===vals[1] && 16===vals[2]
    })
    a.t(()=>{
        const vals = t.deserialize('ary 0z00;0zZZ;0z10')
        console.log(vals)
        return 3===vals.length && Type.isInts(vals) && 0===vals[0] && 1295===vals[1] && 36===vals[2]
    })
    a.t(()=>{
        const vals = t.deserialize('ary _;v;v;_')
        return 4===vals.length && Type.isBlns(vals) && false===vals[0] && true===vals[1] && true===vals[2] && false===vals[3]
    })
    a.t(()=>{
        const vals = t.deserialize('ary ;v;v;') // false略記
        console.log(vals)
        return 4===vals.length && Type.isBlns(vals) && false===vals[0] && true===vals[1] && true===vals[2] && false===vals[3]
    })
    a.t(()=>{
        const vals = t.deserialize('ary ;v;v;_;_;_') // 末尾 false 3 連続
        console.log(vals)
        return 6===vals.length && Type.isBlns(vals) && false===vals[0] && true===vals[1] && true===vals[2] && false===vals[3] && false===vals[4] && false===vals[5]
    })
    a.t(()=>{
        const vals = t.deserialize('ary ;v;v;;_;') // 末尾 false 3 連続(最初と最後は空文字で略記した)
        console.log(vals)
        return 6===vals.length && Type.isBlns(vals) && false===vals[0] && true===vals[1] && true===vals[2] && false===vals[3] && false===vals[4] && false===vals[5]
    })
    a.t(()=>{
        const vals = t.deserialize('ary ;v;v;;;') // 末尾 false 3 連続(3つ共全部略記した)
        console.log(vals)
        return 6===vals.length && Type.isBlns(vals) && false===vals[0] && true===vals[1] && true===vals[2] && false===vals[3] && false===vals[4] && false===vals[5]
    })

    // 文字列型
    a.t(()=>{// 値を省略したらデフォルト値になる（文字列型のデフォルト値は空文字）
        const strs = t.deserialize('ary ;;')
        console.log(strs)
        return 3===strs.length && Type.isStrs(strs) && ''===strs[0] && ''===strs[1] && ''===strs[2]
    })
    a.t(()=>{// 型を指定する
        const strs = t.deserialize('ary:str A;B;C')
        return 3===strs.length && Type.isStrs(strs) && 'A'===strs[0] && 'B'===strs[1] && 'C'===strs[2]
    })
    a.t(()=>{// 値を省略したらデフォルト値になる（文字列型のデフォルト値は空文字）
        const strs = t.deserialize('ary:str ;;')
        console.log(strs)
        return 3===strs.length && Type.isStrs(strs) && ''===strs[0] && ''===strs[1] && ''===strs[2]
    })
    a.t(()=>{// 型とデフォルト値を任意に設定する
        const strs = t.deserialize('ary:str=x ;;')
        console.log(strs)
        return 3===strs.length && Type.isStrs(strs) && 'x'===strs[0] && 'x'===strs[1] && 'x'===strs[2]
    })
    // 整数型
    a.t(()=>{// 型を指定し値を省略したらデフォルト値になる（整数型のデフォルト値は0）
        const vals = t.deserialize('ary:int ;;')
        console.log(vals)
        return 3===vals.length && Type.isInts(vals) && 0===vals[0] && 0===vals[1] && 0===vals[2]
    })
    a.t(()=>{// 型を指定する
        const vals = t.deserialize('ary:int 2;4;6')
        return 3===vals.length && Type.isInts(vals) && 2===vals[0] && 4===vals[1] && 6===vals[2]
    })
    a.t(()=>{// 型を指定し値を省略したらデフォルト値になる（整数型のデフォルト値は0）
        const vals = t.deserialize('ary:int ;1;2')
        return 3===vals .length && Type.isInts(vals) && 0===vals[0] && 1===vals[1] && 2===vals[2]
    })
    a.t(()=>{// 型とデフォルト値を任意に設定する
        const vals = t.deserialize('ary:int=9 ;;')
        return 3===vals.length && Type.isInts(vals) && 9===vals[0] && 9===vals[1] && 9===vals[2]
    })
    // 真偽型
    a.t(()=>{// 型を指定し値を省略したらデフォルト値になる（真偽型のデフォルト値はfalse）
        const vals = t.deserialize('ary:bln ;;')
        console.log(vals)
        return 3===vals.length && Type.isBlns(vals) && false===vals[0] && false===vals[1] && false===vals[2]
    })
    a.t(()=>{// 型を指定する
        const vals = t.deserialize('ary:bln v;_;v')
        return 3===vals.length && Type.isBlns(vals) && true===vals[0] && false===vals[1] && true===vals[2]
    })
    a.t(()=>{// 型を指定し値を省略したらデフォルト値になる（真偽型のデフォルト値はfalse）
        const vals = t.deserialize('ary:bln ;v;')
        return 3===vals .length && Type.isBlns(vals) && false===vals[0] && true===vals[1] && false===vals[2]
    })
    a.t(()=>{// 型とデフォルト値を任意に設定する
        const vals = t.deserialize('ary:bln=v ;;')
        return 3===vals.length && Type.isBlns(vals) && true===vals[0] && true===vals[1] && true===vals[2]
    })
    // 浮動小数点数型
    a.t(()=>{// 型を指定し値を省略したらデフォルト値になる（浮動小数点数型のデフォルト値は0）
        const vals = t.deserialize('ary:flt ;;')
        console.log(vals)
        return 3===vals.length && Type.isFlts(vals) && 0===vals[0] && 0===vals[1] && 0===vals[2]
    })
    a.t(()=>{// 型を指定する
        const vals = t.deserialize('ary:flt .3;0.2;0.1')
        return 3===vals.length && Type.isFlts(vals) && 0.3===vals[0] && 0.2===vals[1] && 0.1===vals[2]
    })
    a.t(()=>{// 型を指定し値を省略したらデフォルト値になる（浮動小数点数型のデフォルト値は0）
        const vals = t.deserialize('ary:flt ;.1;.2')
        return 3===vals .length && Type.isFlts(vals) && 0===vals[0] && 0.1===vals[1] && 0.2===vals[2]
    })
    a.t(()=>{// 型とデフォルト値を任意に設定する
        const vals = t.deserialize('ary:flt=.9 ;;')
        return 3===vals.length && Type.isFlts(vals) && 0.9===vals[0] && 0.9===vals[1] && 0.9===vals[2]
    })
    // 長整数型
    a.t(()=>{// 型を指定し値を省略したらデフォルト値になる（長整数型のデフォルト値は0n）
        const vals = t.deserialize('ary:I ;;')
        return 3===vals.length && Type.isBigInts(vals) && 0n===vals[0] && 0n===vals[1] && 0n===vals[2]
    })
    a.t(()=>{// 型を指定する
        const vals = t.deserialize('ary:I 2;4;6')
        return 3===vals.length && Type.isBigInts(vals) && 2n===vals[0] && 4n===vals[1] && 6n===vals[2]
    })
    a.t(()=>{// 型を指定し値を省略したらデフォルト値になる（長整数型のデフォルト値は0n）
        const vals = t.deserialize('ary:I ;1;2')
        return 3===vals .length && Type.isBigInts(vals) && 0n===vals[0] && 1n===vals[1] && 2n===vals[2]
    })
    a.t(()=>{// 型とデフォルト値を任意に設定する
        const vals = t.deserialize('ary:I=9 ;;')
        console.log(vals)
        return 3===vals.length && Type.isBigInts(vals) && 9n===vals[0] && 9n===vals[1] && 9n===vals[2]
    })
    //--------------------------------------
    // 正常系（デリミタ＝スペース、カンマ、セミコロンの優先順である確認）
    //--------------------------------------
    a.t(()=>{// セミコロンが存在するとデリミタになる（スペース、カンマはデータの一部と解釈される）
        const vals = t.deserialize('ary A,B and C.; D E F ;,G,H,')
        console.log(vals)
        return 3===vals.length && Type.isStrs(vals) && 'A,B and C.'===vals[0] && ' D E F '===vals[1] && ',G,H,'===vals[2]
    })
    a.t(()=>{// カンマが存在するとデリミタになる（スペースはデータの一部と解釈される。セミコロンは使えない（デリミタ化しちゃう））
        const vals = t.deserialize('ary A B C, D E F ,GHI')
        console.log(vals)
        return 3===vals.length && Type.isStrs(vals) && 'A B C'===vals[0] && ' D E F '===vals[1] && 'GHI'===vals[2]
    })
    //--------------------------------------
    // 正常系（値に改行やタブを挿入するにはエスケープすること）
    //--------------------------------------
    a.t(()=>{
        const vals = t.deserialize('ary A\\nB C\\tD')
        return 2===vals.length && Type.isStrs(vals) && 'A\nB'===vals[0] && 'C\tD'===vals[1]
    })
    // セミコロンがデータとして使えない問題について。
    // スペース、カンマ、セミコロンのエスケープはない。特にセミコロンはその文字をそのまま使うことはできない。
    // セミコロン使えない問題は、今回の単一行で記述する書式では解決不可能。
    // いずれ作りたい複数行で記述する書式において、デリミタを改行コードにすることで、セミコロンもデータとして読めるようにする予定。

    // intの基数を型名で表現する(intH,int2,int8,int16,int32,int36)。値にプレフィクスが不要となるため短縮できる。
    a.t(()=>{
        const vals = t.deserialize('ary:iH F ff 10')
        return 3===vals.length && Type.isInts(vals) && 15===vals[0] && 255===vals[1] && 16===vals[2]
    })
    a.t(()=>{
        const vals = t.deserialize('ary:i8 7 77 10')
        return 3===vals.length && Type.isInts(vals) && 7===vals[0] && 63===vals[1] && 8===vals[2]
    })
    a.t(()=>{
        const vals = t.deserialize('ary:i2 1 11 10')
        return 3===vals.length && Type.isInts(vals) && 1===vals[0] && 3===vals[1] && 2===vals[2]
    })
    a.t(()=>{
        const vals = t.deserialize('ary:i36 z zz 10')
        console.log(vals)
        return 3===vals.length && Type.isInts(vals) && 35===vals[0] && 1295===vals[1] && 36===vals[2]
    })
    // intの上限・下限値（正確な値を保てなくなる値だと例外発生。Infinityもエラーにすべきか。今は放置しておく。）
    a.t(()=>t.deserialize('ary 9007199254740991')[0]===9007199254740991)
    a.t(()=>t.deserialize('ary -9007199254740991')[0]===-9007199254740991)
    a.e(TypeError, `Infinityでないにも関わらずNumber.MAX_SAFE_INTEGERよりも大きい値です。正確な値を保てないためエラーとします。:9007199254740992:9007199254740992`, ()=>t.deserialize('ary 9007199254740992'))
    a.e(TypeError, `-Infinityでないにも関わらずNumber.MIN_SAFE_INTEGERよりも小さい値です。正確な値を保てないためエラーとします。:-9007199254740992:-9007199254740992`, ()=>t.deserialize('ary -9007199254740992'))
    // 指定した型とは違う値をセットした場合（String型は失敗しようがない）
    a.e(TypeError, `Int型への変換に失敗しました。:A:NaN:10:`, ()=>t.deserialize('ary:i A'))
    a.e(TypeError, `Float型への変換に失敗しました。:A:NaN`, ()=>t.deserialize('ary:f A'))
    a.e(TypeError, `Boolean型への変換に失敗しました。Boolean型の値は_,v,空文字のいずれかで表現されます。:A:A`, ()=>t.deserialize('ary:b A'))
    a.e(TypeError, `BigInt型への変換に失敗しました。:A`, ()=>t.deserialize('ary:I A'))

    //-----------------------
    // Object
    //-----------------------
    a.t(()=>{
        const vals = t.deserialize('obj key value')
        return Type.isObj(vals) && 1===[...Object.keys(vals)].length
            && vals.hasOwnProperty('key') && 'value'===vals.key && Type.isStr(vals.key)
    })
    a.t(()=>{
        const vals = t.deserialize('obj name Yamada age 12')
        console.log(vals)
        return Type.isObj(vals) && 2===[...Object.keys(vals)].length
            && vals.hasOwnProperty('name') && 'Yamada'===vals.name && Type.isStr(vals.name)
            && vals.hasOwnProperty('age') && 12===vals.age && Type.isInt(vals.age)
    })
    a.t(()=>{
        const vals = t.deserialize('obj name:str Yamada age:int 12')
        console.log(vals)
        return Type.isObj(vals) && 2===[...Object.keys(vals)].length
            && vals.hasOwnProperty('name') && 'Yamada'===vals.name && Type.isStr(vals.name)
            && vals.hasOwnProperty('age') && 12===vals.age && Type.isInt(vals.age)
    })
    a.t(()=>{
        // 65.0はType.isFltで偽を返すが、65.1は真を返す。1で割り切れるか否かが分かれ目。
        const vals = t.deserialize('obj id:I 5 name:s Yamada age:i 12 isMale:b v weight:f 65.0')
        return Type.isObj(vals) && 5===[...Object.keys(vals)].length
            && vals.hasOwnProperty('id') && 5n===vals.id && Type.isBigInt(vals.id)
            && vals.hasOwnProperty('name') && 'Yamada'===vals.name && Type.isStr(vals.name)
            && vals.hasOwnProperty('age') && 12===vals.age && Type.isInt(vals.age)
            && vals.hasOwnProperty('isMale') && true===vals.isMale && Type.isBln(vals.isMale)
            && vals.hasOwnProperty('weight') && 65.0===vals.weight && (Type.isFlt(vals.weight) || Type.isInt(vals.weight))
    })
    a.t(()=>{
        const vals = t.deserialize('obj id:I 5 name:s Yamada age:i 12 isMale:b v weight:f 65.1')
        return Type.isObj(vals) && 5===[...Object.keys(vals)].length
            && vals.hasOwnProperty('id') && 5n===vals.id && Type.isBigInt(vals.id)
            && vals.hasOwnProperty('name') && 'Yamada'===vals.name && Type.isStr(vals.name)
            && vals.hasOwnProperty('age') && 12===vals.age && Type.isInt(vals.age)
            && vals.hasOwnProperty('isMale') && true===vals.isMale && Type.isBln(vals.isMale)
            && vals.hasOwnProperty('weight') && 65.1===vals.weight && Type.isFlt(vals.weight)
    })
    a.t(()=>{
        const vals = t.deserialize('obj id:iH f')
        return Type.isObj(vals) && 1===[...Object.keys(vals)].length
            && vals.hasOwnProperty('id') && 15===vals.id && Type.isInt(vals.id)
    })
    a.t(()=>{
        const vals = t.deserialize('obj id:i2 11')
        return Type.isObj(vals) && 1===[...Object.keys(vals)].length
            && vals.hasOwnProperty('id') && 3===vals.id && Type.isInt(vals.id)
    })
    a.t(()=>{
        const vals = t.deserialize('obj id:i8 77')
        return Type.isObj(vals) && 1===[...Object.keys(vals)].length
            && vals.hasOwnProperty('id') && 63===vals.id && Type.isInt(vals.id)
    })
    a.t(()=>{
        const vals = t.deserialize('obj id:i16 ff')
        return Type.isObj(vals) && 1===[...Object.keys(vals)].length
            && vals.hasOwnProperty('id') && 255===vals.id && Type.isInt(vals.id)
    })
    a.t(()=>{
        const vals = t.deserialize('obj id:i36 zz')
        return Type.isObj(vals) && 1===[...Object.keys(vals)].length
            && vals.hasOwnProperty('id') && 1295===vals.id && Type.isInt(vals.id)
    })
    // BigInt
    a.t(()=>{
        const vals = t.deserialize('obj id:IH f')
        return Type.isObj(vals) && 1===[...Object.keys(vals)].length
            && vals.hasOwnProperty('id') && 15n===vals.id && Type.isBigInt(vals.id)
    })
    a.t(()=>{
        const vals = t.deserialize('obj id:I2 11')
        return Type.isObj(vals) && 1===[...Object.keys(vals)].length
            && vals.hasOwnProperty('id') && 3n===vals.id && Type.isBigInt(vals.id)
    })
    a.t(()=>{
        const vals = t.deserialize('obj id:I8 77')
        return Type.isObj(vals) && 1===[...Object.keys(vals)].length
            && vals.hasOwnProperty('id') && 63n===vals.id && Type.isBigInt(vals.id)
    })
    a.t(()=>{
        const vals = t.deserialize('obj id:I16 ff')
        return Type.isObj(vals) && 1===[...Object.keys(vals)].length
            && vals.hasOwnProperty('id') && 255n===vals.id && Type.isBigInt(vals.id)
    })
    a.t(()=>{// 存在しない型。BigIntは0b,0o,0x(2,8,16)の基数にしか対応していないため、36進数は非対応。未知型は文字列型になる。
        const vals = t.deserialize('obj id:I36 zz')
        return Type.isObj(vals) && 1===[...Object.keys(vals)].length
            //&& vals.hasOwnProperty('id') && 1295n===vals.id && Type.isBigInt(vals.id)
            && vals.hasOwnProperty('id') && 'zz'===vals.id && Type.isStr(vals.id)
    })
    // 要素数が奇数の場合、値は初期値になる。
    a.t(()=>{
        const vals = t.deserialize('obj key')
        return Type.isObj(vals) && 1===[...Object.keys(vals)].length
            && vals.hasOwnProperty('key') && ''===vals.key && Type.isStr(vals.key)
    })
    a.t(()=>{
        const vals = t.deserialize('obj key:i')
        return Type.isObj(vals) && 1===[...Object.keys(vals)].length
            && vals.hasOwnProperty('key') && 0===vals.key && Type.isInt(vals.key)
    })
    a.t(()=>{
        const vals = t.deserialize('obj key:f')
        return Type.isObj(vals) && 1===[...Object.keys(vals)].length
            && vals.hasOwnProperty('key') && 0===vals.key && (Type.isFlt(vals.key) || Type.isInt(vals.key))
    })
    a.t(()=>{
        const vals = t.deserialize('obj key:b')
        return Type.isObj(vals) && 1===[...Object.keys(vals)].length
            && vals.hasOwnProperty('key') && false===vals.key && Type.isBln(vals.key)
    })
    a.t(()=>{
        const vals = t.deserialize('obj key:I')
        return Type.isObj(vals) && 1===[...Object.keys(vals)].length
            && vals.hasOwnProperty('key') && 0n===vals.key && Type.isBigInt(vals.key)
    })
    // intの上限・下限値（正確な値を保てなくなる値だと例外発生。Infinityもエラーにすべきか。今は放置しておく。）
    a.t(()=>t.deserialize('obj key 9007199254740991').key===9007199254740991)
    a.t(()=>t.deserialize('obj key -9007199254740991').key===-9007199254740991)
    a.e(TypeError, `Infinityでないにも関わらずNumber.MAX_SAFE_INTEGERよりも大きい値です。正確な値を保てないためエラーとします。:9007199254740992:9007199254740992`, ()=>t.deserialize('ary 9007199254740992'))
    a.e(TypeError, `-Infinityでないにも関わらずNumber.MIN_SAFE_INTEGERよりも小さい値です。正確な値を保てないためエラーとします。:-9007199254740992:-9007199254740992`, ()=>t.deserialize('ary -9007199254740992'))
    // 指定した型とは違う値をセットした場合（String型は失敗しようがない）
    a.e(TypeError, `Int型への変換に失敗しました。:A:NaN:10:`, ()=>t.deserialize('obj key:i A'))
    a.e(TypeError, `Float型への変換に失敗しました。:A:NaN`, ()=>t.deserialize('obj key:f A'))
    a.e(TypeError, `Boolean型への変換に失敗しました。Boolean型の値は_,v,空文字のいずれかで表現されます。:A:A`, ()=>t.deserialize('obj key:b A'))
    a.e(TypeError, `BigInt型への変換に失敗しました。:A`, ()=>t.deserialize('obj key:I A'))

    //-----------------------
    // Table
    //-----------------------
    a.t(()=>{return undefined===t.deserialize('tbl')})
    a.t(()=>{return undefined===t.deserialize('tbl(name)')})
    a.t(()=>{return undefined===t.deserialize('tbl(name) ')})
    a.t(()=>{
        const vals = t.deserialize('tbl(name) A')
        return Array.isArray(vals) && 1===vals.length && Type.isObjs(vals) && 'A'===vals[0].name
    })
    a.t(()=>{
        const vals = t.deserialize('tbl(name,age) yamada 12 suzuki 24')
        console.log(vals)
        return Array.isArray(vals) && 2===vals.length && Type.isObjs(vals)
            && 'yamada'===vals[0].name && 12===vals[0].age
            && 'suzuki'===vals[1].name && 24===vals[1].age
    })
    a.t(()=>{
        const vals = t.deserialize('tbl(name:str,age:int) yamada 12 suzuki 24')
        console.log(vals)
        return Array.isArray(vals) && 2===vals.length && Type.isObjs(vals)
            && 'yamada'===vals[0].name && 12===vals[0].age
            && 'suzuki'===vals[1].name && 24===vals[1].age
    })
    a.t(()=>{
        const vals = t.deserialize('tbl(name:str=yamada,age:int=12)   suzuki 24')
        console.log(vals)
        return Array.isArray(vals) && 2===vals.length && Type.isObjs(vals)
            && 'yamada'===vals[0].name && 12===vals[0].age
            && 'suzuki'===vals[1].name && 24===vals[1].age
    })
    a.t(()=>{
        const vals = t.deserialize('tbl(key:s) v')
        return Array.isArray(vals) && 1===vals.length && Type.isObjs(vals) && 'v'===vals[0].key && Type.isStr(vals[0].key)
    })
    a.t(()=>{
        const vals = t.deserialize('tbl(key:b) v')
        return Array.isArray(vals) && 1===vals.length && Type.isObjs(vals) && true===vals[0].key && Type.isBln(vals[0].key)
    })
    a.t(()=>{
        const vals = t.deserialize('tbl(key:f) 12.3')
        return Array.isArray(vals) && 1===vals.length && Type.isObjs(vals) && 12.3===vals[0].key && Type.isFlt(vals[0].key)
    })
    a.t(()=>{
        const vals = t.deserialize('tbl(key:i) 3')
        return Array.isArray(vals) && 1===vals.length && Type.isObjs(vals) && 3===vals[0].key && Type.isInt(vals[0].key)
    })
    a.t(()=>{
        const vals = t.deserialize('tbl(key:i2) 11')
        return Array.isArray(vals) && 1===vals.length && Type.isObjs(vals) && 3===vals[0].key && Type.isInt(vals[0].key)
    })
    a.t(()=>{
        const vals = t.deserialize('tbl(key:i8) 77')
        return Array.isArray(vals) && 1===vals.length && Type.isObjs(vals) && 63===vals[0].key && Type.isInt(vals[0].key)
    })
    a.t(()=>{
        const vals = t.deserialize('tbl(key:iH) ff')
        return Array.isArray(vals) && 1===vals.length && Type.isObjs(vals) && 255===vals[0].key && Type.isInt(vals[0].key)
    })
    a.t(()=>{
        const vals = t.deserialize('tbl(key:i16) ff')
        return Array.isArray(vals) && 1===vals.length && Type.isObjs(vals) && 255===vals[0].key && Type.isInt(vals[0].key)
    })
    a.t(()=>{
        const vals = t.deserialize('tbl(key:i36) zz')
        return Array.isArray(vals) && 1===vals.length && Type.isObjs(vals) && 1295===vals[0].key && Type.isInt(vals[0].key)
    })
    a.t(()=>{
        const vals = t.deserialize('tbl(key:I) 3')
        return Array.isArray(vals) && 1===vals.length && Type.isObjs(vals) && 3n===vals[0].key && Type.isBigInt(vals[0].key)
    })
    a.t(()=>{
        const vals = t.deserialize('tbl(key:I2) 11')
        return Array.isArray(vals) && 1===vals.length && Type.isObjs(vals) && 3n===vals[0].key && Type.isBigInt(vals[0].key)
    })
    a.t(()=>{
        const vals = t.deserialize('tbl(key:I8) 77')
        return Array.isArray(vals) && 1===vals.length && Type.isObjs(vals) && 63n===vals[0].key && Type.isBigInt(vals[0].key)
    })
    a.t(()=>{
        const vals = t.deserialize('tbl(key:IH) ff')
        return Array.isArray(vals) && 1===vals.length && Type.isObjs(vals) && 255n===vals[0].key && Type.isBigInt(vals[0].key)
    })
    a.t(()=>{
        const vals = t.deserialize('tbl(key:I16) ff')
        console.log(vals)
        return Array.isArray(vals) && 1===vals.length && Type.isObjs(vals) && 255n===vals[0].key && Type.isBigInt(vals[0].key)
    })
    // 型変換失敗系
    a.e(TypeError, `Boolean型への変換に失敗しました。Boolean型の値は_,v,空文字のいずれかで表現されます。:あ:あ`, ()=>t.deserialize('tbl(key:b) あ'))
    a.e(TypeError, `Float型への変換に失敗しました。:あ:NaN`, ()=>t.deserialize('tbl(key:f) あ'))
    a.e(TypeError, `Int型への変換に失敗しました。:あ:NaN:10:`, ()=>t.deserialize('tbl(key:i) あ'))
    a.e(TypeError, `Int型への変換に失敗しました。:あ:NaN:2:b`, ()=>t.deserialize('tbl(key:i2) あ'))
    a.e(TypeError, `Int型への変換に失敗しました。:あ:NaN:8:o`, ()=>t.deserialize('tbl(key:i8) あ'))
    a.e(TypeError, `Int型への変換に失敗しました。:あ:NaN:16:x`, ()=>t.deserialize('tbl(key:iH) あ'))
    a.e(TypeError, `Int型への変換に失敗しました。:あ:NaN:16:x`, ()=>t.deserialize('tbl(key:i16) あ'))
    a.e(TypeError, `Int型への変換に失敗しました。:あ:NaN:36:z`, ()=>t.deserialize('tbl(key:i36) あ'))
    a.e(TypeError, `BigInt型への変換に失敗しました。:あ`, ()=>t.deserialize('tbl(key:I) あ'))
    a.e(TypeError, `BigInt型への変換に失敗しました。:0Bあ`, ()=>t.deserialize('tbl(key:I2) あ'))
    a.e(TypeError, `BigInt型への変換に失敗しました。:0Oあ`, ()=>t.deserialize('tbl(key:I8) あ'))
    a.e(TypeError, `BigInt型への変換に失敗しました。:0Xあ`, ()=>t.deserialize('tbl(key:IH) あ'))
    a.e(TypeError, `BigInt型への変換に失敗しました。:0Xあ`, ()=>t.deserialize('tbl(key:I16) あ'))
    // リテラル値から型推論する
    a.t(()=>{
        const vals = t.deserialize('tbl(key) A')
        return Array.isArray(vals) && 1===vals.length && Type.isObjs(vals) && 'A'===vals[0].key && Type.isStr(vals[0].key)
    })
    a.t(()=>{
        const vals = t.deserialize('tbl(key) _')
        return Array.isArray(vals) && 1===vals.length && Type.isObjs(vals) && false===vals[0].key && Type.isBln(vals[0].key)
    })
    a.t(()=>{
        const vals = t.deserialize('tbl(key) v')
        return Array.isArray(vals) && 1===vals.length && Type.isObjs(vals) && true===vals[0].key && Type.isBln(vals[0].key)
    })
    a.t(()=>{
        const vals = t.deserialize('tbl(key) .1')
        return Array.isArray(vals) && 1===vals.length && Type.isObjs(vals) && 0.1===vals[0].key && Type.isFlt(vals[0].key)
    })
    a.t(()=>{
        const vals = t.deserialize('tbl(key) -.1')
        return Array.isArray(vals) && 1===vals.length && Type.isObjs(vals) && -0.1===vals[0].key && Type.isFlt(vals[0].key)
    })
    a.t(()=>{
        const vals = t.deserialize('tbl(key) -0.1')
        return Array.isArray(vals) && 1===vals.length && Type.isObjs(vals) && -0.1===vals[0].key && Type.isFlt(vals[0].key)
    })
    a.t(()=>{
        const vals = t.deserialize('tbl(key) 12.3')
        return Array.isArray(vals) && 1===vals.length && Type.isObjs(vals) && 12.3===vals[0].key && Type.isFlt(vals[0].key)
    })
    a.t(()=>{
        const vals = t.deserialize('tbl(key) -12.3')
        console.log(vals)
        return Array.isArray(vals) && 1===vals.length && Type.isObjs(vals) && -12.3===vals[0].key && Type.isFlt(vals[0].key)
    })
    a.t(()=>{
        const vals = t.deserialize('tbl(key) 1.0')
        return Array.isArray(vals) && 1===vals.length && Type.isObjs(vals) && 1.0===vals[0].key && Type.isInt(vals[0].key) // JSではIntとFltは共にNumber型のため1で割り切れる数は区別が付かなくなる
    })
    a.t(()=>{
        const vals = t.deserialize('tbl(key) 0.0')
        return Array.isArray(vals) && 1===vals.length && Type.isObjs(vals) && 0.0===vals[0].key && Type.isInt(vals[0].key) // JSではIntとFltは共にNumber型のため1で割り切れる数は区別が付かなくなる
    })
    a.t(()=>{
        const vals = t.deserialize('tbl(key) 0')
        return Array.isArray(vals) && 1===vals.length && Type.isObjs(vals) && 0===vals[0].key && Type.isInt(vals[0].key)
    })
    a.t(()=>{
        const vals = t.deserialize('tbl(key) 0b11')
        return Array.isArray(vals) && 1===vals.length && Type.isObjs(vals) && 3===vals[0].key && Type.isInt(vals[0].key)
    })
    a.t(()=>{
        const vals = t.deserialize('tbl(key) 0o77')
        return Array.isArray(vals) && 1===vals.length && Type.isObjs(vals) && 63===vals[0].key && Type.isInt(vals[0].key)
    })
    a.t(()=>{
        const vals = t.deserialize('tbl(key) 0xff')
        return Array.isArray(vals) && 1===vals.length && Type.isObjs(vals) && 255===vals[0].key && Type.isInt(vals[0].key)
    })
    a.t(()=>{
        const vals = t.deserialize('tbl(key) 0xFF')
        return Array.isArray(vals) && 1===vals.length && Type.isObjs(vals) && 255===vals[0].key && Type.isInt(vals[0].key)
    })
    a.t(()=>{
        const vals = t.deserialize('tbl(key) 0zzz')
        return Array.isArray(vals) && 1===vals.length && Type.isObjs(vals) && 1295===vals[0].key && Type.isInt(vals[0].key)
    })
    a.t(()=>{
        const vals = t.deserialize('tbl(key) 0zZZ')
        return Array.isArray(vals) && 1===vals.length && Type.isObjs(vals) && 1295===vals[0].key && Type.isInt(vals[0].key)
    })
    a.t(()=>{
        const vals = t.deserialize('tbl(key) 3n')
        return Array.isArray(vals) && 1===vals.length && Type.isObjs(vals) && 3n===vals[0].key && Type.isBigInt(vals[0].key)
    })
    a.t(()=>{
        const vals = t.deserialize('tbl(key) 0B11')
        return Array.isArray(vals) && 1===vals.length && Type.isObjs(vals) && 3n===vals[0].key && Type.isBigInt(vals[0].key)
    })
    a.t(()=>{
        const vals = t.deserialize('tbl(key) 0O77')
        return Array.isArray(vals) && 1===vals.length && Type.isObjs(vals) && 63n===vals[0].key && Type.isBigInt(vals[0].key)
    })
    a.t(()=>{
        const vals = t.deserialize('tbl(key) 0Xff')
        return Array.isArray(vals) && 1===vals.length && Type.isObjs(vals) && 255n===vals[0].key && Type.isBigInt(vals[0].key)
    })
    a.t(()=>{
        const vals = t.deserialize('tbl(key) 0XFF')
        console.log(vals)
        return Array.isArray(vals) && 1===vals.length && Type.isObjs(vals) && 255n===vals[0].key && Type.isBigInt(vals[0].key)
    })











    a.fin()
});
window.addEventListener('beforeunload', (event) => {
    console.log('beforeunload!!');
});

