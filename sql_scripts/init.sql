-- Initialize PostgreSQL database for uniresource-server
-- This script sets up the schema and initial data

-- Create role table
CREATE TABLE role (
    role_id SERIAL PRIMARY KEY,
    role_name VARCHAR NOT NULL UNIQUE,
    description TEXT NOT NULL
);

-- Create permit table
CREATE TABLE permit (
    permit_id SERIAL PRIMARY KEY,
    permit_name VARCHAR NOT NULL UNIQUE,
    description TEXT NOT NULL
);

-- Create permit_role_role junction table
CREATE TABLE permit_role_role (
    "permitPermitId" INTEGER NOT NULL,
    "roleRoleId" INTEGER NOT NULL,
    PRIMARY KEY ("permitPermitId", "roleRoleId"),
    FOREIGN KEY ("permitPermitId") REFERENCES permit(permit_id) ON UPDATE CASCADE ON DELETE CASCADE,
    FOREIGN KEY ("roleRoleId") REFERENCES role(role_id)
);

-- Create user_entity table
CREATE TABLE user_entity (
    user_id SERIAL PRIMARY KEY,
    username VARCHAR NOT NULL,
    email VARCHAR NOT NULL UNIQUE,
    password VARCHAR NOT NULL
);

-- Create user_entity_roles_role junction table
CREATE TABLE user_entity_roles_role (
    "userEntityUserId" INTEGER NOT NULL,
    "roleRoleId" INTEGER NOT NULL,
    PRIMARY KEY ("userEntityUserId", "roleRoleId"),
    FOREIGN KEY ("userEntityUserId") REFERENCES user_entity(user_id) ON UPDATE CASCADE ON DELETE CASCADE,
    FOREIGN KEY ("roleRoleId") REFERENCES role(role_id)
);

-- Create user_entity_permits_permit junction table
CREATE TABLE user_entity_permits_permit (
    "userEntityUserId" INTEGER NOT NULL,
    "permitPermitId" INTEGER NOT NULL,
    PRIMARY KEY ("userEntityUserId", "permitPermitId"),
    FOREIGN KEY ("userEntityUserId") REFERENCES user_entity(user_id) ON UPDATE CASCADE ON DELETE CASCADE,
    FOREIGN KEY ("permitPermitId") REFERENCES permit(permit_id)
);

-- Create indexes
CREATE INDEX "IDX_4048cc808983058fb35bcdd9de" ON user_entity_roles_role("roleRoleId");
CREATE INDEX "IDX_8c8ac02e98d1e6722ff4ef0211" ON permit_role_role("roleRoleId");
CREATE INDEX "IDX_984d12184bf030abf1056a44cf" ON permit_role_role("permitPermitId");
CREATE INDEX "IDX_b702226f70bb67eab331f4dec5" ON user_entity_permits_permit("permitPermitId");
CREATE INDEX "IDX_eeca5f789f30cb057138de5345" ON user_entity_roles_role("userEntityUserId");
CREATE INDEX "IDX_fefaea1ad141cea74c858dfcba" ON user_entity_permits_permit("userEntityUserId");

-- Insert roles
INSERT INTO role (role_id, role_name, description) VALUES
(1, 'USER', 'User role'),
(2, 'COLLAB', 'Collab role'),
(3, 'ADMIN', 'Admin role');

-- Insert permits
INSERT INTO permit (permit_id, permit_name, description) VALUES
(1, 'canAccess', 'Grants access to the platform'),
(2, 'canDownload', 'Grants access to download resources'),
(3, 'canVisualize', 'Grants permission to visualize resources'),
(4, 'canModify', 'Grants permission of modification'),
(5, 'canMaintain', 'Grants access of maintenance'),
(6, 'canUpload', 'Grants access of uploading new resources');

-- Insert permit-role relations
INSERT INTO permit_role_role ("permitPermitId", "roleRoleId") VALUES
(1, 1), (1, 2), (1, 3),
(2, 1), (2, 2),
(3, 1), (3, 2),
(4, 3),
(5, 3),
(6, 2);

-- Insert admin user
INSERT INTO user_entity (user_id, username, email, password) VALUES
(1, 'admin', 'admin@admin.com', 'admin');

-- Grant admin user all roles
INSERT INTO user_entity_roles_role ("userEntityUserId", "roleRoleId") VALUES
(1, 1), (1, 2), (1, 3);

-- Grant admin user all permits
INSERT INTO user_entity_permits_permit ("userEntityUserId", "permitPermitId") VALUES
(1, 1), (1, 2), (1, 3), (1, 4), (1, 5), (1, 6);

-- Reset sequences
SELECT setval('role_role_id_seq', 3);
SELECT setval('permit_permit_id_seq', 6);
SELECT setval('user_entity_user_id_seq', 1);
