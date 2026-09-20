CREATE TABLE IF NOT EXISTS products (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  product VARCHAR(100) NOT NULL
);

INSERT INTO products (name, product) VALUES
('Ravi Kumar', 'Wireless Mouse'),
('Sara Khan', 'Mechanical Keyboard'),
('Ali Raza', 'USB-C Hub'),
('Fatima Noor', 'Laptop Stand'),
('Ahmed Malik', 'Noise-Cancelling Headphones');
