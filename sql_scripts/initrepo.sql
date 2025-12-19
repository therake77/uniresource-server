CREATE DATABASE repositorio;

INSERT INTO role ("role_name","description") VALUES
('USER','User role'),
('COLLAB','Collab role'),
('ADMIN','Admin role')
ON CONFLICT("role_name") DO NOTHING;

INSERT INTO permit ("permit_name","description") VALUES
('canAccess','Grants access to the platform'),
('canDownload','Grants access to download resources'),
('canVisualize','Grants permission to visualize resources'),
('canModify','Grants permission of modification'),
('canMaintain','Grants access of maintenance'),
('canUpload','Grants access of uploading new resources')
ON CONFLICT("permit_name") DO NOTHING;

INSERT INTO permit_role_role VALUES
(1,1),
(1,2),
(1,3),
(2,1),
(2,2),
(3,1),
(3,2),
(4,3),
(5,3),
(6,2)
ON CONFLICT ("permitPermitId","roleRoleId") DO NOTHING;

INSERT INTO user_entity VALUES 
(DEFAULT, 'admin', 'admin@admin.com','' )