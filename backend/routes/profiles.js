const express = require('express');
const { body, validationResult } = require('express-validator');
const Profile = require('../models/Profile');
const router = express.Router();

// Validation middleware
const validateProfile = [
  body('name')
    .isLength({ min: 3 })
    .withMessage('Name must be at least 3 characters long')
    .trim(),
  body('email')
    .isEmail()
    .withMessage('Please provide a valid email')
    .normalizeEmail(),
  body('age')
    .optional()
    .isInt({ min: 0, max: 150 })
    .withMessage('Age must be a number between 0 and 150')
];

// Create or Update Profile
router.post('/', validateProfile, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { name, email, age } = req.body;

    // Check if profile with this email already exists
    let profile = await Profile.findOne({ email });
    
    if (profile) {
      // Update existing profile
      profile.name = name;
      profile.age = age;
      await profile.save();
      
      return res.status(200).json({
        success: true,
        message: 'Profile updated successfully',
        data: profile
      });
    } else {
      // Create new profile
      profile = new Profile({ name, email, age });
      await profile.save();
      
      return res.status(201).json({
        success: true,
        message: 'Profile created successfully',
        data: profile
      });
    }
  } catch (error) {
    console.error('Error creating/updating profile:', error);
    
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Email already exists'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
    });
  }
});

// Get Profile by Email
router.get('/:email', async (req, res) => {
  try {
    const { email } = req.params;
    
    const profile = await Profile.findOne({ email: email.toLowerCase() });
    
    if (!profile) {
      return res.status(404).json({
        success: false,
        message: 'Profile not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: profile
    });
  } catch (error) {
    console.error('Error fetching profile:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
    });
  }
});

// Get All Profiles
router.get('/', async (req, res) => {
  try {
    const profiles = await Profile.find().sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      count: profiles.length,
      data: profiles
    });
  } catch (error) {
    console.error('Error fetching profiles:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
    });
  }
});

// Delete Profile
router.delete('/:email', async (req, res) => {
  try {
    const { email } = req.params;
    
    const profile = await Profile.findOneAndDelete({ email: email.toLowerCase() });
    
    if (!profile) {
      return res.status(404).json({
        success: false,
        message: 'Profile not found'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Profile deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting profile:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
    });
  }
});

module.exports = router;
