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
        let text = this.set_article_text(data);
        this._text_array = text; 
        this._marked_text = text;
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
            this._marked_entities = [];
        }
        else 
        {
        this._marked_entities = this._marked_entities.filter(function( ele ){
            return ele.identifier !== ent.identifier;
        });

        }
        console.log(this._marked_entities);
    }

    mark_text(entity = null)
    {
        let marked_text = [];
        let sentence_text = [];
        let sent_ent = [];
        var entities = [];
        //already marked = true/false wenn schon markiert
        //check ob markierter text oder nicht markierteer text verwendet werden soll
        console.log(entity);
        if(entity != null)
        {
            entities.push(entity);
        }
        else
        {
            entities = this._marked_entities;
            console.log("partypups");
        }

        entities.forEach(enti => {
            //console.log(this._marked_text);
            //console.log(this._marked_text[1][0]);
            for(let i = 0; i < this._marked_text.length; i++)
            {    
                sent_ent = enti.mentions_in_sentence(i);
                let index = 0;  
                //console.log(i);
                for(let j = 0; j < this._marked_text[i].length; j++)
                {
                    if(index < sent_ent.length && (sent_ent[index].tokens[0] == j || sent_ent[index].tokens[sent_ent[index].tokens.length -1] == j))
                    {
                        //console.log("nicht pups");
                        if(sent_ent[index].tokens[0] == j)
                        {
                            //console.log(this._marked_text[i][j]);
                            let tmp_text = "<span entity=\"" + this.clean_topic.toLowerCase() +"-" + enti.id_number+ "\">" + this._marked_text[i][j];
                            //console.log(this._marked_text[i][j]);
                            if(sent_ent[index].tokens.length == 1)
                            {
                                tmp_text += "</span>";
                            }
                            sentence_text[j] = tmp_text;
                        }
                        else
                        {
                            let tmp_text = this._marked_text[i][j] + ("</span>");
                            sentence_text[j] = tmp_text;
                            index ++;
                            //console.log(sentence_text[j] + "   "+j)
                        }
            
                        
                    }
                    else
                    {
                        let temp = this._marked_text[i][j];
                        //console.log("j: " + j +"  temp = " + temp);
                        sentence_text[j] = temp;
                    }
                     
                };
                //console.log(sentence_text);
                marked_text.push(sentence_text);
              
                sentence_text = [];
                index = 0;
            };
        });
            //console.log(marked_text);
        this._marked_text = marked_text;    
    }

    set_text(node, entity = null) 
    // check ob text vorher masrkiert werden muss odfer nicht
    {
        var text_return = "";
        var parsed_text = [];
            
        if(this._marked_entities.length > 0)
        {   
            this.mark_text(entity);
            parsed_text = this._marked_text;
        }
        else
        {
            parsed_text = this._text_array;
            this._marked_text = this._text_array;
        }
        //console.log(parsed_text);
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
        node.innerHTML = text_return;
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
