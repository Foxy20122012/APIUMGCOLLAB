import { pool } from "../db.js";

export const getEmployees = async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM employee");
    res.json(rows);
  } catch (error) {
    return res.status(500).json({ message: "Something goes wrong" });
  }
};

export const getEmployee = async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await pool.query("SELECT * FROM employee WHERE id = ?", [
      id,
    ]);

    if (rows.length <= 0) {
      return res.status(404).json({ message: "Employee not found" });
    }

    res.json(rows[0]);
  } catch (error) {
    return res.status(500).json({ message: "Something goes wrong" });
  }
};

export const deleteEmployee = async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await pool.query("DELETE FROM employee WHERE id = ?", [id]);

    if (rows.affectedRows <= 0) {
      return res.status(404).json({ message: "Employee not found" });
    }

    res.sendStatus(204);
  } catch (error) {
    return res.status(500).json({ message: "Something goes wrong" });
  }
};

export const createEmployee = async (req, res) => {
  try {
    const { name, salary, address, age } = req.body;
    const [rows] = await pool.query(
      "INSERT INTO employee (name, salary, address, age) VALUES (?, ?, ?, ?)",
      [name, salary, address, age]
    );
    res.status(201).json({ id: rows.insertId, name, salary, address, age });
  } catch (error) {
    return res.status(500).json({ message: "Something goes wrong" });
  }
};



export const updateEmployee = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, salary, address, age } = req.body;

    // Utilizo una query con placeholders para evitar posibles SQL injection
    const [result] = await pool.query(
      "UPDATE employee SET name = IFNULL(?, name), salary = IFNULL(?, salary), address = IFNULL(?, address), age = IFNULL(?, age) WHERE id = ?",
      [name, salary, address, age, id]
    );

    if (result.affectedRows === 0)
      return res.status(404).json({ message: "Employee not found" });

    const [rows] = await pool.query("SELECT * FROM employee WHERE id = ?", [id]);

    res.json(rows[0]);
  } catch (error) {
    console.error("Error updating employee:", error);
    return res.status(500).json({ message: "Error updating employee" });
  }
};

