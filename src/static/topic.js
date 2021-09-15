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


function random_colour()
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

// function rainbow(numOfSteps, step) {
//     // This function generates vibrant, "evenly spaced" colours (i.e. no clustering). This is ideal for creating easily distinguishable vibrant markers in Google Maps and other apps.
//     // Adam Cole, 2011-Sept-14
//     // HSV to RBG adapted from: http://mjijackson.com/2008/02/rgb-to-hsl-and-rgb-to-hsv-color-model-conversion-algorithms-in-javascript
//     var r, g, b;
//     var h = step/ numOfSteps;
//     var i = ~~(h * 6);
//     var f = h * 6 - i;
//     var q = 1 - f;
//     switch(i % 6){
//         case 0: r = 1; g = f; b = 0; break;
//         case 1: r = q; g = 1; b = 0; break;
//         case 2: r = 0; g = 1; b = f; break;
//         case 3: r = 0; g = q; b = 1; break;
//         case 4: r = f; g = 0; b = 1; break;
//         case 5: r = 1; g = 0; b = q; break;
//     }
//     var c = "#" + ("00" + (~ ~(r * 255)).toString(16)).slice(-2) + ("00" + (~ ~(g * 255)).toString(16)).slice(-2) + ("00" + (~ ~(b * 255)).toString(16)).slice(-2);
//     return (c);
// }


//var colour_array = ['#00008b', '#1e008a', '#2d008a', '#39008a', '#43008b', '#4c008c', '#55008d', '#5d008f', '#650092', '#6d0094', '#750097', '#7d009b', '#86009f', '#8e00a3', '#9600a8', '#9f00ae', '#a700b4', '#b000ba', '#b900c1', '#c300c8', '#cc00d0', '#d600d8', '#e000e1', '#ea00eb', '#f400f5', '#ff00ff', '#ff00ec', '#ff00d9', '#ff00c8', '#ff01b8', '#ff0da9', '#ff189b', '#ff218d', '#ff2981', '#ff3176', '#ff396b', '#ff4061', '#ff4758', '#ff4e4f', '#ff5547', '#ff5c3f', '#ff6337', '#ff6a30', '#ff7129', '#ff7822', '#ff7f1b', '#ff8614', '#ff8e0c', '#ff9505', '#ff9d01', '#ffac00', '#ffb302', '#ffba06', '#ffc00b', '#fec611', '#fccb17', '#fbd01d', '#f8d523', '#f6d929', '#f3dd2f', '#f0e035', '#ece43c', '#e8e742', '#e4e948', '#dfeb4e', '#daed55', '#d4ef5b', '#cef062', '#c7f068', '#c0f16f', '#b8f175', '#aff17c', '#a6f082', '#9bef89', '#90ee90', '#8ced95', '#89eb9b', '#86e8a0', '#83e5a5', '#81e1ab', '#7fddb0', '#7dd8b5', '#7bd3ba', '#79cdbf', '#78c7c4', '#76c0c8', '#75b9cd', '#73b1d1', '#71a8d6', '#6f9fda', '#6d96de', '#6a8ce3', '#6681e7', '#6175ea', '#5c69ee', '#545cf2', '#4b4df5', '#3f3df9', '#2d28fc', '#0000ff']

// function random_colour(number, total)
// {
    
//     //let rand_string = Math.floor(Math.random()*16777215).toString(16);
//     // ensures a valid colour code by padding the string with a 0, if it is shorter the 6 characters
//     //const rand_colour = "#" + rand_string.padStart(6, "0");
//     //return rand_colour;
    
// 	// hsl format
// 	if (total < 1) total = 1; // defaults to one color - avoid divide by zero
	
// 	const h = number * (360 / total) % 360;
// 	const s = 1
// 	const l = 0.5
	
// 	// convert to hex
// 	const a = s * Math.min(l, 1-l);
// 	const f = n => {
// 		const k = (n + h / 30) % 12;
// 		const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
// 		return Math.round(255 * color).toString(16).padStart(2, '0');
// 	};
// 	return '#${f(0)}${f(8)}${f(4)}';
// }

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

function RGB2Color(r,g,b)
{
  return '#' + byte2Hex(r) + byte2Hex(g) + byte2Hex(b);
}

function byte2Hex(n)
  {
    var nybHexString = "0123456789ABCDEF";
    return String(nybHexString.substr((n >> 4) & 0x0F,1)) + nybHexString.substr(n & 0x0F,1);
  }

function makeColorGradient(frequency1, frequency2, frequency3,
    phase1, phase2, phase3,
    center, width, len)
{
    var c_arr = [];
    if (center == undefined)   center = 128;
    if (width == undefined)    width = 127;
    if (len == undefined)      len = 50;

    for (var i = 0; i < len; ++i)
    {
        var r = Math.sin(frequency1*i + phase1) * width + center;
        var g = Math.sin(frequency2*i + phase2) * width + center;
        var b = Math.sin(frequency3*i + phase3) * width + center;
        var c = RGB2Color(r,g,b)
        c_arr.push(c)
    }
    return c_arr;
}

export class Topic
{
    constructor(data, topic_id, topic_name)
    {

        this._identifier = topic_id;
        this._name = topic_name;
        this._articles = [];
        this._entities = [];
        this._entities_type = {};
        this.set_articles(data);
        this.set_entities(data);
        this.entities_to_articles();
        this.set_colours();
    }
    
