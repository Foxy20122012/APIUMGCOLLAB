import { pool } from '../db.js';

export const getCoursesWithTopics = async (req, res) => {
    try {
        const [courses] = await pool.query(`
            SELECT 
                Cursos.id AS CursoId,
                Cursos.codigo AS codigo,
                Cursos.nombre AS Curso,
                Cursos.descripcion AS DescripcionCurso,
                Cursos.semestre AS Semestre,
                Cursos.creditos AS Creditos,
                JSON_ARRAYAGG(
                    JSON_OBJECT(
                        'id', Temas.id,
                        'nombre', Temas.nombre,
                        'descripcion', Temas.descripcion,
                        'curso_id', Temas.curso_id
                    )
                ) AS Temas
            FROM 
                Cursos
            LEFT JOIN 
                Temas ON Cursos.id = Temas.curso_id
            GROUP BY
                Cursos.id
        `);

        // Convertir la cadena de 'Temas' en un arreglo de objetos JSON para cada curso
        const coursesWithTopics = courses.map(course => ({
            ...course,
            Temas: JSON.parse(course.Temas || '[]')
        }));

        res.json(coursesWithTopics);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al obtener los cursos y temas');
    }
}
