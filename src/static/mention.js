'use strict'

module.exports = class Mention {
    constructor(sent, txt, tok, annot, ind, ent)
    {
        this._sentence = sent;
        this._text = txt;
        this._tokens = tok;
        this._annotate_type = annot;
        this._index = ind;
        
        let temp = ent.merging_history.original.phrases[ind];
        let ph = temp[1].split("_");
        this._political_direction = ph[1];
    }

    get political_direction()
    {
        return this._political_direction;
    }
}