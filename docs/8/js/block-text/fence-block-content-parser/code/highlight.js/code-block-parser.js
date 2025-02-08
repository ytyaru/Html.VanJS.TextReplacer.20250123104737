(function(){
class HljsAlias {
    constructor() {
        this._alias = new Map([
            ['asciidoc', ['ad', 'adoc']],
            ['xml', ['html']],
            ['c', ['h']],
            ['cpp', ['c++','h++','hpp']],
            ['csharp', ['c#','cs']],
            ['fsharp', ['f#','fs']],
            ['javascript', ['js']],
            ['markdown', ['md']],
            ['makefile', ['mk']],
            ['python-repl', ['py-repl']],
            ['python', ['py']],
            ['ruby', ['rb']],
            ['rust', ['rs']],
            ['shell', ['sh']],
            ['typescript', ['ts']],
        ]);
    }
    getId(name) {
        name = name.toLowerCase();
        for (let [key, aliases] of this._alias.entries()) {
            if (key===name || aliases.includes(name)) {return key}
        }
        return name
    }
}
window.HljsAlias = new HljsAlias();
class CodeBlockParser { // フェンスブロック```html等をHTML要素<pre><code>に変換する
    constructor() {
        this._parsers = []
    }
    is(block, bi) { return 'code'===block.fence.type }
    add(...parsers) {
        for (let i=0; i<parsers.length; i++) {
            if (['is', 'parse'].every(k=>k in parses[i])) {this._parsers.push(parsers[i])}
            else{console.warn(`FenceBlockContentParserを追加するとき、その対象クラスインスタンスは、is,parseの2メソッドを持っているべきです。:`,parser[i])}
        }
    }
    parse(block, bi) {
        block.parse.html = (block.fence.ary) ? this.#hljs(block, bi) : this.#pre(block, bi);
        /*
        for (let b=0; b<blocks.length; b++) {
            for (let p=0; p<this._parsers.length; p++) {
                blocks[b].parse.html = (blocks[b].fence.ary) ? this.#hljs(block, bi) : this.#pre(blocks[b], b);
//                const parser = this.#getParser(blocks[b], b)
            }
        }
        */
    }
    #pre(block, bi) { return `<pre data-bi="${bi}"><code>${block.body.text}</code></pre>` }
    #hljs(block, bi) {
        const code = block.body.text
//        const language = block.fence.ary[0]
        const language = window.HljsAlias.getId(block.fence.ary[0])
        console.log(bi, language, block.body.text)
        return `<pre data-bi="${bi}" class="hljs wrap"><code class="language-${language}">${block.body.text.sanitize()}</code></pre>`
        //return `<pre data-bi="${bi}" class="hljs wrap"><code class="language-${language}">${this.#escapeHtml(block.body.text)}</code></pre>`
        //return `<pre data-bi="${bi}" class="hljs wrap"><code class="language-${language}">${block.body.text}</code></pre>`
        //return hljs.highlight(code, {language:language}) 
    }
    /*
    #getParse(block, bi) {
        for (let p=0; p<this._parsers.length; p++) {
            if (this._parsers[p].is(block, bi)) {return this._parsers[p]}
        }
        return null
    }
    */
    /*
    #escapeHtml(html) { // <pre><code>内にHTMLコードを入力するとき、<等の記号をエスケープすることで要素変換されずその字自体を出す
        if(typeof html === 'string' || html instanceof String) {
            return html.replace(/[&'`"<>]/g, (match)=>{
                return {
                    '&': '&amp;',
                    "'": '&#x27;',
                    '`': '&#x60;',
                    '"': '&quot;',
                    '<': '&lt;',
                    '>': '&gt;',
                }[match]
            });
        }
    }
    */
}
window.CodeBlockParser = CodeBlockParser;
})();
