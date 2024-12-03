// const Admin = require('../models/User');
// const Log = require('../models/Log');

// // Log admin action
// const logAdminAction = async (adminId, action, message) => {
//   const log = new Log({
//     adminId,
//     action,
//     message
//   });
//   await log.save();
// };



// // Admin login (existing functionality)
// const loginAdmin = async (req, res) => {
//   try {
//     console.log("login here");
//     const { username, password } = req.body;

//     // Find the admin by username
//     const admin = await Admin.findOne({ username });
//     console.log("admin", admin);
//     if (!admin) {
//       return res.status(400).json({ message: 'Admin not found' });
//     }

//     // Check if the password matches
//     const isMatch = await bcrypt.compare(password, admin.password);
//     if (!isMatch) {
//       return res.status(400).json({ message: 'Invalid credentials' });
//     }

//     // Log the login action
//     await logAdminAction(admin._id, 'login', 'Admin logged in successfully');

//     res.status(200).json({ message: 'Login successful' });

//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Internal server error' });
//   }
// };

// // Function to create admin
// const logIn = async () => {
//   try {
//     console.log('Admin there');

//     // Create a new admin
//     const admin = new Admin({
//       username: 'mariyam', // Replace with the desired username
//       password: 'mari2002', // Replace with the desired password
//     });

//     console.log("hellooooo");
//   } catch (error) {
//     console.error('Error creating admin:', error);
//   }
// };

// module.exports = {
//   registerAdmin,
//   loginAdmin,
//   logAdminAction
// };
