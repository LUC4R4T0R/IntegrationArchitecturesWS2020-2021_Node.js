const axios = require('axios');

class OrangeHRMConnector{

    constructor(url, username, password) {
        this.url = url;
        this.username = username;
        this.password = password;

        this.getToken();
    }

    async getToken(){
        try{
            var request = await axios.post(
                this.url+'/oauth/issueToken',
                {
                    'client_id':'api_oauth_id',
                    'client_secret':'oauth_secret',
                    'grant_type':'password',
                    'username':this.username,
                    'password':this.password
                }
            );
            this.token = request.data.access_token;
            console.log('OrangeHRM | bearer-token obtained');
        } catch (error){
            console.error('ERROR OrangeHRM | obtaining bearer-token failed: ' + error);
        }
    }

    async resolveEmployeeId(id){
        try{
            var request = await axios.get(
                this.url+'/api/v1/employee/search?code=' + id,
                {
                    headers:{
                        Authorization: 'Bearer ' + this.token
                    }
                }
            );
            return request.data.data[0].employeeId;
        } catch (error){
            console.error('ERROR OrangeHRM | User with given ID was not found: ' + error);
        }
    }

    async addBonusSalary(id, year, amount){
        try{
            var emp_id = await this.resolveEmployeeId(id);
            var request = await axios.post(
                this.url+'/api/v1/employee/' + emp_id + '/bonussalary',
                {
                    'year':year,
                    'value':amount
                },
                {
                    headers:{
                        Authorization: 'Bearer ' + this.token
                    }
                }
            );
            console.log(request);
            console.log('OrangeHRM | bonus salary added');
        } catch (error){
            console.error('ERROR OrangeHRM | adding bonus salary failed: ' + error);
        }
    }
}

module.exports = OrangeHRMConnector;