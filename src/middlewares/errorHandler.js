const  errorHandler = (error, req, res, next) =>{
    return res.status(500).send(error.message);
}

module.exports = errorHandler;