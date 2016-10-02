/**
 * Created by alga on 10/2/16.
 */

class Bets {
    constructor(){

        this._win = [];
        this._place = [];
        this._result = {
            first: [],
            second: [],
            third: []
        };
    }

    _transformData(data){
        return Promise.resolve().then(()=>{
            (data.split('\n'))
                .forEach(function(line,key){
                    var l = line.split(':');

                    if(l && l[0] === 'Bet'){
                        if(l[1] === 'W'){
                            this._win.push({
                                product: l[1],
                                selection: l[2],
                                stake: l[3]
                            });
                        } else {
                            this._place.push({
                                product: l[1],
                                selection: l[2],
                                stake: l[3]
                            });
                        }

                    } else if(l && l[0] === 'Result'){
                        this._result = {
                            first: l[1],
                            second: l[2],
                            third: l[3]
                        }
                    }
                }, this);

            if(!this._win.length === 0) {
                throw 'No Win bets';
            }

            if(!this._place.length === 0) {
                throw 'No Pool bets';
            }

            if(!this._result) {
                throw 'No Results';
            }
        });
    }


    _sum(){
        this._totalBets = 0;
        this._wTotals = {};
        this._totalWin = 0;

        this._pTotals = {};
        this._totalPlace = 0;

        return Promise.resolve().then(()=>{
            this._win.forEach(function(l){
                var selection = parseInt(l.selection);
                var stake = parseFloat(l.stake);

                if(!this._wTotals[selection]) {
                    this._wTotals[selection] = {
                        quantity:0,
                        total:0
                    };
                }

                this._wTotals[selection] = {
                    quantity: this._wTotals[selection].quantity + 1,
                    total: this._wTotals[selection].total + stake
                };

                this._totalBets += stake;
                this._totalWin += stake;
            },this);


            this._place.forEach(function(l){
                var selection = parseInt(l.selection);
                var stake = parseFloat(l.stake);

                if(!this._pTotals[selection]) {
                    this._pTotals[selection] = {
                        quantity:0,
                        total:0
                    };
                }

                this._pTotals[selection] = {
                    quantity: this._pTotals[selection].quantity + 1,
                    total: this._pTotals[selection].total + stake
                };

                this._totalBets += stake;
                this._totalPlace += stake;
            },this);
        });
    }

    _getResults(){
        return Promise
            .all([
                this._getTotal('W', this._result.first),
                this._getTotal('P', this._result.second),
                this._getTotal('P', this._result.third)
            ])
            .then((res)=>{
                console.log(res);
                var stdOut  = 'Win:'+ this._result.first +':$'+ res[0];
                    stdOut += '\n'+ 'Place:'+ this._result.first +':$'+ res[0];
                    stdOut += '\n'+ 'Place:'+ this._result.second +':$'+ res[1];
                    stdOut += '\n'+ 'Place:'+ this._result.third +':$'+ res[2];

                return stdOut;
            });
    }

    _getTotal(product,selection){
        return this._sum().then(()=>{

            this._earns = {
                win: this._totalWin * 0.15,
                place: this._totalPlace * 0.12
            };

            this._totalWin -= this._earns.win;
            this._totalPlace -= this._earns.place;

            if(product === 'W' && this._pTotals[selection] && this._pTotals[selection].total){
                return (this._totalWin / this._wTotals[selection].total).toFixed(2);
            }

            if(this._pTotals[selection] && this._pTotals[selection].total) {
                return ((this._totalPlace / 3) / this._pTotals[selection].total).toFixed(2);
            }

            return 0;
        })
    };
}

export { Bets }