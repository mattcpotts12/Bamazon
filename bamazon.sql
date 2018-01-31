-- create a database called "bamazon"
CREATE DATABASE bamazon;
USE bamazon;

DROP TABLE IF EXISTS products;

CREATE TABLE products (
    item_id INTEGER(5) NOT NULL AUTO_INCREMENT,
    product_name VARCHAR(55),
    department_name VARCHAR(55),
    price DECIMAL(18,2),
    stock_quantity INTEGER(5),
    PRIMARY KEY(item_id)
);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("lamp", "home", 45.05, 30),
    ("headphones", "electronics", 79.99, 80),
    ("blanket", "home", 24.99, 51),
    ("stapler", "office", 21.15, 88),
    ("camera", "electronics", 159.99, 12),
    ("mattress", "furniture", 499.99, 10),
    ("watch", "apparel", 45, 30),
    ("hammer", "tools", 20.00, 55),
    ("football", "sporting", 19.99, 42),
    ("tent", "outdoors", 155.59, 20);



SELECT * FROM products;