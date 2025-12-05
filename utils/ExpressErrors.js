class ExpressErrors extends Error{
    constructor(statusCode, message){
        super(message);
        this.statusCode = statusCode;
        console.log(statusCode + message);
    }
}

module.exports = ExpressErrors;