;(function(){
/*
class UrlBlockParser {
    static parse(block) {
        return ('fence' in block && block.fence.ary && 'url'===block.fence.ary[0])
            ? ({base:UrlBase.read(block), items:UrlItem.read(block)})
            : null
    }
}
*/
class UrlBlockParser {
    //is(block, bi) { return ('fence' in block && block.fence.ary && 'url'===block.fence.type) }
    is(block, bi) { console.error(block, 'fence' in block, 'url'===block.header.text || block.header.text.startsWith('url ')); return ('fence' in block && 'url'===block.header.text || block.header.text.startsWith('url ')) }
    //parse(block, bi) { return ({base:UrlBase.read(block), items:UrlItem.read(block)}) }
    parse(block, bi) { this.#remakeHeader(block); return ({base:UrlBase.read(block), items:UrlItem.read(block)}); }
    #remakeHeader(block) {
        console.error(block)
        /*
        const values = block.header.text.split(' '); // url baseURL識別子 baseURL(https://) text=
        const min = Math.max(values.length, 3);
        const args = values.slice(1, min); // baseURL識別子 baseURL の二つだけはそのまま取得する
        //block.fence.ary = args;
        */
        block.fence.ary = block.header.text.split(' ');
        block.fence.obj = ({base:UrlBase.read(block), items:UrlItem.read(block)});
    }
}
class UrlBase {
    static read(block) {
        const obj = {}
        const params = block.fence.ary.slice(1)
        if (0 < params.length) obj.id = params[0]
        if (1 < params.length) obj.url = params[1]
        return obj;
    }
}
class UrlItem {
    static read(block) {return block.body.text.split('\n').filter(v=>v).map(line=>this.#line(line))}
    /*
    static read(block) {
        for (let line of block.body.text.split('\n')) {
        }
    }
    */
    static #line(line) {
        const values = line.split('\t')
        if (this.#isQuote(values[0])) {throw new TypeError(`先頭項目に'や"は使えません。`)}
        if (0===values.length) {return this.#one(values)}
        else if (1===values.length) {return this.#two(values)}
        else if (2===values.length) {return this.#three(values)}
        else if (3===values.length) {return this.#four(values)}
        else {console.log(line);throw new TypeError(`UrlItem.read解析エラー。TABコード数は0〜3までです。`, line)}
    }
    static #one(values) { return this.#make(values[0]) } // readSlugOnly
    static #two(vs) { // slug+title / slug+text / id+slug
        console.log(`#two`, vs)
        if (this.#isQuote(vs[1])){return this.#make(vs[0], vs[0], vs[1], vs[1])} //slug+title
        else if (vs[1].startsWith('title=')) {const two=vs[1].replace(/^title=/,'');return this.#make(vs[0], vs[0], two, two)} // slug+title
        else if (vs[1].startsWith('text=')) {const two=vs[1].replace(/^title=/,'');return this.#make(vs[0], vs[0], vs[0], two)} // slug+text
        else {throw new TypeError(`UrlItem.#two() 二番目は""で囲まれているかtitle= text=のいずれかで始まるべきです。`)}
    }
    static #three(values) { // slug+title+text / id+slug+title / id+slug+text
        console.log(`#three`, values)
        if (this.#isQuote(vs[1])){
            if (this.#isQuote(vs[2])) {return this.#make(vs[0], vs[0], vs[1], vs[2])}//slug+title+text
            else {throw new TypeError(`UrlItem.#three() 二番目が""で囲われているなら三番目の要素も""で囲うべきです。`)}
        } else {
            const [id, slug] = [vs[0], vs[1]];
            const title = this.#getString('title', vs[2])
            const text = vs[2].startsWith('text=') ? vs[2].replace(/^text=/,'') : id;
            return this.#make(slug, id, title, text);
        }
    }
    static #four(vs) { // id+slug+title+text
        console.log(`#four`, vs)
        if (this.#isQuote(vs[1])) {throw new TypeError(`UrlItem.#four() 二番目はslugであり"を使えません。`)}
        const [id, slug] = [vs[0], vs[1]];
        const title = this.#getString('title', vs[2]);
        const text = this.#getString('text', vs[3]);
        return this.#make(slug, id, title, text);
    }
    static #isQuote(v) {return `' "`.split(' ').some(q=>v.startsWith(q) && v.endsWith(q)) }
    static #hasTitleKey(v) {return v.replace(/^title=/,'')}
    static #getString(type, v) {
        console.log(type, v)
        if (!v) {return v} // undefinedならそのまま未設定であると判断して返す
        else if (this.#isQuote(v)) {return v.match(/^"(.+)"$/)[1]}
        else if (v.startsWith(`${type}=`)) {return v.replace(new RegExp(`^${type}=`),'')}
        else {throw new TypeError(`文字列ではありません。`, type, v)}
    }
    static #make(slug, id, title, text) { return {
        slug: slug,
        id: id ?? id ?? slug,
        title: title ?? id ?? slug,
        text: text ?? title ?? id ?? slug,
    } }
}
window.UrlBlockParser = UrlBlockParser;
})();

