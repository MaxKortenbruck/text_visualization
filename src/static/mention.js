'use strict'

export class Mention {
    constructor(sent, txt, tok, annot, ind, ent)
    {
        this._sentence = sent;
        this._text = txt;
        this._tokens = tok;
        this._annotate_type = annot;
        this._index = ind;
        this._political_direction_of_article = null;
        
        //noch zu try catch ummodelieren
        let temp = ent.merging_history.original.phrases[ind];
        if(this._text == ent.merging_history.original.phrases[ind][0])
        {
            let ph = temp[1].split("_");
            this._political_direction_of_article = ph[1];
        }
        else {console.log("Error in phrases and text index")}

    }

    get political_direction_of_article()
    {
        return this._political_direction_of_article;
    }
    
    get text()
    {
        return this._text;
    }
    
    get tokens()
    {
        return this._tokens;
    }

    get annotate_type()
    {
        return this._annotate_type;
    }

    get index()
    {
        return this._index;
    }
}