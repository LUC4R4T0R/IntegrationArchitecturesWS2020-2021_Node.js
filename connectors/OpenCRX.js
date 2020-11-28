const axios = require('axios');

class OpenCRXConnector{

    constructor(url, username, password) {
        this.url = url;
        this.username = username;
        this.password = password;
    }


    async getRatingByGovernmentId(){
        try{
            var request = await axios.get(
                this.url+'contract1/provider/CRX/segment/Standard/salesOrder/9ENGNFGDLDQSPH2MA4T2TYJFL/rating',
                {
                    'username':this.username,
                    'password':this.password
                }
            );
            console.log('OpenCRX | rating optained');
        } catch (error){
            console.error('ERROR OpenCRX | something has gone wrong: ' + error);
        }
    }




}

module.exports = OpenCRXConnector;