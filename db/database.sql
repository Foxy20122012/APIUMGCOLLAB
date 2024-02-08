
CREATE TABLE Usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    correo VARCHAR(255) NOT NULL UNIQUE,
    contraseña VARCHAR(255) NOT NULL,
    rol ENUM('administrador', 'usuario') NOT NULL
);


CREATE TABLE links(
 id INT(11) NOT NULL,
 title VARCHAR(150) NOT NULL,
 url VARCHAR(255) NOT NULL,
 description TEXT,
 usuarios_id INT(11) NOT NULL, -- Asegúrate de que no permita valores nulos
 create_at TIMESTAMP NOT NULL DEFAULT current_timestamp,
 CONSTRAINT fk_usuarios FOREIGN KEY (usuarios_id) REFERENCES Usuarios(id) -- Asegúrate de que el nombre de la tabla sea 'Usuarios' y no 'usuarios'
);


ALTER TABLE links ADD PRIMARY KEY(id);