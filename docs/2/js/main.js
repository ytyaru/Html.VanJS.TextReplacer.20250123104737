window.addEventListener('DOMContentLoaded', (event) => {
    /*
    console.log('DOMContentLoaded!!');
    const {h1, p, a} = van.tags
    const author = 'ytyaru'
    van.add(document.querySelector('main'), 
        h1(a({href:`https://github.com/${author}/Html.VanJS.TextReplacer.20250123104737/`}, 'TextReplacer')),
        p('テキスト置換エンジン。'),
//        p('Text replacement engine.'),
    )
    van.add(document.querySelector('footer'),  new Footer('ytyaru', '../').make())
    */
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

    a.fin()
});
window.addEventListener('beforeunload', (event) => {
    console.log('beforeunload!!');
});

