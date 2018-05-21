var mongoHost = process.env.MONGO_HOST || 'localhost'

module.exports = {
    'secret': 'thisIsTheDefaultSecret',
    'database': 'mongodb://' + mongoHost + '/nodetodo' 
};