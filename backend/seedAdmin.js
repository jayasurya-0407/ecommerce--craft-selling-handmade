require('dotenv').config();
const mongoose = require('mongoose');
const Admin = require('./models/Admin');

mongoose.connect(process.env.MONGO_URI).then(async () => {
  console.log('Connected to MongoDB for Admin Seeding...');
  
  const existingAdmin = await Admin.findOne({ email: 'admin@haan.com' });
  if (existingAdmin) {
    console.log('Admin already exists. Skipping seed.');
    process.exit(0);
  }

  const admin = await Admin.create({
    name: 'Super Admin',
    email: 'admin@haan.com',
    password: 'password123'
  });

  console.log('Admin seeded successfully! Email: admin@haan.com, Password: password123');
  process.exit(0);
}).catch(err => {
  console.error(err);
  process.exit(1);
});
