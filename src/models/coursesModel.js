// models/coursesModel.js

const coursesModel = () => {
    return [
        { header: "ID", key: "id", width: 15 },
        { header: "Código", key: "Codigo", width: 30 },
        { header: "Nombre", key: "nombre", width: 30 },
        { header: "Descripción", key: "descripcion", width: 40 },
        { header: "Año", key: "año", width: 20 },
        { header: "Créditos", key: "creditos", width: 20 },
    ];
};

export default coursesModel;
