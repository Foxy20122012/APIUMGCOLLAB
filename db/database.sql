
CREATE TABLE Usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    correo VARCHAR(255) NOT NULL UNIQUE,
    contraseña VARCHAR(255) NOT NULL,
    rol ENUM('superadmin, administrador', 'usuario') NOT NULL
);
//Agregar dos campos mas a la tabla de usuarios
fecha_nacimiento DATE,
    activado BOOLEAN DEFAULT FALSE,



//Tabla de cursos

CREATE TABLE Cursos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    codigo VARCHAR(10) NOT NULL UNIQUE,
    nombre VARCHAR(255) NOT NULL,
    descripcion TEXT,
    creditos INT,
    semestre INT
);


//Tabla de Post


CREATE TABLE Posts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    titulo VARCHAR(255) NOT NULL,
    contenido TEXT NOT NULL,
    estado ENUM('pendiente', 'aprobado') NOT NULL DEFAULT 'pendiente',
    visible BOOLEAN DEFAULT TRUE,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    usuario_id INT,
    curso_id INT,
    FOREIGN KEY (usuario_id) REFERENCES Usuarios(id),
    FOREIGN KEY (curso_id) REFERENCES Cursos(id)
);


//Tabla de temas

CREATE TABLE Temas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    descripcion TEXT,
    curso_id INT,
    FOREIGN KEY (curso_id) REFERENCES Cursos(id)
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