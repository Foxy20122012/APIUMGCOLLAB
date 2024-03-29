// models/coursesModel.js

const coursesModel = () => {
    return [
        { header: "ID", key: "id", width: 10 },
        { header: "Código", key: "Codigo", width: 20 },
        { header: "Nombre", key: "nombre", width: 30 },
        { header: "Descripción", key: "descripcion", width: 40 },
        { header: "Semestre", key: "semestre", width: 15 },
        { header: "Créditos", key: "creditos", width: 15 },
    ];
};

export default coursesModel;
