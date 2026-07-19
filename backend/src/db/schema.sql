create type employee_role as ENUM(
'SUPER_ADMIN',
'HR_MANAGER',
'EMPLOYEE'
)

create type employee_status as ENUM(
'INACTIVE',
'ACTIVE'
)

create table employees(
id uuid primary key default gen_random_uuid(),
employee_id varchar(20) unique not null,
name varchar(100) not null,
email varchar(100) unique not null,
password_hash text not null,
phone varchar(20) not null,
department varchar(50) not null,
designation varchar(100) not null,
salary decimal(10,2) not null,
joining_date date not null,
status employee_status default 'ACTIVE',
role employee_role default 'EMPLOYEE',
manager_id uuid references employees(id) ON DELETE SET NULL,
profile_image TEXT,
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);