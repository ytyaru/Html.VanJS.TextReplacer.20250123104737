class TextBlockParser { // 原稿のうち自然言語の部分をブロックに変換する
    constructor(preprocess=null) {
        this.preprocess = preprocess;
    }
    get preprocess() {return this._preprocess}
    set preprocess(v) {if ('function'===typeof v){this._preprocess = v}}
    parse(script, fbs) { // script:原稿（簡易構文）, fbs:フェンスブロック配列
        console.log(`preprocess:`,this.preprocess)
        const walls = this.#getWalls(script, fbs)
        console.log(`walls:`, walls)
        return this.#getBlocks(walls)
    }
    #getWalls(script, fbs) { // script:原稿（簡易構文）, fbs:フェンスブロック配列
        const walls = []
        let [start, end] = [0, 0]
        for (let f=0; f<fbs.length; f++) {
            end = fbs[f].script.start
            walls.push(this.#makeWall(script, fbs, start, end))
            start = fbs[f].script.end
        }
        end = script.length
        walls.push(this.#makeWall(script, fbs, start, end))
        //return walls
        return walls.filter(w=>w.script.trim())
    }
    #makeWall(script, fbs, start, end) {
        const wall = {start:start, end:end, script:script.slice(start, end)}
        wall.html = this.#parseWall(wall.script, fbs)
        return wall
    }
    #parseWall(script, fbs) {
        const html = BraceParser.parse(CodeParser.parse(HrParser.parse(HeadingParser.parse(script))))
        return (this.preprocess) ? this.preprocess(html, fbs) : html;
    }
    #getBlocks(walls) {
        const [blocks] = [[]]
//        console.log(`walls.length:${walls.length}`)
        for (let w=0; w<walls.length; w++) {
            const match = {
                scripts: [...walls[w].script.matchAll(/[\n]{2,}/gm)],
                htmls: walls[w].html ? [...walls[w].html.matchAll(/[\n]{2,}/gm)] : null,
            }
//            console.log(`wall match scripts:`,match.scripts, walls[w].script)
//            console.log(`wall match htmls:`,match.htmls, walls[w].html)
            console.log(match.htmls, walls[w].html, walls[w].script)
            console.log(`match num equal: ${match.scripts.length} === ${match.htmls.length}`)
            console.assert(match.scripts.length === match.htmls.length)
            const idx = {script:{start:0, end:0}, html:{start:0, end:0}}
            for (let m=0; m<match.scripts.length; m++) {
//                console.log(`m:${m}`)
                idx.script.end = match.scripts[m].index
                idx.html.end = match.htmls ? match.htmls[m].index : 0
                blocks.push(this.#makeBlock(walls[w], idx))
                idx.script.start = match.scripts[m].index + match.scripts[m][0].length
                idx.html.start = match.htmls ? match.htmls[m].index + match.htmls[m][0].length : 0
            }
            if (blocks.length < 1) {continue}
            idx.script.end = walls[w].script.length
            idx.html.end = walls[w].html ? walls[w].html.length : 0
            const lastBlock = {
                script: {
                    start: blocks.slice(-1)[0].script.end,
                    end: walls[w].end + walls[w].script.length,
                    text: null,
                },
                parse: {html: null},
            }
            lastBlock.script.text = walls[w].script.slice(match.scripts.slice(-1)[0].index + match.scripts.slice(-1)[0][0].length)
            //lastBlock.parse.html = walls[w].html ? walls[w].html.slice(match.htmls.slice(-1)[0].index + match.htmls.slice(-1)[0][0].length) : null
            lastBlock.parse.html = walls[w].html ? ParagraphParser.parse(walls[w].html.slice(match.htmls.slice(-1)[0].index + match.htmls.slice(-1)[0][0].length)) : null
            blocks.push(lastBlock)
        }
        return blocks.sort((a,b)=>a.script.start - b.script.start)
    }
    #makeBlock(wall, idx) {
//        console.log(idx.html.start, idx.html.end)
        return {
            script: {
                start: wall.start + idx.script.start,
                end: wall.start + idx.script.end,
                text: wall.script.slice(idx.script.start, idx.script.end),
            },
            parse: {
                //html: wall.html ? wall.html.slice(idx.html.start, idx.html.end) : null,
                html: wall.html ? ParagraphParser.parse(wall.html.slice(idx.html.start, idx.html.end)) : null,
            },
        }
    }
}

