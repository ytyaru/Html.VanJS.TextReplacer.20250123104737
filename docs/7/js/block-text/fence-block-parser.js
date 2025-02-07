// フェンス（テキストブロックとは別に改行が内容として含まれる）
// 　これを識別するためにはフェンスを示す行頭+++,---,```を抽出せねばならない。
(function(){
class FenceBlockParser{
    constructor() {
        this._pm = new FenceBlockContentParserManager()
//        this._pm.add(new CodeBlockParser(), new QuoteBlockParser())
//        this._pm.add(new CodeBlockParser(), new QuoteBlockParser(), new UrlBlockParser())
        this._pm.add(new ArrayBlockParser(), new ObjectBlockParser(), new TableBlockParser())
    }
    parse(text) {
        const lines = this.#getLines(text)
//        return this.#makeFence(text, lines)
        const blocks = this.#makeFence(text, lines)
        console.log('fbs:',blocks)
        return this.#parse(blocks)
    }
    #getLines(text) {
        const lines = []; let start = 0;
        const SIGS = ['-','\\+','`','"']
        for (let SIG of SIGS) {
            const REGEXP = RegExp(`^([${SIG}]{3,})(.*)$`, 'gm')
            console.log(REGEXP)
            let match = null
            while ((match = REGEXP.exec(text)) !== null) {
//                console.log(match)
                const sigTxt = match[1]
                const argTxt = match[2]
                const args = argTxt.trim().split(/( |\{)/).filter(v=>v)
                const type = args[0]
                const optTxt = 1 < args.length ? args[1] : ''
                console.log(`sigTxt:${sigTxt}`)
                console.log(`argTxt:${argTxt}`)
                console.log(`args:`, args)
                const block = {
                    text: match[0],
                    start: match.index,
                    end: REGEXP.lastIndex,
                    fence: {
                        text: sigTxt,
                        sig: SIG.replaceAll('\\',''),
                        len: sigTxt.length,
                        type: this.#getType(SIG.replaceAll('\\','')),
                    },
                    option: {
                        text: argTxt,
                        ary: args,
                        obj: null,
                    },
                }
                console.log(`type:`,block.fence.type)
                // タイプ別処理
                if ('part'===block.fence.type) {
                    block.fence.id = args[0]
                } else if ('code'===block.fence.type) {
                    block.fence.language = args[0]
                }
                lines.push(block)
            }
        }
        return lines.sort((a,b)=>a.start - b.start)
    }
    #makeFence(text, lines) {
        console.log(lines)
//        let [blocks,start,meta,fenceText,isFenceStarted,isFrontMatter,startIdx] = [[],0,null,null,false,false,-1]
        const blocks = [];
//        let [startIdx, endIdx, nextStartIdx] = [0,0,0];
        let startLine = null;
        let endLine = null;
        let nextStartLine = null;
//        let isAbbr = false; // 終了フェンスを省略したか否か
        for (let i=0; i<lines.length; i++) {
            console.log(i, lines[i], startLine, endLine, nextStartLine)
            if (nextStartLine) {
//            if (nextStartLine && null===startLine && null===endLine) {
                startLine = nextStartLine
                endLine = lines[i]
//                nextStartLine = null
                //nextStartLine = lines[i]
                nextStartLine = lines[i].option.text ? lines[i] : null
                console.log('has nextStartLine:', startLine, endLine, lines[i])
//                startIdx = nextStartIdx
//                nextStartIdx = i
            } else if (null===startLine ) {
//            } else if (!nextStartLine && !startLine && !endLine) {
                startLine = lines[i]
                endLine = null
//                startIdx = i
            } else if (null===endLine) {
//            } else if (!nextStartLine && startLine && !endLine) {
                if (startLine.sig===lines[i].sig && startLine.len===lines[i].len){
                    endLine = lines[i]
//                    endIdx = i
//                    if (lines[i].option.text) {nextStartLine=lines[i];nextStartIdx=i;} // 次の開始フェンスで今の終了フェンスを省略した
//                    else {nextStartLine=null;nextStartIdx=0;} // 今の終了フェンスを明記した
                    //if (lines[i].option.text) {nextStartLine=lines[i]} // 次の開始フェンスで今の終了フェンスを省略した
                    //else {nextStartLine=null} // 今の終了フェンスを明記した
                    nextStartLine = lines[i].option.text ? lines[i] : null // 終了フェンス省略 || 終了フェンス明記
//                    isAbbr = i+1 < lines.length || 
                    console.log(startLine, endLine, nextStartLine)
                }
            }
            if (startLine && endLine) {
                const end = lines[i].end
//                const ho = lines[startIdx].option
//                const fo = lines[i].option
                const ho = startLine.option
                const fo = endLine.option
                console.log(ho)
                console.log(fo)
                const hoa0 = ho.ary[0]
                const foa0 = fo.ary[0]
                const block = {
                    script: {
                        //start: lines[startIdx].start, // text内における当フェンスブロックの開始位置
                        start: startLine.start, // text内における当フェンスブロックの開始位置
                        //end: lines[i].end, // text内における当フェンスブロックの終了位置
                        //end: endLine.end, // text内における当フェンスブロックの終了位置
                        end: endLine.start + endLine.text.length, // text内における当フェンスブロックの終了位置
                        text: '', // フェンスブロック全文
//                        line:{start:startIdx, end:endIdx}
                    },
                    fence: {
                        sig: lines[i].fence.sig, // フェンス記号
                        len: lines[i].fence.len, // フェンス記号数
                        text: lines[i].fence.text, // --- 等のフェンス記号テキスト
                        type: lines[i].fence.type,
                        ary: [],
                        obj: {},
                    }
                }
                // タイプ別処理
                if ('part'===block.fence.type) { block.fence.id = lines[startIdx].fence.id }
                else if ('code'===block.fence.type) { block.fence.language = lines[startIdx].fence.language }
                // ary, obj
                //block.header = this.#getHeadFoot(text, ho, lines[startIdx].start+lines[startIdx].fence.len)
                block.header = this.#getHeadFoot(text, ho, startLine.start+startLine.fence.len)
                block.footer = this.#getHeadFoot(text, fo, end)
                console.log(block.header)
                console.log(block.footer)
//                    block.fence.ary = [...block.header.ary, ...block.footer.ary]
//                    block.fence.obj = {...block.header.obj, ...block.footer.obj}
                if (block.header.ary) {block.fence.ary = block.fence.ary.concat(block.header.ary).filter(v=>v)}
                if (block.footer.ary) {block.fence.ary = block.fence.ary.concat(block.footer.ary).filter(v=>v)}
                if (block.header.obj) {block.fence.obj = {...block.fence.obj, ...block.header.obj}}
                if (block.footer.obj) {block.fence.obj = {...block.fence.obj, ...block.footer.obj}}
                if (block.header.ary && 0===block.header.ary.length){block.header.ary=null}
                if (block.footer.ary && 0===block.footer.ary.length){block.footer.ary=null}
                if (block.fence.ary && 0===block.fence.ary.length){block.fence.ary=null}
                if (block.header.obj && 0===Object.keys(block.header.obj).length){block.header.obj=null}
                if (block.footer.obj && 0===Object.keys(block.footer.obj).length){block.footer.obj=null}
                if (block.fence.obj && 0===Object.keys(block.fence.obj).length){block.fence.obj=null}
                block.body = {
                    //text: text.slice(block.header.end, block.footer.start),
                    //text: text.slice(block.header.end, block.footer.start-block.fence.len).replace(/^[\r?\n]{1,}/gm, '').replace(/[\r?\n]{1,}$/gm, ''),
                    text: text.slice(startLine.end+1, endLine.start).replace(/^[\r?\n]{1,}/gm, '').replace(/[\r?\n]{1,}$/gm, ''),
                    html: null,
                }
                block.parse = {} // html, obj, ary, ...
                blocks.push(block)
//                isFenceStarted = false
//                fenceText = null
                startLine = null;
                endLine = null;
            }
        }
        return blocks;
    }
    /*
    #makeFence(text, lines) {
        let [blocks,start,meta,fenceText,isFenceStarted,isFrontMatter,startIdx] = [[],0,null,null,false,false,-1]
        console.log(lines)
        for (let i=0; i<lines.length; i++) {
            console.log('line:',lines[i])
            if (isFenceStarted) { // フェンスブロック
                if (lines[startIdx].fence.text!==lines[i].fence.text) {continue} // フェンスのネスト（フェンス内コンテンツ）
                else { // フェンスブロック終端を発見した
                    const end = lines[i].end
                    const ho = lines[startIdx].option
                    const fo = lines[i].option
                    console.log(ho)
                    console.log(fo)
                    const hoa0 = ho.ary[0]
                    const foa0 = fo.ary[0]
                    const block = {
                        script: {
                            start: lines[startIdx].start, // text内における当フェンスブロックの開始位置
                            end: lines[i].end, // text内における当フェンスブロックの終了位置
                            text: '', // フェンスブロック全文
                        },
                        fence: {
                            sig: lines[i].fence.sig, // フェンス記号
                            len: lines[i].fence.len, // フェンス記号数
                            text: lines[i].fence.text, // --- 等のフェンス記号テキスト
                            type: lines[i].fence.type,
                            ary: [],
                            obj: {},
                        }
                    }
                    // タイプ別処理
                    if ('part'===block.fence.type) { block.fence.id = lines[startIdx].fence.id }
                    else if ('code'===block.fence.type) { block.fence.language = lines[startIdx].fence.language }
                    // ary, obj
                    block.header = this.#getHeadFoot(text, ho, lines[startIdx].start+lines[startIdx].fence.len)
                    block.footer = this.#getHeadFoot(text, fo, end)
                    console.log(block.header)
                    console.log(block.footer)
//                    block.fence.ary = [...block.header.ary, ...block.footer.ary]
//                    block.fence.obj = {...block.header.obj, ...block.footer.obj}
                    if (block.header.ary) {block.fence.ary = block.fence.ary.concat(block.header.ary).filter(v=>v)}
                    if (block.footer.ary) {block.fence.ary = block.fence.ary.concat(block.footer.ary).filter(v=>v)}
                    if (block.header.obj) {block.fence.obj = {...block.fence.obj, ...block.header.obj}}
                    if (block.footer.obj) {block.fence.obj = {...block.fence.obj, ...block.footer.obj}}
                    if (block.header.ary && 0===block.header.ary.length){block.header.ary=null}
                    if (block.footer.ary && 0===block.footer.ary.length){block.footer.ary=null}
                    if (block.fence.ary && 0===block.fence.ary.length){block.fence.ary=null}
                    if (block.header.obj && 0===Object.keys(block.header.obj).length){block.header.obj=null}
                    if (block.footer.obj && 0===Object.keys(block.footer.obj).length){block.footer.obj=null}
                    if (block.fence.obj && 0===Object.keys(block.fence.obj).length){block.fence.obj=null}
                    block.body = {
                        //text: text.slice(block.header.end, block.footer.start),
                        text: text.slice(block.header.end, block.footer.start-block.fence.len).replace(/^[\r?\n]{1,}/gm, '').replace(/[\r?\n]{1,}$/gm, ''),
                        html: null,
                    }
                    block.parse = {} // html, obj, ary, ...
                    blocks.push(block)
                    isFenceStarted = false
                    fenceText = null
                }
            } else {
                startIdx = i
                isFenceStarted = true
            }
        }
        return blocks
        //return this.#parseFrontMatterYaml(blocks)
        //return this.#parse(blocks)
    }
    */
    #getType(sig) {
             if ('"'===sig) {return 'quote'}
        else if ('+'===sig) {return 'part'} // type:id (この部品を参照する識別子`{part:id}`として使用する)
        else if ('`'===sig) {return 'code'} // type:language (javascript, html, css, python, ...)
        else if ('-'===sig) {return `free` }
        else {throw new Error(`プログラムエラー。sigが規定値ではありません。:${sig}`)}
    }
    #getHeadFoot(script, opt, start) { // text:script全文, opt:fence.option, start:script内における開始位置
        console.log(opt)
        //const isMultiLine = opt.text.match(/(?:[^\\])\{/) // {が含まれている（\{は除く）
        const isMultiLine = this.#isMultiLine(script, opt); // header二番目引数の先頭文字が{である
        if (isMultiLine) {
            // {の直後が改行かもしれない。その場合、opt.textではArrayかObjectかの判断ができない。本文全体が必要。
            const obj = {text:null, ary:null, obj:null, start:-1, end:-1}
            obj.start = script.slice(start).match(/[^\\]\{/)
            obj.end = script.slice(start).match(/[^\\]\{/)
            obj.text = script.slice(obj.start, obj.end)
            //const isKvs = enclose.body.match(/(?:[^\\])=/) // =が含まれている（\=は除く）
            const isKvs = script.match(/(?:[^\\])=/) // =が含まれている（\=は除く）
            if (isKvs) {obj.obj = Kvs.read(obj.text)}
            else {obj.ary = obj.text.split('\n').map(line=>line.split(' ')).flat().filter(v=>v)}
            return obj
        } else {
            const obj = {text:opt.text, ary:null, obj:null, start:start, end:start + opt.text.length}
            const isKvs = opt.text.match(/(?:[^\\])=/) // =が含まれている（\=は除く）
            if (isKvs) {obj.obj = Kvs.read(obj.text)}
            else {obj.ary = opt.text.split(' ');}
            return obj
        }
    }
    #isMultiLine(script, opt) {
        const args = opt.text.split(' ');
        return 1 < args.length && args[1].startsWith('{') && args.slice(-1)[0].endsWith('}');
    }
    /*
    #isMultiLine(script, opt) {return (1 < opt.length && opt[1].startsWith('{') && opt.slice(-1)[0].endsWith('}'))}
    #isMultiLine(script, opt) {
        if (1 < opt.length) { // 0:type, 1:{..., N:...}
            return opt[1].startsWith('{') && opt.slice(-1)[0].endsWith('}')
        } else {return false}
    }
    */
    #parse(blocks) {
        this.#parseFrontMatterYaml(blocks)
        this._pm.parse(blocks)
        return blocks
    }
    #parseFrontMatterYaml(blocks){
        if (0 < blocks.length) { // フェンスブロックが存在する
            if (0===blocks[0].script.start) { // 原稿内の先頭である
                const frontMatter = jsyaml.load(blocks[0].body.text)
//                blocks[0].body.obj = frontMatter
//                blocks[0].fence.obj = frontMatter
                blocks[0].parse.obj = frontMatter
            }
        }
        return blocks
    }
}
class Kvs {
    static read(body) { // body:ヘッダ／フッタの{}内テキスト, eqs:kvの=がある場所
        const eqs = body.match(/[^\\]=/gm)
        const [kvs,keys,values] = [{},[],[]]
        let keyStart = 0
        for (let i=0; i<eqs.length; i++) {
            const key = body.slice(keyStart, eqs[i].index)
            const vkt = body.slice(eqs[i].index+1, i+1<eqs.length ? eqs[i+1].index : body.length)
            const vkts = vkt.split(' ')
//            const nextKey = vtks.slice(-1)
            const value = vkts.slice(0, -1).join(' ')
            kvs[key] = value
            keyStart = eqs[i].index + value.length
        }
        console.log(kvs)
        return kvs
    }
}
window.FenceBlockParser = FenceBlockParser;
})();
