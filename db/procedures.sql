//Store Procedure para crear Cursos

DELIMITER //

CREATE PROCEDURE InsertarCurso(IN codigoCurso VARCHAR(10), IN nombreCurso VARCHAR(255), IN descripcionCurso TEXT)
BEGIN
    INSERT INTO Cursos (codigo, nombre, descripcion) 
    VALUES (codigoCurso, nombreCurso, descripcionCurso);
END //

DELIMITER ;

//Store Procedure para actualizar

DELIMITER $$

CREATE PROCEDURE SPR_CURSOS_U(
    IN _id INT,
    IN _codigo VARCHAR(10), 
    IN _nombre VARCHAR(255), 
    IN _descripcion TEXT
)
BEGIN
    UPDATE Cursos 
    SET codigo = _codigo, 
        nombre = _nombre, 
        descripcion = _descripcion
    WHERE id = _id;
END$$

DELIMITER ;
