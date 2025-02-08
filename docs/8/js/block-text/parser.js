;(function(){// 複数行のブロック構造をフェンスに持つテキストを、JSのオブジェクトとその配列に変換する。
//const blocks = BlockText.parse(text)
//const text = BlockText.stringify(blocks)
//class Parser { // 原稿をブロックにパースする
class BlockText { // 原稿をブロックにパースする
    constructor() {
        this._script = null; // 改行コード統一等をした原稿全文
        this._blocks = []; // 原稿をパースした結果
        this._bP = new BlockParser()
    }
    get script() { return this._script }
    get blocks() { return this._blocks }
    get textBlockPreprocess() {return this._bP.textBlockPreprocess}
    set textBlockPreprocess(fn) {this._bP.textBlockPreprocess=fn}
    parse(text) { // 原稿をブロックに変換する（script:原稿（簡易構文が書いてあるstring））
        this._script = this.#trimNewline(this.#unifyNewline(text))
        console.log(this._script)
        this._blocks = this._bP.parse(this._script)
        return this._blocks
    }
    stringify(blocks) {// ブロックを原稿に変換する
        throw new Error(`未実装`)
    }
    #unifyNewline(script) { return script.replaceAll(/(\r\n|\r)/gm, '\n') } // OS毎に異なる改行コードを内部で統一する
    #trimNewline(script) { return script.replace(/^(\n)+/,'').replace(/(\n)+$/,'') } // 前後にある改行コードを削除する
}
class BlockParser {
    constructor() {
        this._fbP = new FenceBlockParser()
        //this._tbP = new TextBlockParser()
        this._lP = new LineParser()
    }
    get textBlockPreprocess() {return this._tbP.preprocess}
    set textBlockPreprocess(fn) {this._tbP.preprocess=fn}
    parse(script) {
        const fbs = this._fbP.parse(script)
        //const tbs = this._tbP.parse(script, fbs)
        const ls = this._lP.parse(script, fbs)
        console.log(`fenceBlocks:`, fbs)
        //console.log(`textBlocks:`, tbs)
        console.log(`textBlocks:`, ls)
        //const blocks = [...fbs, ...tbs].sort((a,b)=>a.script.start - b.script.start)
        const blocks = [...fbs, ...ls].sort((a,b)=>a.script.start - b.script.start)
        //for (let i=0; i<blocks.length; i++){blocks[i].index=i}
        return blocks
        //return [...fbs, ...tbs].sort((a,b)=>a.script.start - b.script.start)
    }
}
window.BlockText = BlockText;
})();
