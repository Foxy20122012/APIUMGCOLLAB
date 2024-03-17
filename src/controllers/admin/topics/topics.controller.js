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
                    'semestre', Cursos.semestre,
                    'creditos', Cursos.creditos
                ) AS curso,
                (
                    SELECT JSON_ARRAYAGG(
                        JSON_OBJECT(
                            'id', catedraticos.id,
                            'nombre', catedraticos.nombre,
                            'titulo', catedraticos.titulo,
                            'email', catedraticos.email
                        )
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

        // Convertir la cadena 'curso' y 'catedraticos' en un objeto JSON y un arreglo de objetos JSON respectivamente para cada tema
        const topicsWithDetails = topics.map(topic => ({
            ...topic,
            curso: JSON.parse(topic.curso),
            catedraticos: JSON.parse(topic.catedraticos || '[]')
        }));

        res.json(topicsWithDetails);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Something went wrong" });
    }
};
