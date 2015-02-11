"use strict"


function jsonp( urlAddr, callbackFunc ){
}

Date.prototype.Format = function( fmt ){
    var IntFormat = function( num, size ){
        var Str = "";
        if ( typeof num === "number"  ){
            Str += num;
            while ( Str.length < size ){
                Str = "0" + Str;
            }
        }
        return Str;
    }
    var o = {
        'Y': IntFormat(this.getFullYear() , 4),
        'M': IntFormat((this.getMonth() + 1) , 2),
        'D': IntFormat((this.getDate() + 1) , 2),
        'h': IntFormat((this.getHours() + 1) , 2),
        'm': IntFormat((this.getMinutes() + 1), 2),
        's': IntFormat((this.getSeconds() + 1), 2)
    };
    for ( var item in o){
        var reg = new RegExp( item, 'g' );
        fmt = fmt.replace( reg , o[item] );
    }
    return fmt;
}

var timeCata = {

}

var TypeList ={
    ColorList: [],
    TypeList: [],
    ColorTypeMap : new Map(),
    TypeColorMap : new Map(),
    thispt: this,
    AddTypeColor: function( type, color, thispt ){
        thispt.ColorList.push( color );
        thispt.TypeList.push( type );
        thispt.ColorTypeMap.set(  color, type  );
        thispt.TypeColorMap.set( type, color );
    },
    Init : function(){
        this.AddTypeColor( "sleep", "blue" , this);
        this.AddTypeColor( "study", "green", this );
        this.AddTypeColor( "relax", "red", this );
        this.AddTypeColor( "default", "gray", this);
    },
    getInstance: function (){
        return this;
    },
    getColorList: function( thispt=this ){
        console.log( 'getColorList :', thispt.ColorList );
        return thispt.ColorList;
    },
    getGetColorList: function ( thispt=this ){
        return function(){
            return thispt.ColorList;
        }
    },
    getGetTypeList: function( thispt=this ){
        return function(){
            return thispt.TypeList;
        }
    }
};

TypeList.Init();

function TimeNode( date, type="default", info="" ){
    this.date = date;
    this.type = type;
    this.info = info;

    this.displayFull = false;
    this.toggleDisplayFull = function( thispt=this ){
        console.log("here");
        thispt.displayFull = !thispt.displayFull;
    };

    this.getColor = function(){
        return TypeList.TypeColorMap.get( this.type );
    };

    this.setType = function( newType ){
        this.type = newType;
    }

    console.log('New :\t',  this );
};



