-- SELECT * FROM users;
-- SHOW TABLES;
-- DESCRIBE users;
-- 
-- 



-- CREATE TABLE university (
--     id int(11) NOT NULL AUTO_INCREMENT,
--     name varchar(255) NOT NULL,
--     city varchar(100) NOT NULL,
--     type varchar(50) NOT NULL,
--     website varchar(255) NOT NULL,
--     times_ranking varchar(50) NOT NULL,
--     world_ranking varchar(50) NOT NULL,
--     hec_ranking varchar(50) NOT NULL,
--     sector varchar(10) NOT NULL,
--     PRIMARY KEY (id)

-- );

-- DESCRIBE university;


-- SELECT * FROM university;

-- INSERT INTO university (name, city, type, website, times_ranking, world_ranking, hec_ranking, sector) 
-- VALUES ('Punjab Universit', 'Lahore', 'General', 'http://www.pu.edu.pk/', '200-400', '200-500', '8', 'Public');

-- UPDATE university SET name = 'Punjab University' WHERE id = 2;
-- SELECT * FROM university;



-- INSERT INTO university (name, city, type, website, times_ranking, world_ranking, hec_ranking, sector) 
-- VALUES ('National University of Science and Technology', 'Islamabad', 'Engineering', 'https://nust.edu.pk/', '100-150', '120-300', '3', 'Public');

-- SELECT * FROM university;


-- CREATE table degree (
--     degree_id int(11) NOT NULL AUTO_INCREMENT,
--     degree_name varchar(255) NOT NULL,
--     degree_level varchar(255) NOT NULL,
--     duration int(11) NOT NULL,
--     last_updated timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
--     fee int(11) NOT NULL,
--     years int(11) NOT NULL,
--     university_id int(11) NOT NULL,
--     foreign key (university_id) references university(id),
--     PRIMARY KEY (degree_id)
-- );

-- DESCRIBE degree;

-- insert into degree (degree_name, degree_level, duration, fee, years, university_id) 
-- values ('Bachelors in Computer Science', 'Bachelor', 4, 135000, 4, 1);

-- UPDATE degree SET degree_name = 'Computer Science' WHERE degree_id = 1;




-- insert into degree (degree_name, degree_level, duration, fee, years, university_id) 
-- values ('Business Administration', 'Bachelor', 4, 240000, 4, 3);


-- ALTER TABLE degree
-- drop column years;

-- insert into degree (degree_name, degree_level, duration, fee, university_id) 
-- values ('Electrical Engineering', 'Bachelors', 4, 240000,3);

-- SELECT * FROM degree;


-- SELECT university.name, university.city, university.type,university.website,
-- university.times_ranking,university.world_ranking,university.hec_ranking,university.sector 
-- FROM university 
-- INNER JOIN degree ON university.id = degree.university_id 
-- WHERE degree.degree_level like %Bachelor% AND 
-- degree.degree_name like '%Computer Science%' AND 
-- university.sector like '%Public%' AND 
-- university.type like '%%' AND 
-- university.city like '%Lahore%';

-- SELECT university.name, university.city, university.type,university.website,university.times_ranking,
-- university.world_ranking,university.hec_ranking,university.sector 
-- FROM university 
-- JOIN degree ON university.id = degree.university_id 
-- WHERE degree.degree_level like '%Bachelors%' AND
--  degree.degree_name like '%Computer Science%' AND
--   university.sector like '%Public%' AND 
--   university.type like '%IT%' AND
--    university.city like '%Lahore%';


-- UPDATE degree set degree_level = 'Bachelors' where degree_level = 'Bachelor';



-- SELECT * FROM users;

-- delete from users where password like '%123%';

SELECT * FROM degree;


