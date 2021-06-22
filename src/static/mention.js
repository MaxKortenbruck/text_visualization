'use strict'

module.exports = class Mention {
    constructor(sent, txt, tok, annot, ind, ent)
    {
        this.sentence = sent;
        this.text = txt;
        this.tokens = tok;
        this.annotate_type = annot;
        this.index = ind;
        
        let temp = ent.merging_history.phrases[ind];
        let ph = temp[1].split("_");
        this.political_direction = ph[1];
    }
}