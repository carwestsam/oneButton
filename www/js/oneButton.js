
"use strict"

$(document).ready( function(){
    $(".button-collapse").sideNav();
} )

var oneButton = angular.module( "oneButton", [] );

oneButton
.controller( "Page" , [ '$scope', 'cataFactory', 'typeFactory', 'eventFactory' ,function( $scope, cata, types, events ){
    $scope.Page = {}
    $scope.Page.name = "Page"
    $scope.cataList = null
    $scope.typeList = null
    $scope.eventList = null
    $scope.cataMap = new Map()
    $scope.typeMap = new Map()
    $scope.eventMap = new Map()

    $scope.Page.netLock = false
    $scope.$watch(
        function(){
            return ( $scope.cataList != null && $scope.typeList != null && $scope.eventList != null )},

        function( newValue, oldValue ){
            console.log( 'Page', 'init', newValue, oldValue )
            $scope.Page.netLock = !newValue;
        }
    )

    $scope.Page.getCataList = function(){
        cata.getCataList( $scope, 'cataList' )
    }
    $scope.Page.addCata = function( cata_name ){
        console.log( 'Page', cata_name )
        cata.addCata( {'cata_name':cata_name}, function(){cata.getCataList( $scope, 'cataList' ) })
        //cata.getCataList( $scope, 'cataList' )
    }
    /*
     *
     * forbid delete
     * 暂时没有想到好的处理删除的办法
     *
     *
    $scope.Page.delCata = function( cata_id ){
        console.log( 'delCata', cata_id )
        cata.delCata( cata_id, function(){cata.getCataList( $scope, 'cataList' )} )
    }*/

    $scope.Page.getTypeList = function() {
        types.getTypeList( $scope, 'typeList' )
    }
    $scope.Page.addType = function( typeName, typeColor, cataId ){
        types.addType(
            {
                'type_name': typeName,
                'type_color' : typeColor,
                'cata_id' : cataId
            },
            function() {
                $scope.Page.getTypeList()
            }
        )
    }


    $scope.Page.getEventList = function(){
        events.getEventList ( $scope, 'eventList' )
    }
    $scope.Page.addEvent = function( event_time, type_id ){
        events.addEvent(
            {
                'event_time' : event_time,
                'type_id' : type_id
            },
            function(){
                $scope.Page.getEventList()
            }
        )
    }
}])
.controller( "ListViewCtrl", [ '$scope', 'finder','setter', 'eventFactory' , function( $scope, finder, setter, events ) {
    $scope.ListView = {}
    $scope.ListView.name = "ListView"

    $scope.ListView.List = []

    $scope.order = 'event_time'
    $scope.reverse = true

    $scope.clickConfig = function( event_id, type_id ){
        console.log( 'clickConfig', event_id, type_id )
        events.changeEventType(  event_id, type_id, function(){
            var color = finder( $scope.typeList, 'id', type_id, 'type_color' )
            console.log( "callback", event_id, type_id, color, $scope.typeList )
            setter( $scope.ListView.List, 'id', event_id, 'type_color', color )
        })
    }
    
    $scope.$watch( function(){ return $scope.Page.netLock}, function( newValue, oldValue ){
        if ( $scope.netLock == true ) return
        console.log( "** ListView Watcher **" )
        var tmpList = []
        for ( var idx in $scope.$parent.eventList ){
            var item = {}
            var event = $scope.$parent.eventList[idx]
            item.eventTime = event.event_time
            item.id = event.id
            item.type_id = event.type_id
            item.type_color =  finder( $scope.typeList, 'id', event.type_id, 'type_color' )
            item.type_name = finder( $scope.typeList, 'id', event.type_id, 'type_name' )
            var d = new Date()
            item.timePoint = d.parseStr( item.eventTime )

            //console.log( $scope.$parent.eventList[idx] )

            tmpList.push( item )
        }
        tmpList.sort( function(a,b){
            a = parseInt( a.eventTime )
            b = parseInt( b.eventTime )
            return a - b;
        } )

        for ( var idx=1; idx < tmpList.length; idx ++  ){
            tmpList[idx].duration = tmpList[idx].timePoint - tmpList[idx-1].timePoint
        }
        tmpList.shift()
        $scope.ListView.List = tmpList
        bindJquery.refreshDropdown()
    })
    $scope.$on( 'doneRender', function( event, args ){
        event.preventDefault()
        console.log( "doneRender", event );
        bindJquery.refreshDropdown();
    });
}])
.controller( "ButtonCtrl", [ '$scope', 'cataFactory', 'typeFactory' , function( $scope, cata, types ){
    $scope.ButtonCtrl = {}
    $scope.ButtonCtrl.name = "ButtonCtrl"
    $scope.ButtonCtrl.available = false

    $scope.$watch( function(){ return $scope.Page.netLock}, function( newValue, oldValue ){
        console.log( 'hello', newValue, oldValue )
        $scope.ButtonCtrl.available = !$scope.newLock;
    } )

    $scope.clickFunc = function (){
        var date = new Date()
        var dateStr = date.Format( "YMDhmsx" )
        console.log( date.Format("YMDhmsx") )
        $scope.Page.addEvent(  dateStr, 0 )
    }

    $scope.Page.getEventList();
    $scope.Page.getTypeList();
    $scope.Page.getCataList();
}])
.filter( 'object2Array', function(){
    return function(input){
        var out = []
        for ( i in input ){
            out.push(input[i]);
        }
        return out;
    }
} )
.filter( 'int2str', function(){
    return function( input ){
        return "" + input 
    }
} )
.filter( 'millseconds2Read', function(){
    return function( input ){
        var num = parseInt( input )
        var milliseconds = num % 1000; num = Math.floor( num / 1000 )
        var seconds = num % 60; num = Math.floor( num / 60 )
        var minutes = num % 60; num = Math.floor( num / 60 )
        var hours = num; num = Math.floor( num / 24 )

        return ""+hours+"时"+minutes+"分"+seconds+"秒" 
    }
} )
.factory( "finder", function(){
    return function ( arr, key, value, target ){
        for ( var idx in arr ){
            var obj = arr[idx]
            if ( obj[ key ] == value ){
                return obj[target]
            }
        }
        return null
    }
} )
.factory( "setter", function(){
    return function( arr, key, value, target, target_val ){
        for ( var idx in arr ){
            var obj = arr[idx]
            if ( obj [key] == value ){
                obj[ target ] = target_val
                return
            }
        }
    }
} )
.factory( "eventFactory", [ 'poster', 'FactoryProto',
    function( poster, fp ){
        return {
            getEventList : fp.getFactoryFunc( 'getEventList', 'hello' ),
            addEvent : fp.addFactoryFunc( 'addEvent' ),
            changeEventType : function( event_idx, new_type_idx, callbackFunc ){
                var instr = 'changeEventType'
                var obj ={ 'event_id': event_idx,  'type_id':new_type_idx }
                poster( 
                       instr,
                       JSON.stringify( obj ),
                       function ( xdata ){
                           callbackFunc()
                       },
                       function( xdata ){
                       }
                )
            }
        }
    }
] )
.factory( "typeFactory", [ 'poster', 'FactoryProto',
    function ( poster, factoryProto ){
        return {
            getTypeList : factoryProto.getFactoryFunc( 'getTypeList', 'hello' ),
            addType : factoryProto.addFactoryFunc( 'addType' )
        }
    }
] )
.factory( "cataFactory", [ 'poster', 'FactoryProto',
    function (  poster, fp ){
        return {
            getCataList : fp.getFactoryFunc( 'getCataList', 'hello' ),
            addCata : fp.addFactoryFunc( 'addOneCata' ),
            delCata : function( cata_id, cbFunc ){
                console.log( 'delCata', cata_id )
                poster( 'delCata',
                       JSON.stringify({"id": cata_id}),
                       function( xdata ){
                           cbFunc()
                       }
                      )
            }
        }
    }
] )
.factory( "FactoryProto", [ 'poster',
    function( poster ){
        return {
            getFactoryFunc: function(  instr, data  ) {
                return function( obj, key ){
                    var backup = obj[key]
                    obj[key] = null
                    poster( instr, data, function( xdata ){
                        obj[key] = xdata
                    },function(xdata){

                    })
                }},
            addFactoryFunc: function( instr ){
                return function( newObj, cbFunc ){
                    poster( instr, JSON.stringify( newObj ), function( xdata ){ cbFunc() }, function(xdata){} )
                }
            },
        }
    }
]  )
.factory( "poster", ['$http',
    function( $http ){
        return function( instr, data, callbackFunc, errorFunc  ){
            var obj = JSON.stringify({ "instr":instr, "data": data });
            var req = {
                method : 'post',
                url: 'http://121.41.47.132:82/oneButton',
                //dataType: 'json',
                data :  { content: obj },
                headers: {
                    'Content-Type' : 'application/x-www-form-urlencoded;charset=UTF-8'
                    //'Content-Type' : 'application/json'
                },
                transformRequest: function( datax ){
                    return $.param(datax)
                },
            }

            $http( req )
                .success( function( data, status, headers, config ){
                    callbackFunc( data )
                    console.log( "success", data )
                })
                .error( function( data, status, headers, config ){
                    errorFunc(data);
                    console.log( "failed" )
                } )
        }
    }
] )

