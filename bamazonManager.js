
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

    console.log("Bamazon Manager\n");
    mainMenu();
});


function mainMenu() {
    console.log("\nBAMAZON MAIN MENU");

    inquirer.prompt([
        {
            type: "list",
            name: "list",
            message: "\nSelect an option below",
            choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product", "Exit"]
        }
    ]).then(function(answer) {
        switch(answer.list) {
            case "View Products for Sale":
                displayInventory();
                break;
            case "View Low Inventory":
                lowIntentory();
                break;
            case "Add to Inventory":
                addIntentory();
                break;
            case "Add New Product":
                addProduct();
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

        
    })
}

function lowIntentory() {

        connection.query("SELECT * FROM products WHERE stock_quantity < 5", function(err, data) {
            if (err) throw err;

            console.log("\nLow Inventory Products");

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


        })

}

function addIntentory() {
    displayInventory();

    inquirer.prompt([
        {
            type: "input",
            name: "itemID",
            message: "Enter ID of product you would like to update inventory"
        }, {
            type: "input",
            name: "quantity",
            message: "How many units would you like to add?"
        }
    ]).then(function(answer) {
        var itemID = answer.itemID;
        var quantity = answer.quantity;

        connection.query("SELECT stock_quantity FROM products WHERE ?", [{item_id: itemID}], function(err, res) {
            if (err) throw err;
        
            var newQuantity = +res[0].stock_quantity + +quantity;
            connection.query("UPDATE products SET ? WHERE ?", [{stock_quantity: newQuantity}, {item_id: itemID}])

            console.log("Inventory has been updated");
        })

    })
}


function addProduct() {
    inquirer.prompt([
        {
            type: "input",
            name: "productName",
            message: "Name of Proeduct: "
        },
        {
            type: "list",
            name: "departmentName",
            message: "Department Name: ",
            choices: ["electronics", "home", "office", "furniture", "apparel", "tools", "sporting", "appliances"]
        },
        {
            type: "input",
            name: "price",
            message: "Price: $"
        },
        {
            type: "input",
            name: "stockQuantity",
            message: "Stock Quantity: "
        }
    ]).then(function(answers) {
        var productName = answers.productName;
        var departmentName = answers.departmentName;
        var ANSprice = answers.price;
        var stockQuantity = answers.stockQuantity;


        connection.query("INSERT INTO products SET ?", {
            product_name: productName,
            department_name: departmentName,
            price: ANSprice,
            stock_quantity: stockQuantity,
            product_sales: 0
        }, function(err, res) {
            if (err) throw err;

            console.log("Item Added to Inventory");
        })

    })


}