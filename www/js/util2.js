"use strict"

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
        'D': IntFormat(this.getDate() , 2),
        'h': IntFormat(this.getHours() , 2),
        'm': IntFormat(this.getMinutes() , 2),
        's': IntFormat(this.getSeconds() , 2),
        'x': IntFormat(this.getMilliseconds(), 3)
    };
    for ( var item in o){
        var reg = new RegExp( item, 'g' );
        fmt = fmt.replace( reg , o[item] );
    }
    return fmt;
}

Date.prototype.parseStr = function( str ){

    var init = parseInt( str )
    var milliseconds = str % 1000;
    str /= 1000
    var seconds = str % 100;
    str /= 100
    var minutes = str % 100;
    str /= 100
    var hours = str % 100;
    str /= 100;
    var day = str % 100;
    str /= 100;
    var month = str % 100;
    str /= 100;
    var year = str % 1000;
    str /= 10000;

    var d = new Date( year, month, day, hours, minutes, seconds, milliseconds )
    console.log( d.Format ( "YMDhmsx" ) );
    return d;
}

// POST Wrapper

function PW( instr, data, cbFunc ){
    $.post(
        'http://121.41.47.132:82/oneButton',
        {
            content:JSON.stringify({"instr": instr, "data" : data})
        },
        cbFunc
    );
}

// font end of OneButtonFontend
function OBF(){
    this.typeList = [];
    this.cataList = [];
    this.eventList = [];
    this.callbackFunc = undefined;

    this.setCallback = function( cbFunc ){
        this.callbackFunc = cbFunc;
    }
    this.execCallback = function(){
        if ( this.callbackFunc != undefined ){
            this.callbackFunc();
            this.callbackFunc = undefined;
        }
    }

    // types opers
    this.getTypeList = function(){
        console.log( "f:getTypeList" );
        var thispt = this;
        var instr = 'getTypeList';
        var data = 'some';
        var cbFunc = function( responce ){
            console.log( responce );
            thispt.typeList = JSON.parse( responce );
            console.log( thispt.typeList )

            thispt.execCallback()
        }
        PW( instr, data, cbFunc );
    };

    this.addType = function( type_name, type_color, cata_name ){
        console.log( "f:addType" );
        var thispt = this;
        PW(
            'addType',
            JSON.stringify({
                'type_name' : type_name,
                'cata_name' : cata_name,
                'type_color' : type_color
            }),
            function( responce ){
                thispt.typeList = JSON.parse( responce );
                console.log( thispt.typeList );

                thispt.execCallback();
            }
        )
    }


    // cata opers
    this.addCata = function( cata_name ){
        //var cata_name = $("#addCata").val()
        var thispt = this;
        PW( 
           'addOneCata',
           JSON.stringify({
               "cata_name" : cata_name
           }),
           function( responce ){
               thispt.cataList = JSON.parse( responce );
               console.log( thispt.cataList );

               thispt.execCallback();
           }
        )
    };

    this.getCataList = function(){
        console.log( "f:getCataList" );
        var thispt = this;
        PW(
            'getCataList',
            JSON.stringify({
                    "cata_name" : 'hello'
            }),
            function(responce){
                thispt.cataList = JSON.parse( responce )

                $("#addType_catalist option").remove()
                $.each( thispt.cataList, function( index, obj ){
                    console.log( index + ":" + obj.cata_name )
                    $("#addType_catalist")
                        .append( $("<option/>")
                            .val(obj.cata_name )
                            .text( obj.cata_name ))
                } );
                console.log( thispt.cataList );

                thispt.execCallback()
            }
        )
    };


    this.getEventList = function(){
        console.log( "f:getEventList" );
        var thispt = this;
        PW(
            'getEventList',
            'hello',
            function( responce ){
                thispt.eventList = JSON.parse( responce )
                console.log( thispt.eventList )
                thispt.execCallback()
            }
        )
    };


    this.addOneEvent = function(){
        console.log( "f:addOneEvent" )
        var thispt = this;
        var date = new Date();
        PW(
            'addOneEvent',
            date.Format( "YMDhmsx" ),
            function( responce ){
                thispt.getCataList();
                thispt.getEventList();
                console.log( "f:addOneEvent", responce );
            },
            thispt.execCallback()
        )
    };
}

var obf  = new OBF();
