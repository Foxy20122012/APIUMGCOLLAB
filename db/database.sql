
CREATE TABLE Usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    correo VARCHAR(255) NOT NULL UNIQUE,
    contraseña VARCHAR(255) NOT NULL,
    rol ENUM('superadmin', 'administrador', 'usuario','Qa') NOT NULL
);
-- Cambiar el nombre del campo 'ctivado' a 'activo'
ALTER TABLE Usuarios
CHANGE COLUMN ctivado activo TINYINT(1) DEFAULT 1;

-- Agregar nuevos campos a la tabla 'Usuarios'
ALTER TABLE Usuarios
ADD COLUMN direccion VARCHAR(255) NULL AFTER fecha_nacimiento, 
ADD COLUMN genero ENUM('masculino', 'femenino', 'otro') NULL AFTER direccion, 
ADD COLUMN fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP AFTER genero, 
ADD COLUMN ultima_fecha_acceso TIMESTAMP NULL DEFAULT NULL AFTER fecha_registro, 
ADD COLUMN numero_identificacion VARCHAR(20) NULL AFTER ultima_fecha_acceso, 
ADD COLUMN estado_civil ENUM('soltero', 'casado', 'divorciado', 'viudo', 'otro') NULL AFTER numero_identificacion, 
ADD COLUMN ocupacion VARCHAR(255) NULL AFTER estado_civil, 
ADD COLUMN intereses TEXT NULL AFTER ocupacion, 
ADD COLUMN preferencias_notificacion JSON NULL AFTER intereses, 
ADD COLUMN email_verificado TINYINT(1) DEFAULT 0 AFTER preferencias_notificacion, 
ADD COLUMN telefono_verificado TINYINT(1) DEFAULT 0 AFTER email_verificado, 
ADD COLUMN firma_digital BLOB NULL AFTER telefono_verificado, 
ADD COLUMN biometria BLOB NULL AFTER firma_digital, 
ADD COLUMN historial_login JSON NULL AFTER biometria;
//Agregar dos campos mas a la tabla de usuarios
// Campo en comun entre usuario y catedraticos para actualizaciones 
ALTER TABLE Usuarios ADD COLUMN codigo_usuario VARCHAR(255) NOT NULL AFTER id;
ALTER TABLE Catedraticos ADD COLUMN codigo_usuario VARCHAR(255) NOT NULL AFTER id;

    activado BOOLEAN DEFAULT FALSE,

//Agregando campos para imagen, telefono y apellido de Usuarios.
ALTER TABLE Usuarios
ADD COLUMN imagen_perfil BLOB AFTER contraseña,
ADD COLUMN telefono VARCHAR(20) AFTER imagen_perfil,
ADD COLUMN apellido VARCHAR(255) AFTER telefono;
ALTER TABLE usuarios
ADD COLUMN puesto VARCHAR(255),
ADD COLUMN id_posicion INT;
ADD fecha_nacimiento DATE;
ADD ctivado BOOLEAN DEFAULT TRUE;

ALTER TABLE Usuarios ADD COLUMN nombre_usuario_actualizador VARCHAR(255) DEFAULT NULL;




//Tabla de cursos

CREATE TABLE Cursos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    codigo VARCHAR(10) NOT NULL UNIQUE,
    nombre VARCHAR(255) NOT NULL,
    descripcion TEXT,
    año INT
);

ALTER TABLE Cursos
CHANGE COLUMN semestre año INT(11) NOT NULL AFTER descripcion,
DROP COLUMN requisitos;


//Tabla catedraticos

CREATE TABLE catedraticos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(255) NOT NULL,
  titulo VARCHAR(255),
  email VARCHAR(255) UNIQUE
);
ALTER TABLE catedraticos
ADD COLUMN contraseña VARCHAR(255)

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
    estado ENUM('pendiente', 'aprobado','rechazado') NOT NULL DEFAULT 'pendiente',
    visible BOOLEAN DEFAULT TRUE,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    usuario_id INT,
    curso_id INT,
    FOREIGN KEY (usuario_id) REFERENCES Usuarios(id),
    FOREIGN KEY (curso_id) REFERENCES Cursos(id)
);
ALTER TABLE Posts ADD nombre VARCHAR(255) NOT NULL;



//Tabla de temas

CREATE TABLE Temas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    descripcion TEXT,
    curso_id INT,
    FOREIGN KEY (curso_id) REFERENCES Cursos(id)
);

ALTER TABLE Temas ADD COLUMN nombre_curso VARCHAR(255);



