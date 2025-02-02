class Serializer {
    read(text) {
        console.log(/^ary[\.: =]/.test(text))
        if (/^ary[\.: =]/.test(text)) {return this.#ary(text)}
    }
    #ary(text) {
        const match = text.match(/^ary(?<name>\.[_a-zA-Z][_a-zA-Z0-9]*)?(?<type>:(s|i|b|f|str|int|bln|flt))?(?<defVal>=(.+))? (?<valueText>.+)/)
        if (match) {
            console.log('OK', match)
            const textValues = match.groups.valueText.split(' ')
            return textValues 
        } else {console.log('NO')}
    }
}

const s = new Serializer()
console.log(s.read('ary A B C'))
s.read('ary A B C')
s.read('ary 1 2 3')
