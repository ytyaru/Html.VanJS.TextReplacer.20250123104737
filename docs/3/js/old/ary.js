function ary(args, text) {
    // 構造化する（コレクション化する、分裂させる、要素化する、収集する）
    const textValues = collect(args, text)  // collect()
    // 型変換
    const typedValues = parse(args, textValues) // 
    // 妥当性確認する
    // validate(args, typedValues) // 例外発生やログ出力する
    // 返却する
    return typedValues;

}
function collect(args, text) { return text.split(args.delimiter.h) }
//    args.delimiter.h  '\t'  [',',' ','\t']
//    args.delimiter.v  '\n'  ['\n']
function parse(args, values) {
    // (str,int)
    // (str,int)*
    // args.type.isLoop
    // args.type.values
    return (args.type.values && args.type.values.some(t=>t!='String'))
        ? values.map((v,i)=>typed(values[i], args.type.values[i]))
        : values;
}
function typed(value, type) {
    if ('Integer'===type){return parseInt(value)}
    else if ('Float'===type){return parseFloat(value)}
    else if ('Boolean'===type){return !!value} // 真偽値を0と1で表す？
    else {return value}
}
