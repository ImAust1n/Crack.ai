import { generateToken } from "../libs/utils.js";
import User from "../models/user.model.js"
import bcrypt from "bcryptjs"

export const signup = async (req, res) => {
    const {fullName, email, password} = req.body;
    try {

        if (!fullName || !email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        if (password.length < 6) {
            return res.status(400).json({ message: "Password must be atleast 6 characters long" });
        }

        const user = await User.findOne({ email });

        if (user) return res.status(400).json({ message: "Email already exists" })

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({
            fullName,
            email,
            password:hashedPassword,
            location:"India",
            weight:65,
            height:180,
            fatPercentage:40,
            musclePercentage:40,
            muscleMass:65,
            time5k:10,
            maxPullUps:10,
            rmBenchPress:10,
            fitnessGoals:["Fix some Goals"],
            streak:0,
        });

        if (newUser) {
            // generate jwt token
            generateToken(newUser._id, res);
            await newUser.save();

            res.status(201).json({
                _id:newUser._id,
                fullName: newUser.fullName,
                email: newUser.email,
                location: newUser.location,
                weight: newUser.weight,
                height: newUser.height,
                fatPercentage: newUser.fatPercentage,
                musclePercentage: newUser.musclePercentage,
                muscleMass: newUser.muscleMass,
                time5k: newUser.time5k,
                maxPullUps: newUser.maxPullUps,
                rmBenchPress: newUser.rmBenchPress,
                fitnessGoals: newUser.fitnessGoals,
                streak: newUser.streak,
            });
        } else {
            res.status(400).json({ message:"Invalid user data" });
        }

    } catch (error) {
        console.log("Error in signup controller", error.message);

        res.status(500).json({ message:"Internal Server Error" })
    }
};

export const login = async (req, res) => {
    const { email, password } = req.body
    try {
        const user = await User.findOne({email});

        if (!user) {
            return res.status(400).json({ message:"Invalid Credentials" })
        }

        const isPasswordCorrect = await bcrypt.compare(password, user.password);

        if (!isPasswordCorrect) {
            return res.status(400).json({ message:"Invalid Credentials" })
        }

        generateToken(user._id, res);

        res.status(200).json({
            _id:user._id,
            fullName: user.fullName,
            email: user.email,
            location: user.location,
            weight: user.weight,
            height: user.height,
            fatPercentage: user.fatPercentage,
            musclePercentage: user.musclePercentage,
            muscleMass: user.muscleMass,
            time5k: user.time5k,
            maxPullUps: user.maxPullUps,
            rmBenchPress: user.rmBenchPress,
            fitnessGoals: user.fitnessGoals,
            streak: user.streak,
        });

    } catch (error) {
        console.log("Error in login controller", error);
        res.status(500).json({ message: "Internal Server Error" })
    }
};

export const logout = (req, res) => {
    try {
        res.cookie("jwt", "", { maxAge:0 })
        res.status(200).json({ message: "Logged out successfully" })
    } catch (error) {
        console.log("Error in logout controller", error);
        res.status(500).json({ message: "Internal Server Error" })
    }
};

export const checkAuth = (req, res) => {
    try {
        res.status(200).json(req.user);
    } catch (error) {
        console.log("Error in checkAuth controller", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
}