    /**
     * Returns the internal index of this topic in the json data
     * @param {Oject} data - JSON data 
     * @param {String} topic_name - Topic Indentificator     
     * @returns Integer of topic index
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

    /**
     * Creates all Entity class Objects belonging to this topic.
     * @param {Objet} data - JSON Data 
     */
    set_entities(data)
    {
        for(const  [i, ent] of data[this._identifier].entities.entries())
        {
            var id = this._identifier + ";" + ent.name;
            var entity = new Entity(ent, this._identifier, ent.name, id, i);

            var an = entity.type.split('-');
            if(!(this._entities_type[an[0]]))
            {
                this._entities_type[an[0]] = {};
            }
            if(!(this._entities_type[an[0]][entity.type]))
            {
                this._entities_type[an[0]][entity.type] = [];
            }
            this._entities_type[an[0]][entity.type].push(entity);
            this._entities.push(entity);
        }
    }
    /**
     * Creates all Document class Objects belonging to this topic. 
     * @param {Objet} data - JSON Data
     */
    set_articles(data)
    {
        for(const [i, doc] of data[this._identifier].documents.entries())
        {
            let article_name = this._identifier + ";" + doc.title;
            var article = new Document(doc, data, article_name, this._identifier, i);
            this._articles.push(article);
        }
    }
    /**
     * Assings each Article a refrence to their respective Entity class Object  
     */
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
    /**
     * Sets the colour scheme for the entities from an array.
     * If the number of entities exceeds the size of the array, a random colour is picked.
     */
    set_colours()
    {	
        var fr = 1;
        var f1, f2, f3;
        var i = 0;
        var col_arr = [];
        console.log(this._entities_type);
        for (const [o, element] of Object.entries(this._entities_type))
        {  
            if( i % 5 == 0 )
            {   
                console.log(fr)
                console.log('switch  ' + i)    
                switch (fr) {
                    case 1:
                        f1 = .1
                        f2 = .1
                        f3 = .1
                        break;
                    case 2:
                        f1 = .15
                        f2 = .1
                        f3 = .1
                        break;
                    case 3:
                        f1 = .1
                        f2 = .15
                        f3 = .1
                        break;
                    case 4:
                        var f1 = .1
                        var f2 = .1
                        var f3 = .15
                    default:
                        break;
                }
                console.log(f1)
                console.log(f2)
                console.log(f3)
                col_arr = makeColorGradient(f1,f2,f3,0,2,4, 170,75, 125);
                fr++;
                i++;
            }
            for(const [p, entity_arr] of Object.entries(element))
            {
                var j = 0;
                entity_arr.forEach(pol =>{
                    // console.log(pol + '  ' + col_arr[((i-1) * 8 + j)]);
                    pol.add_colour(col_arr[((i-1)*8 + j)]);
                    j+=2;
                });        
            }
        i+=1;
        // console.log(i)
        
        };

        // for(const [i , element] of this._entities.entries())
        // {	
        //     //element.add_colour(rainbow(this._entities.length, i+1));
        //     //element.add_colour(random_colour(this._entities.length, i+1));
		// 	if ( i >= colour_array.length)
		// 	{
		// 		element.add_colour(random_colour());
		// 	}
		// 	else
		// 	{
		// 		element.add_colour(colour_array[i]);
		// 	}		
        // }
    }
    /**
     * @returns {String} Indentifier of the topic
     */
    get identifier()
    {
        return this._identifier;
    }
    /**
     * @returns {String} The topics' name without any special caracters
     */
    get formatted_name()
    {
        let text = this._name.split("_");
        return text[1];
    }
    /**
     * @returns {Array} Returns Array with all the topics' entities
     */
    get entities()
    {
        return this._entities;
    }
    /**
     * @returns {Array} Returns Array with all the topics' articles
     */
    get articles()
    {
        return this._articles;
    }

    get clean_topic()
    {   
        var ret = this._identifier;
        return ret.slice(0, -17).replace(/[-,_,.,0,1,2,3,4,5,6,7,8,9]/g, "");
    }
    /**
     * @returns 
     *              Dictionary style Object where the three keys 
     *                  < names, numbers, colour, phrasing_complexity >
     *              each hold an array with the attributes of the articles' entities.
     *              The arrays are initialiased, so names[k], numbers[k] and colour[k] each
     *              reference the same entity.
     */
    get statistics_of_entities()
    {
        var entity_dict = {
            names : [],
            numbers : [],
            colour : [],
            phrasing_complexity : []
        }
        this.entities.forEach( ent => {
            entity_dict.names.push(ent.formatted_name);
            entity_dict.numbers.push(ent.mentions_array.length);
            entity_dict.colour.push(ent.colour);
            entity_dict.phrasing_complexity.push(ent.phrasing_complexity);
        });
        return entity_dict;
    }
    /**
     * 
     * @param {Object} article - Object of the Article class  
     * @returns {Object} Dictionary style Object where the three keys 
     *                      < names, numbers, colour >
     *                   each hold an array with the attributes of the articles' entities.
     *                   The arrays are initialiased, so names[k], numbers[k] and colour[k] each
     *                   reference the same entity.
     */
    get_statistics_of_article_with_zero(article)
    {
        var entity_dict = article.statistics_of_article;
        this.entities.forEach( ent => {
            if(!(ent.formatted_name in entity_dict.names))
            {
                entity_dict.names.push(ent.formatted_name);
                entity_dict.numbers.push(0);
                entity_dict.colour.push(ent.colour);
            }
        });
        return entity_dict;

    }
    get statistics_of_entity_types()
    {
        var type_dict = {
            names : [],
            numbers : [],
            colour : []
        }

        for (const [o, element] of Object.entries(this._entities_type))
        {
            for(const [p, entity_arr] of Object.entries(element))
            {
                type_dict.names.push(p);
                type_dict.numbers.push(entity_arr.length);
                type_dict.colour.push(entity_arr[0].colour);
            }
            
        }
        return type_dict;
    }
}
