'use strict'
///under construction --- do not use!!!!!!!!!!!!!!

export class DefaultDict{

    constructor(key = null, values = null)
    {
        try
        { 
            if((!key && values) || (key && !values))
            {
                throw ReferenceError;
            }
            if(key && values[0].constructor === Array)
            {
                throw TypeError;
            }
        }
       catch(e)
       {
        alert(e);
        key, values = []

       }
       finally 
       {
           if(key === null || key.constructor !== Array)
           {    
                this._keys = [];
                this._keys[0] = key;
                // console.log(this._keys)
           }
           else
           {
               this._keys = key;
               // console.log(this._keys)
           }
           this._values = [];

           if(values === null || values.constructor !== Array)
           {
                let temp = new Array(values);
                // console.log(temp)
                this._values[0] = temp;
           }
           else
           {
                this._values[0] = values;
                // console.log(this._values);
           }
        console.log(this._keys);
        console.log(this._values);
       } 
    }

    add(key, value = null)
    {   
        if(this._keys[0] === null)
        {
            this._keys[0] = key;
            // console.log(this._keys)
            // console.log(key)
        }
        else if(!(key in this._keys))
        {
            console.log(key);
            console.log('nay')
            this._keys.push(key)
        }
        let j = this._keys.indexOf[key]
        if(value)
        {
            
            if(this._values[j] === null || this._values[j] === undefined)
            {
                let temp = new Array(value);
                this._values[j] = temp;
            }
            else
            {
               // console.log(this._values[j])
                this._values[j].push(value);
            } 
        }
        else
        {
            temp = new Array;
            this._values[j] = temp;
        }
    }

    remove(key, value = null)
    {
        let j = this._keys.indexOf(key);
        if(value)
        {
            if(value.length === this._values[j].length)
            {
                this._keys.splice(j, 1);
                this._values.splice(j, 1);
            }
            else
            {   
                let del, start = 0;
                for(let i = 0; i < this._values[j].length; i++)
                {
                    if(this._values[j][i] in value)
                    {
                        del++;
                        if(!start)
                        {
                            start = i;
                        }
                    }
                }
                this._values[j].splice(start, del);
            }
        this.va.splice(this._marked_entities.indexOf(ent), 1);
        }
    }

}