

USE bamazon;

ALTER TABLE products ADD COLUMN product_sales DECIMAL(10,2);

DROP TABLE IF EXISTS departments;

CREATE TABLE departments (
    department_id INTEGER(5) NOT NULL AUTO_INCREMENT,
    department_name VARCHAR(55),
    over_head_costs DECIMAL(18,2),
    PRIMARY KEY(department_id)
);

INSERT INTO departments (department_name, over_head_costs)
VALUES ("electronics", 5457.85),
    ("home", 5879.48),
    ("office", 15789.45),
    ("furniture", 8763.15), 
    ("apparel", 3512.20),
    ("tools", 6853.12), 
    ("sporting", 4869.58),
    ("appliances", 16897.59);

SELECT * FROM departments;