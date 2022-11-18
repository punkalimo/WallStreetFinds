class Watchlist {
    constructor(company, symbol, price, score, priceChg){
        this.company = company;
        this.symbol = symbol;
        this.price = price;
        this.priceChg = priceChg;
        this.score = score;
    }
    toJson(){
        return {
            "Company": this.company,
            "Symbol": this.symbol,
            "Price" : this.price,
            "Score": this.score,
            "PriceChg": this.priceChg
        }
    }

    static firstWatch(){
        return new this('Apple','APL',1500, 5.8, 2.8);
    }
}
module.exports = Watchlist;