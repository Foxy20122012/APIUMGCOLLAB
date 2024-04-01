import { pool } from '../../../db.js';
import ExcelJS from 'exceljs';
import PDFDocument from 'pdfkit';
import coursesModel from '../../../models/coursesModel.js';

export const getCoursesWithTopics = async (req, res) => {
    try {
        const [courses] = await pool.query(`
            SELECT 
                Cursos.id,
                Cursos.codigo,
                Cursos.nombre,
                Cursos.descripcion,
                Cursos.año,
                Cursos.creditos,
                JSON_ARRAYAGG(
                    JSON_OBJECT(
                        'id', Temas.id,
                        'nombre', Temas.nombre,
                        'descripcion', Temas.descripcion,
                        'curso_id', Temas.curso_id
                    )
                ) AS temas,
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
                    WHERE curso_catedratico.curso_id = Cursos.id
                ) AS catedraticos,
                (
                    SELECT JSON_ARRAYAGG(
                        JSON_OBJECT(
                            'id', Posts.id,
                            'titulo', Posts.titulo,
                            'contenido', Posts.contenido,
                            'estado', Posts.estado,
                            'visible', Posts.visible,
                            'fecha_creacion', Posts.fecha_creacion,
                            'fecha_actualizacion', Posts.fecha_actualizacion,
                            'usuario_id', Posts.usuario_id
                        )
                    )
                    FROM Posts
                    WHERE Posts.curso_id = Cursos.id
                ) AS posts,
                (
                    SELECT JSON_ARRAYAGG(
                        JSON_OBJECT(
                            'id', Estudiantes.id,
                            'nombre', Estudiantes.nombre,
                            'apellido', Estudiantes.apellido,
                            'email', Estudiantes.email
                        )
                    )
                    FROM Estudiantes
                    JOIN curso_estudiante ON Estudiantes.id = curso_estudiante.estudiante_id
                    WHERE curso_estudiante.curso_id = Cursos.id
                ) AS estudiantes
            FROM 
                Cursos
            LEFT JOIN 
                Temas ON Cursos.id = Temas.curso_id
            GROUP BY
                Cursos.id
        `);

        // Convertir las cadenas de 'temas', 'catedraticos', 'posts' y 'estudiantes' en arreglos de objetos JSON para cada curso
        const coursesWithDetails = courses.map(course => ({
            ...course,
            temas: JSON.parse(course.temas || '[]'),
            catedraticos: JSON.parse(course.catedraticos || '[]'),
            posts: JSON.parse(course.posts || '[]'),
            estudiantes: JSON.parse(course.estudiantes || '[]')
        }));

        res.json(coursesWithDetails);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al obtener los cursos, temas, catedráticos, posts y estudiantes');
    }
}

//Controlador para crear cursos
export const createCourse = async (req, res) => {
    const { nombre, descripcion } = req.body;

    try {
        const [result] = await pool.query(`
            INSERT INTO Cursos (nombre, descripcion)
            VALUES (?, ?)
        `, [nombre, descripcion]);

        if (result.affectedRows === 0) {
            return res.status(500).send('Error al insertar el curso');
        }

        res.send('Curso creado con éxito');
    } catch (error) {
        console.error('Error al insertar el curso:', error);
        res.status(500).send('Error al insertar el curso');
    }
};


export const updateCourse = async (req, res) => {
    const { id } = req.params;
    const { nombre, descripcion } = req.body;

    try {
        const [result] = await pool.query(`
            UPDATE Cursos
            SET 
                nombre = ?,
                descripcion = ?
            WHERE id = ?
        `, [nombre, descripcion, id]);

        if (result.changedRows === 0) {
            return res.status(404).send('Curso no encontrado');
        }

        res.send('Curso actualizado con éxito');
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al actualizar el curso');
    }
};


export const deleteCourse = async (req, res) => {
    const { id } = req.params;

    try {
        const [result] = await pool.query(`
            DELETE FROM Cursos
            WHERE id = ?
        `, [id]);

        if (result.affectedRows === 0) {
            return res.status(404).send('Curso no encontrado');
        }

        res.send('Curso eliminado con éxito');
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al eliminar el curso');
    }
}

export const getCourseById = async (req, res) => {
    const { id } = req.params;

    try {
        const [course] = await pool.query(`
            SELECT 
                Cursos.id AS CursoId,
                Cursos.codigo AS codigo,
                Cursos.nombre AS Curso,
                Cursos.descripcion AS DescripcionCurso,
                Cursos.año AS año,
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
            WHERE Cursos.id = ?
            GROUP BY Cursos.id
        `, [id]);

        if (course.length === 0) {
            return res.status(404).send('Curso no encontrado');
        }

        // Convertir la cadena de 'Temas' en un arreglo de objetos JSON para el curso
        const courseWithTopics = {
            ...course[0],
            Temas: JSON.parse(course[0].Temas || '[]')
        };

        res.json(courseWithTopics);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al obtener el curso');
    }
};


//Controlador para convertir excel


