"use strict"






var oneButton = angular.module("oneButton", []);
oneButton.controller( "Page", function ( $scope ){
    $scope.Page = {};
    $scope.Page.name = 'Page';
    $scope.$on( 'timeEvent', function( event, data ) {
        $scope.$broadcast( 'newTimeEvent', data );
    });
} )
.controller( "ListView", function( $scope ){
    $scope.ListView = {};
    $scope.ListView.name = 'ListView';

    $scope.ListView.List = [];
    
    $scope.ListView.getColorList = TypeList.getGetColorList( TypeList );
    $scope.ListView.getTypeList = TypeList.getGetTypeList( TypeList );

    $scope.ListView.setType = function( ele, value ){
        console.log( "ListView.setType" );
        console.log( ele, value );
        ele.setType( value );
    }

    $scope.$on( 'newTimeEvent', function( event, data ){

        var time = new Date();

        var tn = new TimeNode( time );

        $scope.ListView.List.push( tn );

        console.log( $scope.ListView.List );
    } );
} )
.controller( "ButtonCtrl", function($scope){
    $scope.ButtonCtrl = {};
    $scope.ButtonCtrl.name = "Click";
    $scope.ButtonCtrl.clickFunc = function(){
        /*
         * !!!!! important !!!!!
        var time = new Date();
        var timeStr = time.Format('Y年M月D日h时m分s秒');
        console.log( timeStr );
        */
        console.log( 'ButtonCtrl.clickFunc'  );
        $scope.$emit( 'timeEvent',"null" );
    }
} );


