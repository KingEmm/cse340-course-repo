CREATE TABLE organization (
    organization_id SERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    description TEXT NOT NULL,
    contact_email VARCHAR(255) NOT NULL,
    logo_filename VARCHAR(255) NOT NULL
);


INSERT INTO organization (name, description, contact_email, logo_filename)
VALUES
('Flux Forge Nonprofit Partners', 'Work with charity organizations that need student support for outreach systems, volunteer coordination, and impact reporting.', 'info@fluxforge.org', 'flux_forge.png'),
('Nova Byte Initiatives', 'Join student-led groups and department programs focused on mentoring, sustainability, and improving campus services.', 'contact@novabyte.org', 'nova_byte.png'),
('Terra Pulse', 'Terra helps you collaborate with community enterprises on technology solutions that increase efficiency, accessibility, and customer engagement.', 'hello@terrapulse.org', 'terra_pulse.png');


CREATE TABLE projects (
    project_id SERIAL PRIMARY KEY,
    organization_id INTEGER NOT NULL,
    title VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    location VARCHAR(255) NOT NULL,
    project_date DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_organization
        FOREIGN KEY (organization_id)
        REFERENCES organization(organization_id)
        ON DELETE CASCADE
);

INSERT INTO projects (
    organization_id,
    title,
    description,
    location,
    project_date
)
VALUES
-- Organization 1
(1, 'Community Health Outreach', 'Free medical outreach program for rural communities.', 'Lagos', '2026-01-10'),
(1, 'Youth Coding Bootcamp', 'Training young students in software development.', 'Abuja', '2026-02-15'),
(1, 'Food Distribution Initiative', 'Distribution of food supplies to low-income families.', 'Kano', '2026-03-12'),
(1, 'Clean Water Campaign', 'Installation of clean water systems in villages.', 'Kaduna', '2026-04-08'),
(1, 'Women Empowerment Summit', 'Business and leadership workshops for women.', 'Port Harcourt', '2026-05-20'),

-- Organization 2
(2, 'School Renovation Project', 'Renovation of public primary schools.', 'Ibadan', '2026-01-18'),
(2, 'Tree Planting Exercise', 'Environmental sustainability awareness campaign.', 'Enugu', '2026-02-25'),
(2, 'Tech for Teens', 'Technology education program for teenagers.', 'Lagos', '2026-03-30'),
(2, 'Agricultural Support Program', 'Providing modern farming tools to farmers.', 'Jos', '2026-04-14'),
(2, 'Disaster Relief Campaign', 'Emergency response and relief materials.', 'Maiduguri', '2026-05-28'),

-- Organization 3
(3, 'Scholarship Award Program', 'Scholarships for underprivileged students.', 'Benin City', '2026-01-22'),
(3, 'Vocational Training Center', 'Skills acquisition training for unemployed youths.', 'Owerri', '2026-02-11'),
(3, 'Mobile Clinic Services', 'Healthcare access in remote communities.', 'Abeokuta', '2026-03-09'),
(3, 'Road Safety Awareness', 'Public sensitization on traffic safety.', 'Ilorin', '2026-04-19'),
(3, 'Digital Literacy Campaign', 'Computer literacy classes for adults.', 'Uyo', '2026-05-06');


 SELECT o.name, p.title, p.description, p.location, p.project_date
      FROM projects p
      JOIN organization o ON p.organization_id = o.organization_id;

CREATE TABLE categories (
    category_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE
);

select * from categories;

INSERT INTO categories (
	name
)
VALUES ('Education'), ('Healthcare'), ('Environment');

CREATE TABLE project_category (
    category_id INTEGER NOT NULL,
    project_id INTEGER NOT NULL,

    PRIMARY KEY (project_id, category_id),

    CONSTRAINT fk_project
        FOREIGN KEY (project_id)
        REFERENCES projects(project_id)
        ON DELETE CASCADE,

    CONSTRAINT fk_category
        FOREIGN KEY (category_id)
        REFERENCES categories(category_id)
        ON DELETE CASCADE
);

INSERT INTO project_category (category_id, project_id)
VALUES (2, 1), (1, 2), (2, 3), (3, 4), (1, 5), (1, 6), (3, 7),
(1, 8), (3, 9), (3, 10), (1, 11), (1, 12), (2,13), (3, 14), (1, 15);

select * from project_category;
