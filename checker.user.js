// ==UserScript==
// @name 			VacChecker
// @namespace 		https://cfx.dk
// @version 		1.0
// @description 	Checks the status of vac/game bans.
// @author			Jens Magnus
// @require		    https://ajax.googleapis.com/ajax/libs/angularjs/1.4.5/angular.min.js
// @match       	http://steamcommunity.com/*/friends/coplay*
// @match 			https://steamcommunity.com/*/friends/coplay*
// ==/UserScript==

var apiUrl = "https://api.steampowered.com/ISteamUser/GetPlayerBans/v1/?key=A0A47E806ED927C2F71C9B16EE27FD4D&steamids=";

// An empty list of IDs to look up.
var lookup = {};

// Get all the elements we need to later get the Ids and insert html into.
var friends = [].slice.call(document.querySelectorAll('#memberList .member_block, .friendHolder, .friendBlock'));

// Foreach friend, add him to the list along with his steam64 id. Ripperino when new design.
friends.forEach(function (friend) {
    var id = friend.
        getElementsByClassName("manage_friend_checkbox")[0] // main
        .childNodes[1] // input tag
        .attributes // getting the attributes
        .getNamedItem("data-steamid") // getting the steamid
        .value; // and value thereof.
    // We can have the same player multiple times.
    if (!lookup[id]) 
        lookup[id] = []; // id didn't exist in list, make new empty and insert below.
    lookup[id].push(friend); // store reference to the friend element so we can insert html here later.
});

var app = angular.module('app', []).run(function ($http) {
    var ids = Object.keys(lookup);
    $http.get(apiUrl + ids.join(",")).success(function (data) {
        data.players.forEach(function (player) {
            var elements = lookup[player.SteamId];

            elements.forEach(function (element) {
                if (player.DaysSinceLastBan > 0) {
                    var span = document.createElement('span');
                    span.style.color = 'red';
                    span.innerHTML = '<br/>I R BENNERED THIS DAYS AGO:' + player.DaysSinceLastBan;
                    element.querySelector('.friendSmallText').appendChild(span);
                }
            });
            
        });
    });
});

// Bootstrap AngularJS. This is required so we can use angularjs for http.
angular.element(document).ready(function() {
    angular.bootstrap(document, ['app']);
});
