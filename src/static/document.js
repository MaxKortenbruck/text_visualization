'use strict'

module.exports = class Document {
    constructor(data, article, topic)
    {
        //complete identifier topic;article
        this.title = article;
        this.name = this.set_document_name(data, article);
        this.political_direction = set_political_direction();
        this.topic = topic;
        this.my_entities;
        this.marked_entities;
        this.text_array = this.set_article_text(data);
    }

    /**
     * Set the article name from JSON data in format like 6_LL
     * @param {JSON-Object} data - JSON dataset
     * @returns String with article name
     */
    set_document_name(data, article)
    {
        let identif = article.split(";");
        let result = data[identif[0]].documents.find( art =>{
            return art.title === identif[1];
        });
        return result.name;
    }

    /**
     * 
     * @returns String of text array
     */
    set_political_direction()
    {
        let text = this.name.split["_"];
        return text[1];
    }

    /**
     * Build a text out of the provided Jason dataset 
     * @param {JSON-Object} data - JSON Data 
     * @returns 2-Dimensional array with article text divided in sentences with words
     */
    set_article_text(data)
    {
        let temp_text = "";
        let sentence_symbols = [".",",","?","!",";",":","%","€","$","\’","\""];
        let sentence_array = [], text_array = [];
        
        let article = data[this.topic].documents.find( art => {
            return art.name === this.name;
        })
        let text = article.text;
        text.forEach(sentence => {
            sentence.forEach(word => { 
                if(!sentence_symbols.includes(word["word"]))
                {
                    temp_text += " ";
                }
                temp_text += word["word"];
                sentence_array.push(temp_text);
                temp_text = "";    
            });
        text_array.push(sentence_array);
        sentence_array = [];
        });
        return text_array;
    }
    add_entity(ent)
    {
        this.my_entities.push(ent);
    }
    mark_entity(ent)
    {
        this.marked_entities.push(ent.identifier);
    }
    unmark_entity(ent)
    {
        this.marked_entities = this.marked_entities.filter(function( ele ){
            return ele.identifier !== ent.identifier;
        })
    }
}