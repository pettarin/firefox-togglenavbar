//
// Author:      Alberto Pettarin
// Copyright:   Copyright 2016, Alberto Pettarin
// License:     MIT
// Email:       alberto@albertopettarin.it
// Web:         http://www.albertopettarin.it/
// Status:      Production
// Version:     0.0.3
// Date:        2016-01-20
//

var self = require('sdk/self');
var utils = require("sdk/window/utils");
var tabs = require("sdk/tabs");
var { viewFor } = require("sdk/view/core");
var { Hotkey } = require("sdk/hotkeys");
var hotkey;
var DEBUG = false;

function dlog(msg) {
    if (DEBUG) {
        console.log(msg);
    }
}

// toggle the nav bar
function toggle() {
    var win = utils.getMostRecentBrowserWindow();
    if (win && win.document && win.document.getElementById('nav-bar')) {
        var nb = win.document.getElementById('nav-bar');
        nb.style.visibility = (nb.style.visibility == '') ? 'collapse' : '';
        nb.style.overflow = (nb.style.height == '') ? '' : 'hidden';
    }
}

// bind the toggle function to a click on the tab
function bindToggle(tab) {
    var lowLevelTab = viewFor(tab);
    if (lowLevelTab) {
        dlog('Adding to ' + tab.id);
        lowLevelTab.addEventListener('click', toggle, false);
        dlog('Adding to ' + tab.id + ' ... done');
    }
}

// unbind the toggle function when the tab is closed
function unbindToggle(tab) {
    var lowLevelTab = viewFor(tab);
    if (lowLevelTab) {
        dlog('Removing from ' + tab.id);
        lowLevelTab.removeEventListener('click', toggle, false);
        dlog('Removing from ' + tab.id + ' ... done');
    }
}

function main() {
    dlog('Exec main...');
    
    // apply to any new tab
    dlog('Binding tab open...');
    tabs.on('open', bindToggle);
    dlog('Binding tab open... done');

    dlog('Binding tab close...');
    tabs.on('close', unbindToggle);
    dlog('Binding tab close... done');

    // bind to open tabs, if any
    dlog('Binding to open tabs...');
    for (let tab of tabs) {
        dlog('Tab open url: ' + tab.url);
        bindToggle(tab);
    }
    dlog('Binding to open tabs... done');

    // add hotkey to F2
    dlog('Adding hotkey...');
    hotkey = Hotkey({
        combo: "f2",
        onPress: toggle 
    });
    dlog('Adding hotkey...done');

    dlog('Exec main... done');
}

function onUnload(reason) {
    dlog('Exec onUnload...');
    
    // NOTE: this loop will never execute, since unbindToggle
    //       will be triggered by the tab 'close' event
    //       so, when here, no tab will be open
    // unbind open tabs, if any
    dlog('Unbinding open tabs...');
    for (let tab of tabs) {
        dlog('Tab open url: ' + tab.url);
        unbindToggle(tab);
    }
    dlog('Unbinding open tabs... done');

    // remove hotkey
    dlog('Removing hotkey...');
    hotkey.destroy();
    dlog('Removing hotkey... done');
    
    dlog('Exec onUnload... done');
}

exports.main = main;
exports.onUnload = onUnload;

