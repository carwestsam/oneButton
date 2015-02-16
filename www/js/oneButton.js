
"use strict"

var oneButton = angular.module( "oneButton", [] );

oneButton
.controller( "Page" , [ '$scope', 'cataFactory', 'typeFactory', 'eventFactory' ,function( $scope, cata, types, events ){
    $scope.Page = {}
    $scope.Page.name = "Page"
    $scope.cataList = null
    $scope.typeList = null
    $scope.eventList = null

    $scope.netLock = false
    $scope.$watch(
        function(){
            return ( $scope.cataList != null && $scope.typeList != null && $scope.eventList != null )},

        function( newValue, oldValue ){
            console.log( 'Page', 'init' )
            $scope.netLock = !newValue;
        }
    )

    $scope.Page.getCataList = function(){
        cata.getCataList( $scope, 'cataList' )
    }
    $scope.Page.addCata = function( cata_name ){
        console.log( 'Page', cata_name )
        cata.addCata( cata_name, { 't': "" }, 't', function(){cata.getCataList( $scope, 'cataList' ) })
        //cata.getCataList( $scope, 'cataList' )
    }
    $scope.Page.delCata = function( cata_id ){
        console.log( 'delCata', cata_id )
        cata.delCata( cata_id, function(){cata.getCataList( $scope, 'cataList' )} )
    }

    $scope.Page.getTypeList = function() {
        types.getTypeList( $scope, 'typeList' )
    }
    $scope.Page.getEventList = function(){
        events.getEventList ( $scope, 'eventList' )
    }
}])
.controller( "ListViewCtrl", function( $scope ) {

})
.controller( "ButtonCtrl", [ '$scope', 'cataFactory', 'typeFactory' , function( $scope, cata, types ){
    $scope.ButtonCtrl = {}
    $scope.ButtonCtrl.name = "ButtonCtrl"
    $scope.ButtonCtrl.available = false

    $scope.$watch( $scope.netLock, function( newValue, oldValue ){
        console.log( 'hello', newValue, oldValue )
        $scope.ButtonCtrl.available = !$scope.newLock;
    } )

    $scope.clickFunc = function (){
        var date = new Date()
        console.log( date.Format("YMDmsx") )
        $scope.Page.getCataList()
    }

    $scope.Page.getEventList();
    $scope.Page.getTypeList();
    $scope.Page.getCataList();
}])
.factory( "eventFactory", [ 'poster', 'FactoryProto',
    function( poster, fp ){
        return {
            getEventList : fp.getFactoryFunc( 'getEventList', 'hello' )
        }
    }
] )
.factory( "typeFactory", [ 'poster', 'FactoryProto',
    function ( poster, factoryProto ){
        return {
            getTypeList : factoryProto.getFactoryFunc( 'getTypeList', 'hello' )
        }
    }
] )
.factory( "cataFactory", [ 'poster', 'FactoryProto',
    function (  poster, fp ){
        return {
            getCataList : fp.getFactoryFunc( 'getCataList', 'hello' ),
            addCata : function( cata_name, obj, key, cbFunc ){
                console.log( 'addCata', cata_name )
                poster( 'addOneCata',
                        JSON.stringify({"cata_name": cata_name}),
                        function( xdata ){
                            obj[key] = xdata;
                            cbFunc()
                        })
            },
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
                    } )
                }
        }}
    }
]  )
.factory( "poster", ['$http',
    function( $http ){
        return function( instr='default', data, callbackFunc  ){
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
                    console.log( "failed" )
                } )
        }
    }
] )
