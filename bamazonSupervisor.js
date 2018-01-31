var mysql = require('mysql');
var inquirer = require('inquirer');
var Table = require('cli-table');

var connection = mysql.createConnection({
    host: "localhost",
    port: 8889,

    // Your username
    user: "root",

    // Your password
    password: "root",
    database: "bamazon"
});


connection.connect(function(err) {
    if (err) throw err;

    console.log("Bamazon Supervisor\n");
    mainMenu();
});


function mainMenu() {
    inquirer.prompt([
        {
            type: "list",
            name: "list",
            message: "Select option below",
            choices: ["View Product Sales by Department", "Create New Department"]
        }
    ]).then(function(answer) {
        switch(answer.list) {
            case "View Product Sales by Department":
                viewSalesDept();
                break;
            case "Create New Department":
                createDept();
                break;
        }
    })
}


function viewSalesDept() {
    var table = new Table({
        head: ["DEPARTMENT ID", "DEPARTMENT NAME", "OVERHEAD COST", "PRODUCT SALES", "TOTAL PROFIT"],
        colWidths: [15, 25, 20, 20, 20]
    });

    connection.query("SELECT * FROM departments", function(err, res) {
        if (err) throw err;

        for (var i = 0; i < res.length; i++) {
            var totalProfit = (Math.round((res[i].total_profit -  res[i].over_head_costs) * 100)) / 100;
        }
    })
    
}

function createDept() {
    inquirer.prompt([
        {
            type: "input",
            name: "deptName",
            message: "Name of the Department you would like to add: "
        },{
            type: "input",
            name: "overHead",
            message: "Overhead Cost for this Department: $"
        }
    ]).then(function(answers) {
        var deptName = answers.deptName;
        var overHead = answers.overHead;

        connection.query("INSERT INTO departments SET ?", {
            department_name: deptName,
            over_head_costs: overHead
        }, function(err, res) {
            if (err) throw err;

            console.log("\nDepartment has been added");
        })
    })

}