const axios = require('axios');

class OpenCRXConnector {

    constructor(url, username, password) {
        this.url = url;
        this.username = username;
        this.password = password;
    }


    async getUserByGovernmentId(id) {
        try {
            let request = await axios.get(
                this.url + 'account1/provider/CRX/segment/Standard/account?query=thereExistsGovernmentId%28%29.equalTo%28%22' + id + '%22%29',
                {
                    auth: {
                        'username': this.username,
                        'password': this.password
                    }
                }
            );
            return request.data.objects[0];
        } catch (error) {
            console.error('ERROR OpenCRX | something has gone wrong: ' + error);
        }
    }

    async getSalesOrderByAccountId(salesman) {
        try {
            let request = await axios.get(
                this.url + 'contract1/provider/CRX/segment/Standard/salesOrder?query=thereExistsSalesRep%28%29.equalTo%28%22' + salesman + '%22%29',
                {
                    auth: {
                        'username': this.username,
                        'password': this.password
                    }
                }
            );
            return request.data.objects;
        } catch (error) {
            console.error('ERROR OpenCRX | something has gone wrong: ' + error);
        }
    }

    async getContractPositions(foundUrl) {
        try {
            let request = await axios.get(
                foundUrl + "/position",
                {
                    auth: {
                        'username': this.username,
                        'password': this.password
                    }
                }
            );
            return request.data;
        } catch (error) {
            console.error('ERROR OpenCRX | something has gone wrong: ' + error);
        }
    }

    async getProduct(foundUrl) {
        try {
            let request = await axios.get(
                foundUrl,
                {
                    auth: {
                        'username': this.username,
                        'password': this.password
                    }
                }
            );
            return request.data;
        } catch (error) {
            console.error('ERROR OpenCRX | something has gone wrong: ' + error);
        }
    }

    async getCustomer(foundUrl) {
        try {
            let request = await axios.get(
                foundUrl,
                {
                    auth: {
                        'username': this.username,
                        'password': this.password
                    }
                }
            );
            return request.data;
        } catch (error) {
            console.error('ERROR OpenCRX | something has gone wrong: ' + error);
        }
    }

    async getAll(id, year) {
        //to return
        let ret = {
            salesman_id: id,
            year: year,
            products: [],
            remarks: "test"
        }

        //get the salsman
        let salesman = await this.getUserByGovernmentId(id);
        //get the openCRX intern id
        let openCRXID = salesman.externalLink._item[0].$.replace('VCARD:', '');
        //get all orders
        let orders = await this.getSalesOrderByAccountId("xri://@openmdx*org.opencrx.kernel.account1/provider/CRX/segment/Standard/account/" + openCRXID);
        //filter the orders with the given year
        orders = orders.filter(x => x.activeOn.substr(0, 4) === year);
        //map the orders into the return array
        for (let i = 0; i < orders.length; i++) {
            //product site
            let foundUrl = orders[i]["@href"];
            let orderProduct = (await this.getContractPositions(foundUrl)).objects;
            //customer site
            let foundUrl2 = orders[i].customer["@href"];
            let orderCustomer = await this.getCustomer(foundUrl2);
            //in case of more then one product per customer
            for (let j = 0; j < orderProduct.length; j++) {
                let productName = (await this.getProduct(orderProduct[j].product["@href"])).name;
                let quantity = orderProduct[j].quantityBackOrdered;
                let customerName = orderCustomer.fullName;
                let rating = orderCustomer.accountRating;
                ret.products.push({
                    name: productName,
                    quantity: parseInt(quantity),
                    customer: {
                        name: customerName,
                        rating: rating
                    },
                    bonus: 1000
                })
            }
        }
        return ret;
    }
}

module.exports = OpenCRXConnector;
