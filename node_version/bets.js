// read input file or stream from transaction purposes
fs = require('fs');
var stdIn = fs.readFileSync('bets.txt', 'utf8');


var result, win = [], place = [];
(stdIn.split('\n')).forEach(function(line,key){
    var l = line.split(':');

    if(l && l[0] === 'Bet'){
        if(l[1] === 'W'){
            win.push({
                product: l[1],
                selection: l[2],
                stake: l[3]
            });
        } else {
            place.push({
                product: l[1],
                selection: l[2],
                stake: l[3]
            });
        }

    } else if(l && l[0] === 'Result'){
        result = {
            first: l[1],
            second: l[2],
            third: l[3]
        }
    }
});

if(!win[0]) {
    console.error('No Win bets');
    return false;
}

if(!place[0]) {
    console.error('No Pool bets');
    return false;
}

if(!result) {
    console.error('No Results');
    return false;
}


//
var totalBets = 0;
var wTotals = {};
var totalWin = 0;
win.forEach(function(l){
    var selection = parseInt(l.selection);
    var stake = parseFloat(l.stake);

    if(!wTotals[selection]) {
        wTotals[selection] = {
            quantity:0,
            total:0
        };
    }

    wTotals[selection] = {
        quantity: wTotals[selection].quantity + 1,
        total: wTotals[selection].total + stake
    };

    totalBets += stake;
    totalWin += stake;
});

var pTotals = {};
var totalPlace = 0;
place.forEach(function(l){
    var selection = parseInt(l.selection);
    var stake = parseFloat(l.stake);

    if(!pTotals[selection]) {
        pTotals[selection] = {
            quantity:0,
            total:0
        };
    }

    pTotals[selection] = {
        quantity: pTotals[selection].quantity + 1,
        total: pTotals[selection].total + stake
    };

    totalBets += stake;
    totalPlace += stake;
});

var tabCorpEarns = {
    win: totalWin * 0.15,
    place: totalPlace * 0.12
};

totalWin -= tabCorpEarns.win;
totalPlace -= tabCorpEarns.place;

getTotal = function(product,selection){
    if(product === 'W' && pTotals[selection] && pTotals[selection].total){
        return (totalWin / wTotals[selection].total).toFixed(2);
    }

    if(pTotals[selection] && pTotals[selection].total) {
        return ((totalPlace / 3) / pTotals[selection].total).toFixed(2);
    }

    return 0;
};

var stdOut  = 'Win:'+ result.first +':$'+ getTotal('W', result.first);
stdOut += '\n'+ 'Place:'+ result.first +':$'+ getTotal('P', result.first);
stdOut += '\n'+ 'Place:'+ result.second +':$'+ getTotal('P', result.second);
stdOut += '\n'+ 'Place:'+ result.third +':$'+ getTotal('P', result.third);


console.log('\n\n\n');
console.log('## ',result, totalBets, totalWin);
console.log('\n\n\n');
console.log('---------------------------------------------');
console.log(' RESULTS, on screen and into result.txt file');
console.log('---------------------------------------------');
console.log(' Tabcorp earns ');
console.log(' WIN poll $'+ tabCorpEarns.win.toFixed(2));
console.log(' PLACE poll $'+ tabCorpEarns.place.toFixed(2));
console.log('---------------------------------------------');
console.log(stdOut);
console.log('\n\n\n');



// stdout into file for transactions purposes
fs.writeFileSync('result.txt', stdOut);