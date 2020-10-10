

SELECT owner, table_name FROM all_tables WHERE OWNER = 'ADMIN';

create table test_table (id INT PRIMARY KEY NOT NULL);

INSERT INTO test_table ( id ) VALUES ( 1 );

SELECT * FROM test_table;