const express = require('express');
const router = express.Router();
const {check, validationResult} = require('express-validator');
const jwt = require('jsonwebtoken');
const config = require('config');
const bcrypt = require('bcryptjs');

const auth = require('../../middleware/auth');
const User = require('../../models/User');

// @route   GET api/auth
// @desc    Test route
// @access  Public

router.get('/', auth, async (req,res)=> {
    try {
        const user = await User.findById(req.user.id).select('-password');
        res.json(user);
    } catch (error) {
        console.log(error.message);
        res.status(500).send('Server Error');
    }
});

// @route   POST api/auth
// @desc    Authenticate user and get token
// @access  Public

router.post('/', [
    
    check('email', 'Please include a valid email').isEmail().optional({ checkFalsy: true }),
    check('user_name', 'User name is required').exists().optional({ checkFalsy: true }),
    check('password', 'Password is required').exists()
],
    async (req,res) => {
        const errors = validationResult(req);
        if(!errors.isEmpty())
        {
            return res.status(400).json({
                errors: errors.array()});
        }

        const { email, user_name, password } = req.body;
        //This is being done in order to avoid repetative use of req.body to get name, email and password

        try {
            //Checking if user exisits
            let user;
            if (email) {
                user = await User.findOne({ email });
            } else if (user_name) {
                user = await User.findOne({ user_name });
            }

            if(!user)
            {
                return res.status(400).json({
                    errors:[{msg:'Invalid credentials'}]
                });
            }

            //Check if the email and password match
            const isMatch = await bcrypt.compare(password, user.password);
            
            if(!isMatch)
            {
                return res
                .status(400)
                .json({ errors:[{msg:'Invalid credentials'}] });
            }
            
            const payload = {
                user: {
                    id: user.id
                }
            };

            jwt.sign(
                payload, config.get('jwtSecret'),
                {
                    expiresIn: 360000
                },
                (err, token) => {
                    if(err)throw err;
                    res.json({token});
                }
            );
        }
        catch(error)
        {
            console.log(error.message);
            res.status(500).send('Server error');
        }
        }); 

module.exports = router; 
