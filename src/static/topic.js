'use strict'

module.exports = class Topic
{
    constructor(data, topic_name)
    {
        this.title = topic_name;
        this.name = this.set_topic_name(topic_name);
        this.index = this.set_topic_index(data, topic_name);
        this.blsu;
    }
    /**
     * Returns the internal index of this topic in the json data
     * @param {JSON-Oject} data - JSON data 
     * @param {String} topic_name - Topic Indentificator     
     * @returns - Integer of topic index
     */
    set_topic_index(data, topic_name)
    {
        var index = 0, counter = 0;
        while( counter < data.length)
        {
            if(data[counter].topic == topic_name)
            {
                index = counter;
                break;
            }
            counter++;
        }
        return index;
    }
    /**
     * Returns the topic name without any numbers or additional information
     * @param {String} title - Topic of the article
     * @returns - String of topic name
     */
    set_topic_name(title)
    {   
        let temp = title.split[";"];
        let text = temp[0].split("_");
        return text[1];
    }
    set_entities()
    {

    }
    set_articles(data)
    {
        var Document = require("document.js");
        var document_array = [];
        data[this.title].document.forEach(art => {
            article_name = this.title + ";" + art.title;
            doc = new Document(data, article_name, this.title);
            document_array.push(doc);
        });
    }
}
