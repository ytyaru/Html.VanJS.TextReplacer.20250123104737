(function(){
class CodeBlockParser { // フェンスブロック```html等をHTML要素<pre><code>に変換する
    constructor() {
        this._parsers = []
    }
    is(block) { return 'code'===block.fence.type }
    add(...parsers) {
        for (let i=0; i<parsers.length; i++) {
            if (['is', 'parse'].every(k=>k in parses[i])) {this._parsers.push(parsers[i])}
            else{console.warn(`FenceBlockContentParserを追加するとき、その対象クラスインスタンスは、is,parseの2メソッドを持っているべきです。:`,parser[i])}
        }
    }
    parse(blocks) {
        for (let b=0; b<blocks.length; b++) {
            for (let p=0; p<this._parsers.length; p++) {
                if (this._parsers[p].is(blocks[b])) {this._parsers[p].parse(blocks[b])}
            }
        }
    }
}
window.FenceBlockContentParserManager = FenceBlockContentParserManager;
})();
