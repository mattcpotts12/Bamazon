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

    console.log("Welcome to Bamazon!\n");
    displayInventory();
});



function timeOut() {
    function myFunc() {
        mainMenu();

    }
    setTimeout(myFunc, 5500);
}


function mainMenu() {
    console.log("\nBAMAZON MAIN MENU");

    inquirer.prompt([
        {
            type: "list",
            name: "list",
            message: "Select an option below",
            choices: ["View Inventory", "Exit"]
        }
    ]).then(function(answer) {
        switch(answer.list) {
            case "View Inventory":
                displayInventory();
                break;
            case "Exit":
                console.log("Goodbye");
                break;
        }
    })
}

function displayInventory() {
    var query = "SELECT * FROM products";

    connection.query(query, function(err, data) {
        if (err) throw err;

        console.log("Inventory List: \n");

        var table = new Table({
            head: ["ID", "PRODUCT", "DEPARTMENT", "PRICE $", "STOCK QUANTITY"],
            colWidths: [15, 30, 30, 15, 30]
        });

        for (var i = 0; i < data.length; i++) {
            table.push([
                data[i].item_id,
                data[i].product_name, 
                data[i].department_name, 
                data[i].price, 
                data[i].stock_quantity
            ]);
            
        }
        console.log(table.toString());

        selectProduct();
    })
}


function selectProduct() {
    inquirer.prompt([
        {
            type: "input",
            name: "itemID",
            message: "Input ID of product you would like to purchase"
        },{
            type: "input", 
            name: "quantity",
            message: "How many units would you like to purchase?"
        }
    ]).then(function(answer) {
        var itemID = answer.itemID;
        var quantity = answer.quantity;

        var query = "SELECT * FROM products WHERE item_id = " + itemID;

        connection.query(query, function(err, res) {
            if (err) throw err;

            if (quantity <= res[0].stock_quantity) {
                console.log("item in stock");

                var totalCost = quantity * res[0].price;

                console.log("\nORDER DETAILS:");

                //creates a table to display the order details [ PRODUCT | QUANTITY | TOTAL COST]
                var table = new Table({
                    head: ["PRODUCT", "QUANTITY", "TOTAL COST"],
                    colWidths: [20, 15, 20]
                });
                table.push([res[0].product_name, quantity, totalCost]);
                console.log(table.toString());

                inquirer.prompt([
                    {
                        type: "confirm",
                        name: "confirm",
                        message: "Enter yes to complete this order"
                    }
                ]).then(function(answer) {
                    switch(answer.confirm) {
                        case true:
                            console.log("Your Order has been placed.")
                            //updates database with new quantity
                            connection.query("UPDATE products SET stock_quantity = stock_quantity - " + quantity + " WHERE item_id = " + itemID);     
                            //updates product_sales

                            connection.query("UPDATE products SET product_sales = product_sales + " + totalCost + " WHERE item_id + " + itemID);
                            timeOut();
                            break;
                        case false:
                            console.log("Sorry to hear that");
                            timeOut();
                            break;
                    }
                })
   
                
            }else {
                console.log("Insufficient quantity");
                console.log("Sorry.  We only have " + quantity + " units in stock at the moment");


            }
        })
    })
}