export const getCoursesWithTopicsExcel = async (req, res) => {
    try {
        const [courses] = await pool.query(`
            SELECT 
                id,
                codigo AS Codigo,
                nombre,
                descripcion,
                año,
                creditos
            FROM 
                Cursos
        `);

        // Crear un nuevo workbook de Excel
        const workbook = new ExcelJS.Workbook();
        const sheet = workbook.addWorksheet('Cursos');

        // Obtener el modelo de columnas
        const columnsModel = coursesModel();

        // Agregar encabezados de columna
        sheet.columns = columnsModel;

        // Agregar datos al archivo de Excel
        courses.forEach(course => {
            sheet.addRow({
                id: course.id,
                Codigo: course.Codigo,
                nombre: course.nombre,
                descripcion: course.descripcion,
                semestre: course.año,
                creditos: course.creditos,
            });
        });

        // Establecer estilos para el encabezado
        sheet.eachRow({ includeEmpty: false }, function (row, rowNumber) {
            row.font = { bold: true };
            row.alignment = { vertical: 'middle', horizontal: 'center' };
        });

        // Establecer estilos para la tabla de datos
        sheet.eachRow({ includeEmpty: false, from: 2 }, function (row, rowNumber) {
            row.alignment = { vertical: 'middle', horizontal: 'left' };
        });

        // Guardar el workbook en un archivo
        const fileName = 'cursos.xlsx';
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
        await workbook.xlsx.write(res);
        res.end();
    } catch (error) {
        console.error('Error al generar el reporte en Excel:', error);
        res.status(500).send('Error al generar el reporte en Excel');
    }
};

//Controlador para generar excel por id


export const getCourseByIdExcel = async (req, res) => {
    try {
        const { id } = req.params;

        const [course] = await pool.query(`
            SELECT 
                id,
                codigo AS Codigo,
                nombre,
                descripcion,
                año,
                creditos
            FROM 
                Cursos
            WHERE
                id = ?
        `, [id]);

        if (!course || course.length === 0) {
            return res.status(404).send('Curso no encontrado');
        }

        // Crear un nuevo workbook de Excel
        const workbook = new ExcelJS.Workbook();
        const sheet = workbook.addWorksheet('Curso');

        // Obtener el modelo de columnas
        const columnsModel = coursesModel();

        // Agregar encabezados de columna
        sheet.columns = columnsModel;

        // Agregar datos al archivo de Excel
        sheet.addRow({
            id: course[0].id,
            Codigo: course[0].Codigo,
            nombre: course[0].nombre,
            descripcion: course[0].descripcion,
            año: course[0].año,
            creditos: course[0].creditos,
        });

        // Establecer estilos para el encabezado
        sheet.eachRow({ includeEmpty: false }, function (row, rowNumber) {
            row.font = { bold: true, color: { argb: 'FFFFFF' } };
            row.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '2A3F54' } };
            row.alignment = { vertical: 'middle', horizontal: 'center' };
        });

        // Establecer estilos para la tabla de datos
        sheet.eachRow({ includeEmpty: false, from: 2 }, function (row, rowNumber) {
            row.alignment = { vertical: 'middle', horizontal: 'left' };
        });

        // Guardar el workbook en un archivo
        const fileName = `curso_${id}.xlsx`;
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
        await workbook.xlsx.write(res);
        res.end();
    } catch (error) {
        console.error('Error al generar el reporte en Excel:', error);
        res.status(500).send('Error al generar el reporte en Excel');
    }
};


//Controlador para generar PDF con todos los cursos


export const getCoursesWithTopicsPDF = async (req, res) => {
    try {
        const [courses] = await pool.query(`
            SELECT 
                id,
                codigo,
                nombre,
                descripcion,
                año,
            FROM 
                Cursos
        `);

        const doc = new PDFDocument();
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'attachment; filename="cursos.pdf"');
        doc.pipe(res);
        doc.fontSize(20).text('Listado de Cursos', { align: 'center' });
        doc.moveDown();
        courses.forEach(course => {
            doc.fontSize(16).text(`Curso: ${course.nombre}`, { continued: true }).text(`Código: ${course.codigo}`);
            doc.fontSize(12).text(`Descripción: ${course.descripcion}`);
            doc.fontSize(12).text(`Año: ${course.año}`);
            doc.moveDown();
        });

        doc.end();
    } catch (error) {
        console.error('Error al generar el reporte en PDF:', error);
        res.status(500).send('Error al generar el reporte en PDF');
    }
};


//Controlador para PDF por Id del Curso

export const getCourseByIdPDF = async (req, res) => {
    try {
        const { id } = req.params;

        const [course] = await pool.query(`
            SELECT 
                Cursos.id,
                Cursos.codigo AS Codigo,
                Cursos.nombre AS NombreCurso,
                Cursos.descripcion AS DescripcionCurso,
                Cursos.año AS Año,
                Temas.id AS IdTema,
                Temas.nombre AS NombreTema,
                Temas.descripcion AS DescripcionTema
            FROM 
                Cursos
            LEFT JOIN 
                Temas ON Cursos.id = Temas.curso_id
            WHERE
                Cursos.id = ?
        `, [id]);

        if (!course || course.length === 0) {
            return res.status(404).send('Curso no encontrado');
        }

        const doc = new PDFDocument();
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename="curso_${id}.pdf"`);
        doc.pipe(res);

        // Estilo para el título
        doc.fontSize(20).font('Helvetica-Bold').text(`Curso: ${course[0].NombreCurso}`, { align: 'center' });
        doc.moveDown();

        // Información del curso
        doc.fontSize(12).font('Helvetica').text(`Código: ${course[0].Codigo}`);
        doc.fontSize(12).text(`Descripción: ${course[0].DescripcionCurso}`);
        doc.fontSize(12).text(`Año: ${course[0].Año}`);
        doc.moveDown();

        // Temas relacionados
        doc.fontSize(16).font('Helvetica-Bold').text('Temas Relacionados:', { underline: true });
        doc.moveDown();
        course.forEach(row => {
            if (row.IdTema && row.NombreTema && row.DescripcionTema) {
                doc.fontSize(12).font('Helvetica').text(`- ${row.NombreTema}: ${row.DescripcionTema}`);
            }
        });

        doc.end();
    } catch (error) {
        console.error('Error al generar el reporte en PDF:', error);
        res.status(500).send('Error al generar el reporte en PDF');
    }
};
