'use strict'

module.exports = class Mention {
    constructor(sent, txt, tok, annot, ind, ent)
    {
        this.sentence = sent;
        this.text = txt;
        this.tokens = tok;
        this.annotate_type = annot;
        this.index = ind;
        this._political_direction = null;
        
        //noch zu try catch ummodelieren
        let temp = ent.merging_history.phrases[ind];
        if(this.text == ent.merging_history.phrases[ind][0])
        {
            let ph = temp[1].split("_");
            this._political_direction = ph[1];
        }
        else {console.log("Error in phrases and text index")}

    }

    get political_direction()
    {
        return this._political_direction;
    }
}