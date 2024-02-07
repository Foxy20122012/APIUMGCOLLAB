-- CREATE DATABASE IF NOT EXISTS companydb;

-- USE companydb;

CREATE TABLE employee (
  id INT(11) NOT NULL AUTO_INCREMENT,
  name VARCHAR(45) DEFAULT NULL,
  salary INT(11) DEFAULT NULL, 
  PRIMARY KEY(id)
);

DESCRIBE employee;

INSERT INTO employee values 
  (1, 'Ryan Ray', 20000),
  (2, 'Joe McMillan', 40000),
  (3, 'John Carter', 50000);

SELECT * FROM employee;



ALTER TABLE MantenimientoVehiculos
MODIFY COLUMN id INT AUTO_INCREMENT;




CREATE TABLE Vehiculos (
    ID INT PRIMARY KEY,
    Marca VARCHAR(255),
    Descripcion VARCHAR(255),
    Imagen BLOB,
    Modelo VARCHAR(255),
    Placa VARCHAR(20),
    AnioFabricacion INT,
    CapacidadCarga DECIMAL(10, 2),
    TipoCombustible VARCHAR(20),
    EstadoVehiculo VARCHAR(20),
    KilometrajeActual INT
);

###Pendiente de hacer el controlador
CREATE TABLE AsignacionGasolina (
    ID INT PRIMARY KEY,
    VehiculoID INT,
    CodigoUnico VARCHAR(20),
    NumeroVehiculo VARCHAR(20),
    PlacaVehiculo VARCHAR(20),
    GalonesAsignados DECIMAL(8, 2),
    Imagen BLOB,
    Descripcion TEXT
);

