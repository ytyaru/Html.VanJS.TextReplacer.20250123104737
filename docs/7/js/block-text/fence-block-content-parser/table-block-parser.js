(function(){
class TableBlockParser { // フェンスブロック"""author=著者名等をHTML要素<blockquote>に変換する
    constructor() {
//        this._parsers = []
    }
    is(block, bi) { return 'quote'===block.fence.type }
    //parse(block, bi) { return this.#blockquote(block, bi) }
    //#blockquote(block, bi) {
    parse(block, bi) {
        console.log(block, bi)
        return [{}]
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
window.TableBlockParser = TableBlockParser;
})();
