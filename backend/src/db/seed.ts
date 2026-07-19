import pool from "./connection.js";
import bcrypt from "bcrypt";

const seedSuperAdmin = async () => {
  try {
    // Check if Super Admin already exists
    const existingAdmin = await pool.query(
      "SELECT id FROM employees WHERE email = $1",
      ["admin@ems.com"]
    );

    if (existingAdmin.rowCount && existingAdmin.rowCount > 0) {
      console.log("✅ Super Admin already exists.");
      process.exit(0);
    }

    // Hash password
    const hashedPassword = await bcrypt.hash("Admin@123", 10);

    // Insert Super Admin
    await pool.query(
      `INSERT INTO employees (
        employee_id,
        name,
        email,
        password_hash,
        phone,
        department,
        designation,
        salary,
        joining_date,
        status,
        role,
        manager_id,
        profile_image
      )
      VALUES (
        $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13
      )`,
      [
        "EMP001",
        "Super Admin",
        "admin@ems.com",
        hashedPassword,
        "9876543210",
        "Administration",
        "Super Admin",
        100000,
        new Date(),
        "ACTIVE",
        "SUPER_ADMIN",
        null,
        null,
      ]
    );

    console.log("✅ Super Admin seeded successfully.");
  } catch (error) {
    console.error("❌ Error seeding Super Admin:", error);
  } finally {
    await pool.end();
  }
};

seedSuperAdmin();