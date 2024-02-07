import forge from 'node-forge';
import { pool } from "../db.js";

const uris = {
  procedure: '',
  upload: '/upload'
};

const encryptRsa = function (obj) {
  const encoded = forge.util.encodeUtf8(obj);
  const publicKey = forge.pki.publicKeyFromPem(process.env.publicKey);
  const encrypted = publicKey.encrypt(encoded, 'RSA-OAEP', {
    md: forge.md.sha256.create(),
    mgf1: forge.mgf1.create()
  });
  const base64 = forge.util.encode64(encrypted);
  return base64;
};

const callWs = async (uri, json) => {
  const response = await fetch(uri, {
    body: JSON.stringify(json),
    headers: {
      'Content-Type': 'application/json',
    },
    method: 'POST',
  });

  const result = await response.json();
  return result.data;
};

const execute = async (spName, params, encriptado = 0, loading = false) => {
  let model = {};
  if (typeof spName === 'string') {
    model.nombre = spName;
    model.loading = loading;
    model.parametros = params ?? [];
    if (encriptado === 1) {
      const paramsToEncrypt = {
        nombre: spName,
        parametros: params
      };
      const paramsEncryptedString = encryptRsa(JSON.stringify(paramsToEncrypt));

      model.nombre = '';
      model.encriptado = 1;
      model.parametros = paramsEncryptedString;
    }
  } else if (typeof spName === 'object') {
    if (encriptado === 1) {
      const paramsEncryptedString = encryptRsa(JSON.stringify(spName));
      model.parametros = paramsEncryptedString;
      model.encriptado = 1;
      model.loading = loading;
    } else {
      model = spName;
      model.loading = loading;
    }
  }

  // Utiliza la conexión de la base de datos desde el archivo db.js
  const connection = await pool.getConnection();

  try {
    // ... Resto de la lógica para interactuar con la base de datos MySQL

    // Retorna el resultado de la llamada al web service
    return await callWs(process.env.urlWebApi + uris.procedure, model);
  } finally {
    connection.release(); // Libera la conexión después de usarla
  }
};

export { execute };
