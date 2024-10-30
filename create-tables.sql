-- Create your database tables here. Alternatively you may use an ORM
-- or whatever approach you prefer to initialize your database.
CREATE TABLE example_table (id SERIAL PRIMARY KEY, some_int INT, some_text TEXT);
INSERT INTO example_table (some_int, some_text) VALUES (123, 'hello');

CREATE TABLE IF NOT EXISTS layout_values (
    id SERIAL PRIMARY KEY,
    side VARCHAR(15) NOT NULL, -- e.g., 'marginTop', 'paddingLeft'
    value VARCHAR(10) NOT NULL -- Stores the value, e.g., 'auto' or a specific pixel value
);

INSERT INTO layout_values (side, value)
VALUES 
    ('marginTop', 'auto'),
    ('marginRight', 'auto'),
    ('marginBottom', 'auto'),
    ('marginLeft', 'auto'),
    ('paddingTop', 'auto'),
    ('paddingRight', 'auto'),
    ('paddingBottom', 'auto'),
    ('paddingLeft', 'auto');