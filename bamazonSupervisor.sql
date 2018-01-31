

USE bamazon;

ALTER TABLE products ADD COLUMN product_sales DECIMAL(10,2);

DROP TABLE IF EXISTS departments;

CREATE TABLE departments (
    department_id INTEGER(5) NOT NULL AUTO_INCREMENT,
    department_name VARCHAR(55),
    over_head_costs DECIMAL(18,2),
    PRIMARY KEY(department_id)
);