import Admin from '../models/Admin.js'; // Adjust the path to your Admin model

// Function to create an admin
export const createAdmin = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  try {
    const newAdmin = new Admin({ email, password });
    await newAdmin.save();
    return res.status(201).json({ message: 'Admin created successfully' });
  } catch (error) {
    console.error('Error creating admin:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};
