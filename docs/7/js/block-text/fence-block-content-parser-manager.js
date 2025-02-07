(function(){
class FenceBlockContentParserManager { // フェンスブロックの内容をHTML,Object,Array等に変換するコードの管理者
    constructor() {
        this._parsers = []
    }
    add(...parsers) {
        for (let i=0; i<parsers.length; i++) {
            if (['is', 'parse'].every(k=>k in parsers[i])) {this._parsers.push(parsers[i])}
            else{console.warn(`FenceBlockContentParserを追加するとき、その対象クラスインスタンスは、is,parseの2メソッドを持っているべきです。:`, parsers[i])}
        }
    }
    parse(blocks) {
        for (let b=0; b<blocks.length; b++) {
            for (let p=0; p<this._parsers.length; p++) {
                if (this._parsers[p].is(blocks[b], b)) {this._parsers[p].parse(blocks[b], b)}
            }
        }
    }
}
window.FenceBlockContentParserManager = FenceBlockContentParserManager;
})();
