'use strict'

export class Document {
    constructor(data, article, topic, number)
    {
        //complete identifier topic;article
        this._identifier = article;
        this._number = number;

        var tmp = article.split(";");
        
        this._title = tmp[1];
        
        var result = data[tmp[0]].documents.find( art =>{
            return art.title === tmp[1];
        });
        this._name = result.name;
        
        tmp = this._name.split("_");
        this._political_direction = tmp[1];
        
        this._topic = topic;
        this._my_entities = [];
        this._marked_entities = [];
        this._text_array = this.set_article_text(data);
        this._marked_text = null;
    }

    /**
     * Build a text out of the provided Jason dataset 
     * @param {Object} data - JSON Data 
     * @returns 2-Dimensional array with article text divided in sentences with words
     */
    set_article_text(data)
    {
        let temp_text = "";
        let sentence_symbols = [".",",","?","!",";",":","%","€","$","\’","\""];
        let sentence_array = [], text_array = [];
        
        let article = data[this._topic].documents.find( art => {
            return art.name === this._name;
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
    /**
     * Adds a reference of an Entity Object to the article
     * @param {Object} ent - Entity  
     */
    
    add_entity(ent)
    {
        this._my_entities.push(ent);
    }
    /**
     * Passes an Entity Object to to the article that is to be marked
     * @param {Object} ent - Entity   
     */
    mark_entity(ent)
    {
        this._marked_entities.push(ent);
    }
    /**
     * 
     * @param {Object} ent
     * @param {Boolean} all 
     */
    unmark_entity(ent, all = false)
    {   
        if(all)
        {
            this.marked_entities.length = 0;
        }
        else 
        {
        this._marked_entities = this._marked_entities.filter(function( ele ){
            return ele.identifier !== ent.identifier;
        })
    }
    }

    mark_text()
    {
        let marked_text = new Array([]);
        let sentence_text = [];
        const enti = this._marked_entities[0];
        let sent_ent = [];
        //already marked = true/false wenn schon markiert
        //check ob markierter text oder nicht markierteer text verwendet werden soll

            for(let i = 0; i < this._text_array.length; i++)
            {    
                sent_ent = enti.mentions_in_sentence(i);
                let index = 0;  
                console.log(i);
                for(let j = 0; j < this._text_array[i].length; j++)
                {
                    if(index < sent_ent.length && (sent_ent[index].tokens[0] == j || sent_ent[index].tokens[sent_ent[index].tokens.length -1] == j))
                    {
                        console.log("nicht pups");
                        if(sent_ent[index].tokens[0] == j)
                        {
                            let tmp_text = "<mark entity=\"" + this.clean_topic.toLowerCase() +"-" + enti.id_number+ "\">" + this._text_array[i][j];
                            sentence_text[j] = tmp_text;
                            //console.log(sentence_text[j] + "   "+j)
                        }
                        else
                        {
                            let tmp_text = this._text_array[i][j] + ("</mark>");
                            sentence_text[j] = tmp_text;
                            index ++;
                            //console.log(sentence_text[j] + "   "+j)
                        }
                        
                    }
                    else
                    {
                        let temp = this._text_array[i][j];
                        //console.log("j: " + j +"  temp = " + temp);
                        sentence_text[j] = temp;
                    }
                     
                };
                console.log(sentence_text);
                marked_text.push(sentence_text);
              
                sentence_text = [];
                index = 0;
            };
        this._marked_text = marked_text;    
    }

    set_text(node) 
    // check ob text vorher masrkiert werden muss odfer nicht
    {
        var text_return = "";
        var parsed_text = [];
            
        if(this._marked_entities.length)
        {   
            this.mark_text();
            parsed_text = this._marked_text;
        }
        else
        {
            parsed_text = this._text_array;
        }
        console.log(parsed_text);
        //console.log(this._marked_entities.length);
        for(const [i, sentence] of parsed_text.entries())
            {  
                if(!i)
                {
                    continue;
                }  
                sentence.forEach(word => {
                    text_return += word;
                });
            };        
        node.textContent = text_return;
    }
    
    get statistics_of_article()
    {   
        var mention_dict = {
            names : [],
            numbers : [],
            colour : []
        }
        var mentions = [];
        this._my_entities.forEach( ent => {
            mention_dict.names.push(ent.formatted_name);
            mentions = ent.get_mentions_for_article(this.political_direction)
            mention_dict.numbers.push(mentions.length);
            mention_dict.colour.push(ent.colour);
        })
        return mention_dict;
    }

    get political_direction()
    {
        return this._political_direction;
    }

    get id()
    {
        return this._identifier;
    }

    get name()
    {
        return this._name;
    }

    get topic()
    {
        return this._topic;
    }

    get title()
    {
        return this._title;
    }

    get clean_topic()
    {   
        var ret = this._topic;
        return ret.slice(0, -17).replace(/[-,_,.,0,1,2,3,4,5,6,7,8,9]/g, "");
    }

    get entities()
    {
        return this._my_entities;
    }

    get marked_entities()
    {
        return this._marked_entities;
    }

    get id_number()
    {
        return this._number;
    }
}
