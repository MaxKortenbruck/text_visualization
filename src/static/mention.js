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
        //console.log(txt)
        //console.log(this._sentence);
        let temp = ent.merging_history.original.phrases[ind];
        if(this._text == ent.merging_history.original.phrases[ind][0])
        {
            let ph = temp[1].split("_");
            this._political_direction_of_article = ph[1];
            //console.log(this._political_direction_of_article);
        }
        else {console.log("Error in phrases and text index")}

        //this._normalized_text = this.set_norm_text(this._text);

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

    get normalized_text()
    {
        let lower = this.text.toLowerCase();
        //console.log("normalize");
        //console.log(lower);
        if(lower[0] == "the"){lower.shift()}

        let splt = lower.split(" ")
        for(let i = 0; i < splt.length; i++)
        {
            splt[i] = splt[i].replace(/[´,`,;,.,,,",:,!.?,(,)]/g, "");
        }
        //console.log(splt);
        if(splt[0] == "the")
        {splt.shift()};

        return splt.join(" ");
    }

    get sentence()
    {
        return this._sentence;
    }
}