require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/user.model');

const createAdmin = async () => {
   const email = process.argv[2] || 'admin@trekmate.online';
   const password = process.argv[3] || 'admin123';
   const displayName = process.argv[4] || 'Admin';

   try {
      console.log('Connecting to database...');
      await mongoose.connect(process.env.MONGODB_URI);
      console.log('Connected to database.');

      const saltRounds = 12;
      const passwordHash = await bcrypt.hash(password, saltRounds);

      const existingUser = await User.findOne({ email });

      if (existingUser) {
         console.log(`User ${email} already exists. Updating role to ADMIN...`);
         existingUser.role = 'ADMIN';
         existingUser.passwordHash = passwordHash; // Reset password to be sure
         await existingUser.save();
         console.log('User promoted to ADMIN successfully.');
      } else {
         console.log(`Creating new ADMIN user: ${email}...`);
         const adminUser = new User({
            email,
            passwordHash,
            role: 'ADMIN',
            displayName,
            status: 'ACTIVE'
         });
         await adminUser.save();
         console.log('ADMIN user created successfully.');
      }

      process.exit(0);
   } catch (error) {
      console.error('Error creating admin:', error);
      process.exit(1);
   }
};

createAdmin();
