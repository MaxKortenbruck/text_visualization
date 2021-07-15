'use strict'

import {Entity} from "./entity.js";
import {Document} from "./document.js";
//import {color} from "./echarts.min.js";

var colour_string = '#bf001a, #73003d, #da39e6, #392080, #7c87a6, #8fafbf, #80ffe5, #8fbf96, #2e331a, #e5bf73, #d97736, #4c0a00, #f23d55, #f279ba, #792080, #6953a6, #005ce6, #69818c, #4d6661, #608064, #a7b300, #b29559, #995426, #ff5940, #661a24, #b35989, #cc00ff, #d0bfff, #001433, #00c2f2, #00ffaa, #bfffbf, #3b4000, #7f6a40, #4c2a13, #d97b6c, #8c464f, #b3869e, #470059, #1f00e6, #132a4d, #005266, #00b377, #89f279, #F0FF29, #403520, #f2aa79, #99574d, #66333a, #d90091, #361040, #070033, #79aaf2, #268299, #165943, #459926, #c5cc66, #e6d2ac, #a67453, #4d3c39, #b3868c, #8c005e, #da79f2, #0000b3, #5374a6, #66b8cc, #99ccbb, #304d26, #bcbf8f, #8c8169, #f2ceb6, #332826, #7f0022, #4d0033, #45264d, #0000a6, #395073, #1a2e33, #698c81, #5ce600, #8a8c69, #d97400, #b39886, #ff0000, #33000e, #592d4a, #e6b6f2, #4040ff, #b6cef2, #bff2ff, #30403a, #315916, #8c8300, #a65800, #594c43, #e50000, #ff80a2, #402035, #3d3040, #3333cc, #606c80, #4d6166, #468c6c, #628c46, #595300, #663600, #bf3300, #d90000, #bf6079, #f2b6de, #220033, #7373e6, #39414d, #005f66, #1a3327, #3d7300, #333000, #ffa640, #661b00, #730000, #331a20, #ff00cc, #a336d9, #404080, #0081f2, #299da6, #bfffe1, #c3ff80, #f2e63d, #cc8533, #f26d3d, #400000, #f2b6c6, #a60085, #603973, #202040, #0058a6, #80f7ff, #004d1f, #93bf60, #a6a053, #7f5320, #a64b29, #a62929, #664d53, #660052, #2b1a33, #565673, #003d73, #203e40, #003314, #2d3326, #736f39, #4c3213, #7f3920, #ff8080, #d90057, #330029, #8800ff, #39394d, #0d2133, #7ca3a6, #33cc70, #aaff00, #e5b800, #33210d, #592816, #b25959, #a60042, #cc33ad, #520099, #262633, #80c4ff, #00ccbe, #79f2aa, #223300, #bfa330, #ffc480, #33170d, #402020, #4c001f, #ff80e5, #6c29a6, #606cbf, #0091d9, #004d47, #00bf33, #99cc33, #ffe680, #664e33, #e59173, #ffbfbf, #cc3370, #bf60ac, #9c66cc, #a3aad9, #004d73, #003330, #435949, #eaffbf, #66614d, #bfa98f, #664133, #806060, #992654, #664d61, #2e0073, #001859, #297ca6, #208079, #40ff59, #cef23d, #f2a200, #403830, #402820, #733950, #8c4688, #311659, #294ba6, #13394d, #b6f2ee, #1d7328, #829926, #593c00, #e55c00, #d9b1a3, #403036, #8c698a, #a38fbf, #1a2e66, #66aacc, #00f2c2, #59b365, #57661a, #cc9933, #b24700, #997d73, #f20081, #9b00a6, #14004d, #80a2ff, #406a80, #00a685, #33663a, #50592d, #997326, #662900, #991400';
var colour_array = colour_string_to_array(colour_string);


function colour_string_to_array(colour_string)
{
	let colour_array = colour_string.split(', ');
	for (const i in colour_array.entries)
	{
		colour_array[i] = "'" + colour_array[i] + "'";
		console.log(colour_array[i]);
	}
	return colour_array;
}


