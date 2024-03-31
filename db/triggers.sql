//Trigger para crear un Identificador Unico universal para generar el codigo de la tabla cursos

DELIMITER //
CREATE TRIGGER before_insert_curso
BEFORE INSERT ON Cursos
FOR EACH ROW
BEGIN
    SET NEW.codigo = UUID();
END;
//
DELIMITER ;


//  trigger que se ejecute antes de insertar en curso_catedratico y que
 busque los IDs correspondientes a partir de los nombres proporcionados


DELIMITER $$
CREATE TRIGGER trg_insert_curso_catedratico BEFORE INSERT ON curso_catedratico
FOR EACH ROW
BEGIN
    DECLARE cursoId INT;
    DECLARE catedraticoId INT;

    -- Buscar el ID del curso basado en el nombre del curso
    SELECT id INTO cursoId FROM Cursos WHERE nombre = NEW.nombre_curso LIMIT 1;

    -- Buscar el ID del catedrático basado en el nombre del catedrático
    SELECT id INTO catedraticoId FROM catedraticos WHERE nombre = NEW.nombre_catedratico LIMIT 1;

    -- Asignar los IDs encontrados a las columnas de la nueva fila
    SET NEW.curso_id = cursoId;
    SET NEW.catedratico_id = catedraticoId;
END $$
DELIMITER ;


// Insert de prueba
INSERT INTO curso_catedratico (nombre_curso, nombre_catedratico) VALUES ('Matemáticas', 'Aldrin Lopez');


// Valida si el campo nombre el cual esta asigando par el nombre del curso si existe el curso en la tabla cursos y si existe lo inserte
DELIMITER $$
CREATE TRIGGER trg_before_insert_post BEFORE INSERT ON Posts
FOR EACH ROW
BEGIN
    DECLARE cursoExistente INT;

    -- Verificar si existe un curso con el ID proporcionado
    SELECT COUNT(*) INTO cursoExistente FROM Cursos WHERE id = NEW.curso_id;

    IF cursoExistente = 0 THEN
        -- Si el curso no existe, lanzar un error
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Curso no encontrado';
    END IF;
END$$
DELIMITER ;

// Stored Procedure para capturar el id del curso 

DROP TRIGGER IF EXISTS trg_before_insert_post;

DELIMITER $$
CREATE TRIGGER trg_before_insert_post BEFORE INSERT ON Posts
FOR EACH ROW
BEGIN
    DECLARE cursoId INT;

    -- Buscar el ID del curso basado en el nombre del curso
    SELECT id INTO cursoId FROM Cursos WHERE nombre = NEW.nombre LIMIT 1;

    -- Si el curso existe, establecer el curso_id en el nuevo post
    IF cursoId IS NOT NULL THEN
        SET NEW.curso_id = cursoId;
    ELSE
        -- Si el curso no existe, lanzar un error
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Curso no encontrado';
    END IF;
END$$
DELIMITER ;



// TRIGGER para la relacion de la tabla terceria para el manejo de la relacion de los cursos, estudiantes y catedraticos

DELIMITER $$

CREATE TRIGGER trg_before_insert_curso_estudiante BEFORE INSERT ON curso_estudiante
FOR EACH ROW
BEGIN
    DECLARE cursoId INT;
    DECLARE estudianteId INT;
    DECLARE catedraticoId INT;

    -- Buscar el ID del curso basado en el nombre del curso
    SELECT id INTO cursoId FROM Cursos WHERE nombre = NEW.nombre_curso LIMIT 1;

    -- Buscar el ID del estudiante basado en el nombre del estudiante
    SELECT id INTO estudianteId FROM Estudiantes WHERE nombre = NEW.nombre_estudiante LIMIT 1;

    -- Buscar el ID del catedrático basado en el nombre del catedrático
    SELECT id INTO catedraticoId FROM catedraticos WHERE nombre = NEW.nombre_catedratico LIMIT 1;

    -- Si todos los nombres coinciden, establecer los IDs correspondientes
    IF cursoId IS NOT NULL AND estudianteId IS NOT NULL AND catedraticoId IS NOT NULL THEN
        SET NEW.curso_id = cursoId;
        SET NEW.estudiante_id = estudianteId;
        SET NEW.catedratico_id = catedraticoId;
    ELSE
        -- Si alguno de los nombres no coincide, lanzar un error
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Uno o más nombres no coinciden';
    END IF;
END$$

DELIMITER ;


//Trigger encargado de capturar la insercion de un Catedratico y capturar las credenciales necesarias para la tabla usuarios.

DELIMITER //
CREATE OR REPLACE TRIGGER after_insert_catedratico
AFTER INSERT ON catedraticos
FOR EACH ROW
BEGIN
    INSERT INTO usuarios (nombre, correo, contraseña, puesto, id_posicion, rol)
    VALUES (NEW.nombre, NEW.email, NEW.contraseña, 'catedraticos', NEW.id, 'administrador');
END;
//
DELIMITER ;


//Trigger en la tabla usuarios para actualizar la tabla catedraticos: //Para cuando se actualice un usuario

DELIMITER //
CREATE TRIGGER after_update_usuarios
AFTER UPDATE ON Usuarios
FOR EACH ROW
BEGIN
    IF NEW.puesto = 'catedraticos' THEN
        UPDATE catedraticos
        SET nombre = NEW.nombre, email = NEW.correo, contraseña = NEW.contraseña
        WHERE id = NEW.id_posicion;
    END IF;
END;
//
DELIMITER ;

//Trigger en la tabla catedraticos para actualizar la tabla usuarios: //Para cuando se actualicen los datos de la tabla catedraticos

DELIMITER //
CREATE TRIGGER after_update_catedraticos
AFTER UPDATE ON catedraticos
FOR EACH ROW
BEGIN
    UPDATE usuarios
    SET nombre = NEW.nombre, correo = NEW.email, contraseña = NEW.contraseña
    WHERE id_posicion = NEW.id AND puesto = 'catedraticos';
END;
//
DELIMITER ;



//Este trigger se activará después de cada inserción en la tabla de estudiantes. Insertará automáticamente los datos de nombre, correo, contraseña y el ID del estudiante en la tabla de usuarios

DELIMITER //
CREATE TRIGGER after_insert_estudiante
AFTER INSERT ON Estudiantes
FOR EACH ROW
BEGIN
    INSERT INTO Usuarios (nombre, correo, contraseña, puesto, id_posicion, rol)
    VALUES (NEW.nombre, NEW.email, NEW.contraseña, 'Estudiantes', NEW.id, 'usuario');
END;
//
DELIMITER ;



//Trigger en la tabla Usuarios para actualizar la tabla Estudiantes:

DELIMITER //
CREATE OR REPLACE TRIGGER after_update_usuarios
AFTER UPDATE ON Usuarios
FOR EACH ROW
BEGIN
    IF NEW.puesto = 'Estudiantes' THEN
        UPDATE Estudiantes
        SET nombre = NEW.nombre, email = NEW.correo, contraseña = NEW.contraseña
        WHERE id = NEW.id_posicion;
    END IF;
END;
//
DELIMITER ;


// Trigger en la tabla Estudiantes para actualizar la tabla Usuarios:

DELIMITER //
CREATE OR REPLACE TRIGGER after_update_estudiantes
AFTER UPDATE ON Estudiantes
FOR EACH ROW
BEGIN
    UPDATE Usuarios
    SET nombre = NEW.nombre, correo = NEW.email, contraseña = NEW.contraseña
    WHERE id_posicion = NEW.id AND puesto = 'Estudiantes';
END;
//
DELIMITER ;
