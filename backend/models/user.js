import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true },
    bio: { type: String, default: '' },
    avatarUrl: { type: String, default: '' },
}, { timestamps: true });

// on signup
userSchema.methods.setPassword = async function (password) {
    this.passwordHash = await bcrypt(password, 12)
};

// on login
UserSchema.methods.validatePassword = async function (password) {
    return bcrypt.compare(password, this.passwordHash)
};

export default mongoose.model("user", userSchema);