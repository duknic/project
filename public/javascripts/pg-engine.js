/**
 * Created by nic on 22/07/2015.
 *
 * ### Component 1 contains . AND \. AND (whitespace) AND *
 *
 * ### Component 2 contains (a|b) AND (a|b|c)
 *
 * ### Component 3 contains [ab] AND [abc] AND [abcd]
 *
 * ### Component 4 contains {2}, {3}, {4}
 *
 * ### Components Alpha and Numerical contain respective char arrays
 *
 * ### Component 5 contains [0-9] AND [a-z]
 *
 * ### Component 6 contains [^xy] AND [^xyz] AND [^xyzz]
 *
 */

// GLOBAL VARIABLES PER QUESTION
var curMatch = [];
var curNotMatch = [];
var curRegex = '';
//var componentCode = [[]];
//var curAntiRegex = '';

// we could mess around with these arrays and put them into easy and advanced groups
// also, number of components is easy way of making questions more difficult
// every array has a space character so this is more commonly included in regex (this may or may not work)
var comp1 = ['.', '\\.', ' '];
var comp2 = ['(a|b)', '(aa|bb)', '(aaa|bbb)', '(a|b|c)', '(aa|bb|cc)', '(aaa|bbb|ccc)', ' '];
var comp3 = ['[ab]', '[abc]', '[abcd]', '[a-z]', ' '];
var comp4 = ['{2}', '{3}', '{4}', ' '];
var compAlphaLo = 'abcdefghijklmnopqrstuvwxyz ';
var compAlphaUp = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ ';
var compNum = '0123456789 ';
var comp5 = ['[^xy]', '[^xyz]', '[^xyzz]', ' '];
var components = [comp1, comp2, comp3, comp4, compAlphaLo, compAlphaUp, compNum, comp5];
var chars = 'aAbBcCdDeEfFgGhHiIjJkKlLmMnNoOpPqQrRsStTuUvVwWxXyYzZ0123456789';

function generateRegex(numComps) {
    var regex = '';
    //var spanner = Math.floor(Math.random() * 6);

    for (var i = 0; i <= numComps; i++) {
        var x = Math.floor(Math.random() * components.length);
        var xLength = components[x].length;
        var y = Math.floor(Math.random() * xLength);
        //componentCode.push([x, y]);
        regex += components[x][y];
        //curAntiRegex += components[x][y];
        //
        //if (i == spanner) {
        //
        //}
    }
    regex = replaceCharacters(regex);
    curRegex = regex;
    return regex;
}

function replaceCharacters(regex) {
    // iterate through and replace every alpha numerical character with random one including uppercase
    // we have to be careful of RANGES so check for [a- these keep their alpha or numerical type!
    // DONT worry about simple [abc] brackets these can be a mix

    regex = regex.split('');

    if (regex[0] == '{') {
        regex.push(regex.shift(), regex.shift(), regex.shift());
    }

    var upperReg = new RegExp('[A-Z]');
    var lowerReg = new RegExp('[a-z]');
    var numReg = new RegExp('[0-9]');
    var allReg = new RegExp('[a-zA-Z0-9]');

    //$.each(regex, function (i, c) {
    for (var i = 0, len = regex.length; i < len; i++) {
        // if c is a letter or number
        if (allReg.test(regex[i])) {
            // if c is part of a range
            if (regex[i - 1] == '-') {
                // replace c with whatever the start of the range had
                switch (regex[1 - 2]) {
                    case upperReg.test(regex[1 - 2]):
                        regex[i] = findGreater(regex[1 - 2], compAlphaUp);
                    case lowerReg.test(regex[1 - 2]):
                        regex[i] = findGreater(regex[1 - 2], compAlphaLo);
                    case numReg.test(regex[1 - 2]):
                        regex[i] = findGreater(regex[1 - 2], compNum);
                }
            }
            // ELSE NOT IN A RANGE
            else {
                if (!(regex[i - 1] == '{')) {
                    regex[i] = chars[Math.floor(Math.random() * chars.length)];
                }
            }
        }
    }
    //);

    return regex.join('');
}

// returns a char of greater value than the one you pass in i.e. z > a
function findGreater(char, arr) {
    var i = 0;
    while (arr[i] <= char) {
        i = Math.floor(Math.random() * arr.length);
    }
    return arr[i];
}

function getMatchList(numStr, regex) {
    //console.log(regex);
    var matchArr = [];
    while (numStr--) {
        matchArr.push(new RandExp(regex).gen());
    }
    curMatch = matchArr;
    return matchArr;
}

function getNotMatchList(numStr, regex) {
    var notMatch = [];
    var str = randomStr(numStr);
    var tester = new RegExp(regex);
    while (!tester.test(str) && notMatch.length < numStr) {
        notMatch.push(str);
        str = randomStr(numStr);
    }
    return notMatch;
}

function randomStr(length) {
    var str = '';
    while (length--) {
        str += chars[Math.floor(Math.random() * chars.length)];
    }
    return str;
}

function generateProgen(difficulty) {
    var regex = generateRegex(difficulty);
    var match = getMatchList(difficulty, regex);
    var notMatch = getNotMatchList(difficulty, regex);
    console.log(notMatch);
    $tbody = $('#testCases');

    for (var i = 0; i < match.length; i++) {
        $tbody.append(
            '<tr><td>' + match[i] + '</td> <td>' + notMatch[i] + '</td></tr>'
        )
    }
}