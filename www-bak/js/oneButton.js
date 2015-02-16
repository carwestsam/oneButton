
"use strict"

var oneButton = angular.module("oneButton", []);


oneButton
.controller( "Page", function($scope){
    $scope.Page = {};
    $scope.Page.name = "Page";
} )
.controller( "ListView", function ( $scope ) {
    $scope.ListView = {};
    $scope.ListView.name = "ListView";
})
.controller( "Neo", function( $scope ){
    $scope.Neo = {};
    $scope.Neo.name = "Neo";
    $scope.Neo.clickFunc = function(){
        console.log( $scope.Page.name,  $scope.Neo.name );
    };
} )
