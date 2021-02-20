class User{
    constructor(displayname, username, password,group, employeeId) {
        this.displayname = displayname;
        this.username = username;
        this.password = password;
        this.group = group;
        this.employeeId = employeeId;
    }
}

module.exports = User;
