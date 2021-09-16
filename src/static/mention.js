'use strict'

/**
 * The Mention class. You can create a new Object by calling the constructur as:
 * >>> mention = new Mnetion(sentence, text, tokens, annotation_type, head_token_index,
 *              head-Token_word, index ,political_direction)
 */
export class Mention {
    /**
     * 
     * @param {Integer} sent - Number of the sentence 
     * @param {String} txt - Text of the mention
     * @param {Array} tok - The tokens of the mention 
     * @param {String} annot - The annotation type 
     * @param {Integer} hti - The head token index
     * @param {String} htw - The head token word
     * @param {Integer} ind - The index of the entity, incrementaly based on the JSON data structure
     * @param {String} pol - Political direction of the mention's articel
     */
    constructor(sent, txt, tok, annot, hti, htw, ind, pol )
    {
        this._sentence = sent;
        this._text = txt;
        this._tokens = tok;
        this._annotate_type = annot;
        this._index = ind;
        this._head_token_index = hti;
        this._head_token_word = htw;
        this._political_direction_of_article = pol;
    }
    /**
     * @returns The political direction of the article the mentioon belongs to
     */
    get political_direction_of_article()
    {
        return this._political_direction_of_article;
    }
    /**
     * @returns The text of the mention
     */    
    get text()
    {
        return this._text;
    }
    /**
     * @returns An Array of tokens, the indexes of the mention's words in the respective sentence
     */    
    get tokens()
    {
        return this._tokens;
    }
    /**
     * @returns The annotation type of the mention
     */
    get annotate_type()
    {
        return this._annotate_type;
    }
    /**
     * @returns The mentions index, incrementally based on the JSON datastructure
     */
    get index()
    {
        return this._index;
    }
    /**
     * @returns The index of the sentence the mention is located
     */
    get sentence()
    {
        return this._sentence;
    }
}