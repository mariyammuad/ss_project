// import express from 'express';
// import { createAdmin } from '../controllers/adminController.js'; // Adjust the path

// const router = express.Router();

// // Define the route for creating an admin
// router.post('/create-admin', createAdmin);

// export default router;


import express from 'express';
import { createAdmin } from '../controllers/adminController.js'; // Adjust the path
import Log from '../models/Log.js'; // Import Log model

const router = express.Router();

// Define the route for creating an admin
router.post('/create-admin', async (req, res) => {
  try {
    // Call the controller function to create the admin
    await createAdmin(req, res);

    // Log the "create admin" action
    const { adminId, adminName } = req.body; // Assuming the body contains admin details
    const action = `Admin created: ${adminName}`;

    const newLog = new Log({
      userId: adminId,  // Assuming adminId is the id of the user performing the action
      action: action,
    });

    await newLog.save();  // Save the new log entry

    res.status(200).json({ message: 'Admin created and action logged.' });

  } catch (error) {
    console.error('Error creating admin or logging action:', error);
    res.status(500).json({ message: 'Error creating admin or logging action.' });
  }
});

export default router;
