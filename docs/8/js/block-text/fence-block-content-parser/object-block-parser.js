(function(){
class ObjectBlockParser { // フェンスブロック"""author=著者名等をHTML要素<blockquote>に変換する
    constructor() {
//        this._parsers = []
    }
    //is(block, bi) { return 'quote'===block.fence.type }
    is(block, bi) {return Array.isArray(block.fence.ary) && 0 < block.fence.ary.length && block.fence.ary[0].startsWith('obj') }
    //parse(block, bi) { return this.#blockquote(block, bi) }
    //#blockquote(block, bi) {
    parse(block, bi) {
        console.log(block, bi)
        let ary = block.body.text.split('\n')
        ary=ary.map(v=>v.split('\t')).flat()
        for (let delimiter of block.fence.ary.slice(1)) {
            if ('\\t'===delimiter) {ary=ary.map(v=>v.split('\t')).flat()}
            else if ('\s'===delimiter) {ary=ary.map(v=>v.split(';')).flat()}
            else if ('\c'===delimiter) {ary=ary.map(v=>v.split(',')).flat()}
            else if ('\b'===delimiter) {ary=ary.map(v=>v.split(' ')).flat()}
        }
        //ary.reduce((o,v,i)=>o.assign(o,{[v]:ary[i+1]}), {})
        //ary.reduce((o,v,i)=>{if(0===(i%2)){o.assign(o,{[v]:ary[i+1]})}}, {})
        //ary.reduce((o,v,i)=>(1===(i%2)||i===ary.length-1) ? o : Object.assign(o,{[v]:ary[i+1]})}}, {})
        //block.parse.data = ary.reduce((o,v,i)=>(1===(i%2) ? o : Object.assign(o,({[v]:i===ary.length-1 ? null : ary[i+1]}))), {})
        block.parse.data = ary.reduce((o,v,i)=>(1===(i%2) ? o
            : this.#getObj(ary, o, v, i)), {})
//            : Object.assign(o,({[v]:i===ary.length-1 ? null : ary[i+1]}))), {})
        return block.parse.data
        /*
        const param = {aurhot:{name:null, url:null}, work:{name:null, url:null, season:null}, hero:{name:null, url:null}, writer:{comment:null}}
        if (block.fence.arg.ary) {
            param.url = block.fence.arg.ary.filter(a=>a.startsWith('https://'))
        }
        if(block.fence.arg.obj) {
            for (let groupName of ['author','work','hero']) { this.#split(block, param, groupName) }
            if (block.fence.arg.obj.hasOwnProperty('authorName')) { param.author.name = block.fence.arg.obj.authorName }
            if (block.fence.arg.obj.hasOwnProperty('authorUrl')) { param.author.url = block.fence.arg.obj.authorUrl}
            if (block.fence.arg.obj.hasOwnProperty('workName')) { param.work.name = block.fence.arg.obj.workName }
            if (block.fence.arg.obj.hasOwnProperty('workUrl')) { param.work.url = block.fence.arg.obj.workUrl}
            if (block.fence.arg.obj.hasOwnProperty('season')) { param.work.season = block.fence.arg.obj.season }
            if (block.fence.arg.obj.hasOwnProperty('heroName')) { param.hero.name = block.fence.arg.obj.heroName }
            if (block.fence.arg.obj.hasOwnProperty('heroUrl')) { param.hero.url = block.fence.arg.obj.heroUrl}
            if (block.fence.arg.obj.hasOwnProperty('comment')) { param.writer.comment = block.fence.arg.obj.comment}
        }
//        const work = param.work.name && param.work.url ? 
        const code = `<figure data-bi="${bi}" class="quote"><blockquote>${block.boxy.text}</blockquote>${this.#getFigCaption(param)}${this.#getComment(param)}</figure>`
//        const code = `<figure data-bi="${bi}" class="quote"><blockquote>${block.boxy.text}</blockquote><figcaption>${this.#getCite(param)}${this.#getSeason(param)}${this.#getHero(param)}</figcaption>${this.#getComment(param)}</figure>`
//        return `<blockquote data-bi="${bi}"><code>${block.body.text}</code></pre>`
        return code
        */
    }
    #getObj(ary, o, ktvTxt, i) {
        //const ktv = this.#getKeyTypeValue(text)
        const ktv = textbase.Ktv.parse(ktvTxt)
        const valTxt = i===ary.length-1 ? '' : ary[i+1]
        const type = (ktv.type) ? textbase.TypeParser.getType(ktv.type, ktv.def) : textbase.LiteralType.get(valTxt)
        return Object.assign(o,({[ktv.key]:type.deserialize(valTxt)}))
    }
    /*
    #getKeyTypeValue(text) {// key:type=valueを三値に分離する（keyは必須。type,valueは任意）
        const typeIdx = text.indexOf(':')
        const defIdx = text.indexOf('=')
        console.log(typeIdx , defIdx)
        const keyLen = ((-1===typeIdx && -1===defIdx)
            ? text.length
            : ((-1!==typeIdx && -1!==defIdx)
                ? Math.min(typeIdx,defIdx)
                : Math.max(typeIdx,defIdx)))
        console.log(typeIdx, defIdx, keyLen)
        const name = text.slice(0, keyLen)
        const type = -1===typeIdx ? undefined : text.slice(keyLen+1, -1===defIdx ? text.length : defIdx)
        const def = -1===defIdx ? undefined : text.slice(defIdx+1)
        return {key:key, type:type, def:def}
    }
    */
    #getFigCaption(param) {
        const author = this.#getNameUrlHtml(param, 'author')
        if (!author) {return ''}
        return`<figcaption><cite>${author}</cite>${this.#getSeason(param)}${this.#getNameUrlHtml(param, 'hero')}</figcaption>` 
    }
    #getNameUrlHtml(param, groupName) {
        if (param[groupName].name) { return param[groupName].url
            ? `<a href="${param[groupName].url}" target="_blank" rel="noopener noreferrer" data-${groupName}>${param[groupName].name}</a>`
            : `${param[groupName].name}`
        } else {return ''}
    }
    #getSeason(param) { return param.work.season ? `<span data-season>${work.season}</span>` : '' }
    /*
    #getCite(param) {
        if (param.work.name) { return '<cite>' + (param.hero.url
            ? `<a href="${param.work.url}" target="_blank" rel="noopener noreferrer">${param.work.name}</a>`
            : `${param.work.name}`)
            + '<cite>'
        } else {return ''}
    }
    #getSeason(param) { return param.work.season ? `<span data-season>${work.season}</span>` : '' }
    #getHero(param) {
        if (param.hero.name) { return param.work.url
            ? `<a href="${param.hero.url}" target="_blank" rel="noopener noreferrer">${param.hero.name}</a>`
            : `${param.hero.name}`
        } else {return ''}
    }
    */
    #getComment(param) {
        return param.writer.comment
            ? `<div data-comment>${param.writer.comment}</div>`
            : ''
    }
    #split(block, param, groupName) { // groupName:author/work    """work=作品名,https://... season=一期三話
        if (block.fence.arg.obj.hasOwnProperty(groupName)) {
            const vals = block.fence.arg.obj[groupName].split(',')
            param[groupName].name = vals[0]
            if (1 < vals.length) {param[groupName].url = vals[1]}
        }
    }
    #hljs(block, bi) {
        const code = block.body.text
        const language = block.fence.ary[0]
        return hljs.highlight(code, {language:language}) 
    }
    /*
    add(...parsers) {
        for (let i=0; i<parsers.length; i++) {
            if (['is', 'parse'].every(k=>k in parses[i])) {this._parsers.push(parsers[i])}
            else{console.warn(`FenceBlockContentParserを追加するとき、その対象クラスインスタンスは、is,parseの2メソッドを持っているべきです。:`,parser[i])}
        }
    }
    */
    /*
    #getParse(block, bi) {
        for (let p=0; p<this._parsers.length; p++) {
            if (this._parsers[p].is(block, bi)) {return this._parsers[p]}
        }
        return null
    }
    */
}
window.ObjectBlockParser = ObjectBlockParser;
})();
