'use strict'

class Topic
{
    constructor(data, topic_name)
    {
        this.name = topic_name;
        this.index = this.set_topic_index(data, topic_name);
        this.blsu;
    }
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
}