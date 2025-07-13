import mongoose from "mongoose";
import bcrypt from "bcrypt";

const { Schema, model, Types } = mongoose;

const userSchema = new Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true },

    // match test user static inputs
    name: { type: String, default: "" },
    bio: { type: String, default: "" },
    avatarUrl: { type: String, default: "" },
    followers: { type: Number, default: 0 },
    following: { type: Number, default: 0 },
    company: { type: String, default: "" },
    location: { type: String, default: "" },
    website: { type: String, default: "" },

    socials: {
        twitter: { type: String, default: "" },
        linkedin: { type: String, default: "" },
        github: { type: String, default: "" },
    },

    // array of repo ids
    pinnedRepos: [{ type: Types.ObjectId, ref: "Repo" }]

}, {
    timestamps: true
});

userSchema.methods.setPassword = async function (password) {
    this.passwordHash = await bcrypt.hash(password, 12);
};

userSchema.methods.validatePassword = async function (password) {
    return bcrypt.compare(password, this.passwordHash);
};

export default model("User", userSchema);