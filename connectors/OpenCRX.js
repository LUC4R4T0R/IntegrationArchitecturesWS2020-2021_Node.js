const axios = require('axios');

class OpenCRXConnector{

    constructor(url, username, password) {
        this.url = url;
        this.username = username;
        this.password = password;
    }


    async getUserByGovernMentId(id){
        try{
            var request = await axios.get(
                this.url+ 'account1/provider/CRX/segment/Standard/account?query=thereExistsGovernmentId().equalTo(%22'+id+'%22)',
                {
                    auth:{
                        'username':this.username,
                        'password':this.password
                    }
                }
            );
            console.log('OpenCRX | rating user');
            console.log(request.data);
            return request.data;
        } catch (error){
            console.error('ERROR OpenCRX | something has gone wrong: ' + error);
        }
    }

    async getSalesOrderByAccountId(salesman){
        try{
            var request = await axios.get(
                this.url+ 'contract1/provider/CRX/segment/Standard/salesOrder?query=thereExistsSalesRep().equalTo(%22'+salesman+'%22)',
                {
                    auth:{
                        'username':this.username,
                        'password':this.password
                    }
                }
            );
            console.log('OpenCRX | rating user');
            console.log(request.data);
            return request.data;
        } catch (error){
            console.error('ERROR OpenCRX | something has gone wrong: ' + error);
        }
    }

    async getContractPositions(contractid){
        try{
            var request = await axios.get(
                this.url+ 'contract1/provider/CRX/segment/Standard/salesOrder/'+contractid+'/position',
                {
                    auth:{
                        'username':this.username,
                        'password':this.password
                    }
                }
            );
            console.log('OpenCRX | rating user');
            console.log(request.data);
            return request.data;
        } catch (error){
            console.error('ERROR OpenCRX | something has gone wrong: ' + error);
        }
    }

    async getRatingByGovernmentId(contract_id){
        try{
            var request = await axios.get(
                this.url+'contract1/provider/CRX/segment/Standard/salesOrder/'+contract_id+'/rating',
                {
                    auth:{
                        'username':this.username,
                        'password':this.password
                    }
                }
            );
            console.log('OpenCRX | rating obtained');
            console.log(request.data);
            return request.data;
        } catch (error){
            console.error('ERROR OpenCRX | something has gone wrong: ' + error);
        }
    }




}

module.exports = OpenCRXConnector;