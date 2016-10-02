/**
 * Created by alga on 10/2/16.
 */

var fs = require('fs');
import { Bets } from './lib/bets'


// extend Bets
class Bet extends Bets {
    constructor(opt){
        super();

        this._bets = opt.bets;
        this._results = opt.results;

    }

    _readFile() {
        var betsFile = this._bets;
        return new Promise(function (resolve,reject) {
            fs.readFile(betsFile, 'utf8', function (err, data) {
                if(err){
                    return reject(err);
                }
                return resolve(data);
            });
        });
    }

    _writeFile() {
        var resultsFile = this._results;

        this._getResults().then((stdOut)=>{
            return new Promise(function (resolve, reject) {
                fs.writeFile(resultsFile, stdOut, function (err, data) {
                    if (err) {
                        return reject(err);
                    }
                    return resolve(data);
                });
            });
        });

    }

    say() {

        console.log('\n\n\n');
        console.log('## ',this._result, this._totalBets, this._totalWin);
        console.log('\n\n\n');
        console.log('---------------------------------------------');
        console.log(' RESULTS, on screen and into result.txt file');
        console.log('---------------------------------------------');
        console.log(' House Earns ');
        console.log(' WIN poll $'+ this._earns.win.toFixed(2));
        console.log(' PLACE poll $'+ this._earns.place.toFixed(2));
        console.log('---------------------------------------------');
        this._getResults().then((res)=>console.log(res));
        // console.log('\n\n\n');

    }

    run() {
        return this._readFile()
            .then((data)=>this._transformData(data))
            .then(()=>this._getTotal());
    }

    save(){
        return this._writeFile();
    }

    getEarns(){
        return this.say();
    }
}

// initialize
var bet = new Bet({
    bets: 'bets.txt',
    results: 'results.txt'
});

// runs!
bet
    .run()
    .then(()=>{
        return bet.getEarns();
    })
    .then(()=>{
        return bet.save();
    })
    .catch((err)=>{
        console.error(err);
    });