function random_colour(total, number)
{
    
    let rand_string = Math.floor(Math.random()*16777215).toString(16);
    // ensures a valid colour code by padding the string with a 0, if it is shorter the 6 characters
    const rand_colour = "#" + rand_string.padStart(6, "0");
    return rand_colour;

	//var steps = Math.floor(10485760 / total);
	//onsole.log(steps);
	//var colour = 6291455 + (steps * number)
	//colour = colour.toString(16);
	//console.log('#' + colour);

	//return '#' + colour;
}

function rand_col()
{
    let rand_string = Math.floor(Math.random()*16777215).toString(16);
    // ensures a valid colour code by padding the string with a 0, if it is shorter the 6 characters
    const rand_colour = "#" + rand_string.padStart(6, "0");
    return rand_colour;
}

function rainbow(numOfSteps, step) {
    // This function generates vibrant, "evenly spaced" colours (i.e. no clustering). This is ideal for creating easily distinguishable vibrant markers in Google Maps and other apps.
    // Adam Cole, 2011-Sept-14
    // HSV to RBG adapted from: http://mjijackson.com/2008/02/rgb-to-hsl-and-rgb-to-hsv-color-model-conversion-algorithms-in-javascript
    var r, g, b;
    var h = step/ numOfSteps;
    var i = ~~(h * 6);
    var f = h * 6 - i;
    var q = 1 - f;
    switch(i % 6){
        case 0: r = 1; g = f; b = 0; break;
        case 1: r = q; g = 1; b = 0; break;
        case 2: r = 0; g = 1; b = f; break;
        case 3: r = 0; g = q; b = 1; break;
        case 4: r = f; g = 0; b = 1; break;
        case 5: r = 1; g = 0; b = q; break;
    }
    var c = "#" + ("00" + (~ ~(r * 255)).toString(16)).slice(-2) + ("00" + (~ ~(g * 255)).toString(16)).slice(-2) + ("00" + (~ ~(b * 255)).toString(16)).slice(-2);
    return (c);
}


export class Topic
{
    constructor(data, topic_id, topic_name)
    {

        this._identifier = topic_id;
        this._name = topic_name;
        //this.name = this.set_topic_name(topic_name);
        //this.index = this.set_topic_index(data, topic_name);
        this._articles = [];
        this._entities = [];
        this.set_articles(data);
        this.set_entities(data);
        this.entities_to_articles();
        this.set_colours();
    }
    
    /**
     * Returns the internal index of this topic in the json data
     * @param {JSON-Oject} data - JSON data 
     * @param {String} topic_name - Topic Indentificator     
     * @returns - Integer of topic index
     *//*
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
    */
    set_entities(data)
    {
        data[this._identifier].entities.forEach(element => {
            var id = this._identifier + ";" + element.name;
            var en = new Entity(data, this._identifier, element.name, id);
            this.entities.push(en);
        })
    }
    set_articles(data)
    {
        data[this._identifier].documents.forEach(art => {
            let article_name = this._identifier + ";" + art.title;
            var doc = new Document(data, article_name, this._identifier);
            this._articles.push(doc);
        });
    }
    entities_to_articles()
    {
        this._articles.forEach(art => {
            this._entities.forEach(ent => {
                if(ent.mentions.includes(art.political_direction))
                {
                    art.add_entity(ent);
                }
            });
        });
    }

    set_colours()
    {	
        for(const [i , element] of this._entities.entries())
        {	
            //element.add_colour(rainbow(this._entities.length, i+1));
            //element.add_colour(random_colour(this._entities.length, i+1));
			if ( i >= colour_array.length)
			{
				element.add_colour(random_colour());
			}
			else
			{
				element.add_colour(colour_array[i]);
			}		
        }
    }

    get identifier()
    {
        return this._identifier;
    }

    get formatted_name()
    {
        let text = this._name.split("_");
        return text[1];
    }

    get entities()
    {
        return this._entities;
    }

    get articles()
    {
        return this._articles;
    }

    get clean_topic()
    {   
        var ret = this._identifier;
        return ret.slice(0, -17).replace(/[-,_,.,0,1,2,3,4,5,6,7,8,9]/g, "");
    }

    get statistics_of_entities()
    {
        var entity_dict = {
            names : [],
            numbers : [],
            colour : []
        }
        this.entities.forEach( ent => {
            entity_dict.names.push(ent.formatted_name);
            entity_dict.numbers.push(ent.mentions_array.length);
            entity_dict.colour.push(ent.colour);
        });
        return entity_dict;
    }
}
