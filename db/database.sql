
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

//Tabla catedraticos

CREATE TABLE catedraticos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(255) NOT NULL,
  titulo VARCHAR(255),
  email VARCHAR(255) UNIQUE
);
INSERT INTO catedraticos (nombre, titulo, email) VALUES
('Aldrin Lopez', 'Profesor en fisica Matematica', 'aldrinlopez@gmail.com'),
('Carlos cuc', 'Profesor de enseñanza media', 'carloscuc@gmail.com'),
('Danilo Bueno', 'Profesor de enseñanza media', 'danilobuezo@gmail.com');


//Tabla intermediaria para manejar la relación de muchos a muchos

CREATE TABLE curso_catedratico (
    curso_id INT,
    catedratico_id INT,
    FOREIGN KEY (curso_id) REFERENCES Cursos(id) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (catedratico_id) REFERENCES catedraticos(id) ON DELETE CASCADE ON UPDATE CASCADE,
    PRIMARY KEY (curso_id, catedratico_id)
);
//Agregación de campos a la tabla curso_catedratico
ALTER TABLE curso_catedratico
ADD nombre_curso VARCHAR(255),
ADD nombre_catedratico VARCHAR(255);




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


//Datos de prueba
//Curso
INSERT INTO Cursos (codigo, nombre, descripcion, creditos, semestre)
VALUES ('IA101', 'Inteligencia Artificial', 'Curso sobre los fundamentos y aplicaciones de la inteligencia artificial.', 4, 6);







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

