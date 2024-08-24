import { pool } from '../../../db.js';

export const getTopics = async (req, res) => {
    try {
        const [topics] = await pool.query(`
            SELECT 
                Temas.id,
                Temas.nombre,
                Temas.descripcion,
                Temas.curso_id,
                JSON_OBJECT(
                    'id', Cursos.id,
                    'codigo', Cursos.codigo,
                    'nombre', Cursos.nombre,
                    'descripcion', Cursos.descripcion,
                    'año', Cursos.año
                ) AS curso,
                (
                    SELECT IFNULL(
                        JSON_ARRAYAGG(
                            JSON_OBJECT(
                                'id', catedraticos.id,
                                'nombre', catedraticos.nombre,
                                'titulo', catedraticos.titulo,
                                'email', catedraticos.email
                            )
                        ), JSON_ARRAY()
                    )
                    FROM catedraticos
                    JOIN curso_catedratico ON catedraticos.id = curso_catedratico.catedratico_id
                    WHERE curso_catedratico.curso_id = Temas.curso_id
                ) AS catedraticos
            FROM 
                Temas
            LEFT JOIN 
                Cursos ON Temas.curso_id = Cursos.id
        `);

        const topicsWithDetails = topics.map(topic => {
            let cursoData, catedraticosData;

            try {
                cursoData = JSON.parse(topic.curso);
            } catch (error) {
                console.error("Error parsing 'curso' JSON:", error);
                cursoData = null;
            }

            try {
                catedraticosData = JSON.parse(topic.catedraticos || '[]');
            } catch (error) {
                console.error("Error parsing 'catedraticos' JSON:", error);
                catedraticosData = [];
            }

            return {
                ...topic,
                curso: cursoData,
                catedraticos: catedraticosData
            };
        });

        res.json(topicsWithDetails);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Something went wrong" });
    }
};

export const addTopic = async (req, res) => {
    const { nombre, descripcion, nombre_curso } = req.body;

    try {
        // Verificar si existe un curso con el nombre proporcionado
        const [curso] = await pool.query('SELECT id FROM Cursos WHERE nombre = ?', [nombre_curso]);

        if (curso.length === 0) {
            return res.status(404).json({ message: 'El curso con el nombre proporcionado no existe.' });
        }

        const curso_id = curso[0].id;

        // Insertar el tema y asignar automáticamente el id del curso relacionado
        await pool.query('INSERT INTO Temas (nombre, descripcion, curso_id, nombre_curso) VALUES (?, ?, ?, ?)', [nombre, descripcion, curso_id, nombre_curso]);

        res.status(201).json({ message: 'Tema agregado exitosamente' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Algo salió mal' });
    }
};


export const updateTopic = async (req, res) => {
    const { id, nombre, descripcion, nombre_curso } = req.body;

    try {
        const [curso] = await pool.query('SELECT id FROM Cursos WHERE nombre = ?', [nombre_curso]);

        if (curso.length === 0) {
            return res.status(404).json({ message: 'El curso proporcionado no existe.' });
        }

        const curso_id = curso[0].id;

        await pool.query('UPDATE Temas SET nombre = ?, descripcion = ?, curso_id = ? WHERE id = ?', [nombre, descripcion, curso_id, id]);

        res.json({ message: 'Tema actualizado exitosamente.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Algo salió mal al intentar actualizar el tema.' });
    }
};

export const deleteTopic = async (req, res) => {
    const { id } = req.params;

    try {
        const [result] = await pool.query('DELETE FROM Temas WHERE id = ?', [id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'No se encontró el tema con el id proporcionado.' });
        }

        res.json({ message: 'Tema eliminado exitosamente.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Algo salió mal al intentar eliminar el tema.' });
    }
};
