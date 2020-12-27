const axios = require('axios');
const FormData = require('form-data');
const NoElementFoundError = require("../custom_errors/NoElementFoundError");

class OrangeHRMConnector{

    constructor(url, username, password, smUnit) {
        this.url = url;
        this.username = username;
        this.password = password;
        this.smUnit = smUnit;

        this.getToken();
    }

    /**
     * retrieves a bearer-token from the OrangeHRM-Server
     * @returns {Promise<void>}
     */
    async getToken(){
        try{
            let request = await axios.post(
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

    /**
     * resolves the OrangeHRM-internal User-ID from the company-wide Id
     * @param id company-wide employee-Id
     * @returns {Promise<*>}
     */
    async resolveEmployeeId(id) {
        try {
            let request = await axios.get(
                this.url + '/api/v1/employee/search?code=' + id,
                {
                    headers: {
                        Authorization: 'Bearer ' + this.token
                    }
                }
            );
            return request.data.data[0].employeeId;
        } catch (error) {
            throw new NoElementFoundError('ERROR OrangeHRM | User with given ID was not found: ' + error);
        }
    }

    /**
     * gets the general information about an employee which is stored in orangeHRM
     * @param id company-wide employee-Id
     * @returns {Promise<*>}
     */
    async getEmployeeInfo(id){
        let emp_id = await this.resolveEmployeeId(id);
        try{
            let request = await axios.get(
                this.url+'/api/v1/employee/' + emp_id,
                {
                    headers:{
                        Authorization: 'Bearer ' + this.token
                    }
                }
            );
            return request.data.data;
        } catch (error){
            throw new NoElementFoundError('ERROR OrangeHRM | User with given ID was not found: ' + error);
        }
    }

    /**
     * returns all salesmen if the ID of the salesmen unit was specified
     * @returns {Promise<*>}
     */
    async getSalesmen(){
        if(this.smUnit !== undefined){
            try{
                let request = await axios.get(
                    this.url+'/api/v1/employee/search?unit=' + this.smUnit,
                    {
                        headers:{
                            Authorization: 'Bearer ' + this.token
                        }
                    }
                );
                return request.data.data;
            } catch (error){
                throw new NoElementFoundError('ERROR OrangeHRM | Unable to find salesmen: ' + error);
            }
        }else{
            throw new NoElementFoundError('ERROR OrangeHRM | No unit-ID for salesmen specified!');
        }
    }

    /**
     * adds a bonus salary to the specified salesman
     * @param id Id of a salesman
     * @param year Year, in which the salary is / was payed
     * @param amount Amount of money payed
     * @returns {Promise<void>}
     */
    async addBonusSalary(id, year, amount){
        let formData = new FormData();
        formData.append('year', year);
        formData.append('value', amount);

        try{
            let emp_id = await this.resolveEmployeeId(id);
            let request = await axios.post(
                this.url+'/api/v1/employee/' + emp_id + '/bonussalary',
                formData,
                {
                    headers:{
                        Authorization: 'Bearer ' + this.token,
                        'Content-Type':'multipart/form-data; boundary='+formData.getBoundary()
                    }
                }
            );
            console.log('OrangeHRM | bonus salary added');
        } catch (error){
            throw new Error('ERROR OrangeHRM | adding bonus salary failed: ' + error);
        }
    }
}

module.exports = OrangeHRMConnector;