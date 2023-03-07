function errorHandler(err, req, res, next){
    if (err.name==='ErrorNotFound'){
        res.status(400).json({
            message: 'Error Not Found'
        })
    }else {
        res.status(500).json({
            message: 'internal server error'
        })
    }
}

module.exports = errorHandler;