//Datos de prueba
//Curso
INSERT INTO Cursos (codigo, nombre, descripcion)
VALUES ('IA101', 'Inteligencia Artificial', 'Curso sobre los fundamentos y aplicaciones de la inteligencia artificial.');


//Tabla de estudiantes

CREATE TABLE Estudiantes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    apellido VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE
);

ALTER TABLE Estudiantes
ADD COLUMN fecha_nacimiento DATE,
ADD COLUMN genero VARCHAR(10),
ADD COLUMN telefono VARCHAR(20),
ADD COLUMN direccion TEXT;

ALTER TABLE Estudiantes
ADD COLUMN contraseña VARCHAR(255)

//Datos de prueba

INSERT INTO Estudiantes (nombre, apellido, email, fecha_nacimiento, genero, telefono, direccion) VALUES
('Juan', 'Pérez', 'juan.perez@example.com', '1990-01-01', 'Masculino', '1234567890', 'Calle Falsa 123'),
('María', 'López', 'maria.lopez@example.com', '1992-02-02', 'Femenino', '2345678901', 'Avenida Siempre Viva 456'),
('Carlos', 'García', 'carlos.garcia@example.com', '1993-03-03', 'Masculino', '3456789012', 'Boulevard Los Olivos 789'),
('Ana', 'Martínez', 'ana.martinez@example.com', '1994-04-04', 'Femenino', '4567890123', 'Plaza Central 101'),
('Luis', 'Hernández', 'luis.hernandez@example.com', '1995-05-05', 'Masculino', '5678901234', 'Callejón del Beso 202');


//Tabla Transcisional para manejar la relacion entre el estudiante el curso y el catedratico_id

CREATE TABLE curso_estudiante (
    curso_id INT,
    estudiante_id INT,
    FOREIGN KEY (curso_id) REFERENCES Cursos(id),
    FOREIGN KEY (estudiante_id) REFERENCES Estudiantes(id),
    PRIMARY KEY (curso_id, estudiante_id)
);

ALTER TABLE curso_estudiante
ADD COLUMN nombre_curso VARCHAR(255),
ADD COLUMN fecha_asignacion DATE,
ADD COLUMN catedratico_id INT,
ADD FOREIGN KEY (catedratico_id) REFERENCES catedraticos(id);
ALTER TABLE curso_estudiante
ADD COLUMN nombre_estudiante VARCHAR(255)
ALTER TABLE curso_estudiante
ADD COLUMN nombre_catedratico VARCHAR(255)

//Datos de prueba

INSERT INTO curso_estudiante ( nombre_curso, nombre_estudiante, nombre_catedratico) VALUES
( 'Matematicas', 'Juan', 'Aldrin Lopez'),
( 'Matematicas', 'Maria', 'Aldrin Lopez'),
( 'Matematicas', 'Carlos', 'Aldrin Lopez'),
( 'Matematicas', 'Ana', 'Aldrin Lopez'),
( 'Matematicas', 'Luis', 'Aldrin Lopez');


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



//Tabla para categorias

-- Creating the Categoria table (This table stores the general category information)
CREATE TABLE Categoria (
    id_categoria INT PRIMARY KEY AUTO_INCREMENT,
    numero_categoria INT UNIQUE NOT NULL,
    id_usuario_creador INT,
    fecha_creado TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_usuario_creador) REFERENCES Usuarios(id)
);

ALTER TABLE Categoria
ADD COLUMN descripcion TEXT AFTER numero_categoria,
ADD COLUMN alias VARCHAR(100) AFTER descripcion;

ALTER TABLE Categoria
ADD COLUMN estado ENUM('activo', 'inactivo') DEFAULT 'activo' AFTER alias;


-- Creating the Categoria_Detalle table (This table stores the detailed information related to each category)
CREATE TABLE Categoria_Detalle (
    id_detalle INT PRIMARY KEY AUTO_INCREMENT,
    numero_categoria INT,
    nombre_categoria VARCHAR(100) NOT NULL,
    codigo_categoria VARCHAR(50) UNIQUE NOT NULL,
    descripcion TEXT,
    alias VARCHAR(100),
    id_usuario_creador INT,
    fecha_creado TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (numero_categoria) REFERENCES Categoria(numero_categoria),
    FOREIGN KEY (id_usuario_creador) REFERENCES Usuarios(id)
);

ALTER TABLE Categoria_Detalle
ADD COLUMN estado ENUM('activo', 'inactivo') DEFAULT 'activo' AFTER alias;

ALTER TABLE Categoria
ADD COLUMN nombre_categoria VARCHAR(100) AFTER numero_categoria;






