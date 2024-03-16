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



