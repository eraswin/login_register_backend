const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');

const User = require('../../models/User');

const {check, validationResult} = require('express-validator');
const jwt = require('jsonwebtoken');
const config = require('config');


// @route   POST api/users
// @desc    Register user
// @access  Public

router.post('/', [
    check('name')
    .matches(/^[a-zA-Z0-9._ ]+$/)
    .withMessage('User name can only contain alphabets, numbers, dot (.) and underscore (_).'),
    check('email', 'Please include a valid email').isEmail(),
    check('user_name')
    .matches(/^[a-zA-Z0-9._]+$/)
    .withMessage('User name can only contain alphabets, numbers, dot (.) and underscore (_).'),
    check('password', 'Please enter a password with 8 or more characters, including an alphabet, number, and special character.')
    .isLength({ min: 8 })
    .custom(value => {
        if (!/[a-zA-Z]/.test(value)) {
            throw new Error('Password must include at least one alphabet.');
        }
        if (!/[0-9]/.test(value)) {
            throw new Error('Password must include at least one number.');
        }
        if (!/[!@#$%^&*(),.?":{}|<>]/.test(value)) {  // Adjust the character set if you want to allow more special characters
            throw new Error('Password must include at least one special character.');
        }
        return true;
    })
],
    async (req,res) => {
        const errors = validationResult(req);
        if(!errors.isEmpty())
        {
            return res.status(400).json({
                errors: errors.array()});
        }

        const { name, email, user_name, password } = req.body;
        //This is being done in order to avoid repetative use of req.body to get name, email and password

        try {
            //Checking if user with same email id already exists 
            let user = await User.findOne({email});
            if(user)
            {
                return res.status(400).json({
                    errors:[{msg:'Email already exists'}]
                });
            }
            user = await User.findOne({user_name});
            if(user)
            {
                return res.status(400).json({
                    errors:[{msg:'User Name already exists'}]
                });
            }
            user = new User({
                name, email, user_name, password, 
            })
            //Password encryption
            const salt = await bcrypt.genSalt(10);

            user.password = await bcrypt.hash(password, salt);
            await user.save();
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