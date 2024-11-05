import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      index: true,
      trim: true,
      minlength: [3, "Username must be at least 3 characters long"],
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      index: true,
      lowercase: true,
      trim: true,
    },
    passwordHash: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["artist", "requester"],
      required: true,
    },
    avatarUrl: {
      type: String,
      default: "/path/to/avatar.jpg",
    },
    location: {
      type: String,
      default: "",
    },
    // New security-related fields
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    emailVerificationToken: String,
    emailVerificationExpires: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
    failedLoginAttempts: {
      type: Number,
      default: 0,
    },
    accountLockUntil: Date,
    lastLogin: Date,
    active: {
      type: Boolean,
      default: true,
    },
    refreshTokens: [
      {
        token: String,
        expires: Date,
        userAgent: String,
        lastUsed: Date,
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Password virtual
userSchema.virtual("password").set(function (password) {
  this._password = password;
  if (password) {
    const salt = bcrypt.genSaltSync(10);
    this.passwordHash = bcrypt.hashSync(password, salt);
  }
});

// Enhanced password comparison with rate limiting check
userSchema.methods.comparePassword = async function (candidatePassword) {
  // Check if account is temporarily locked
  if (this.accountLockUntil && this.accountLockUntil > Date.now()) {
    throw new Error("Account is temporarily locked. Please try again later.");
  }

  const isMatch = await bcrypt.compare(candidatePassword, this.passwordHash);

  if (!isMatch) {
    // Increment failed attempts
    this.failedLoginAttempts += 1;

    // Lock account if too many failed attempts
    if (this.failedLoginAttempts >= 5) {
      this.accountLockUntil = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes
    }

    await this.save();
    throw new Error("Invalid password");
  }

  // Reset failed attempts on successful login
  if (this.failedLoginAttempts > 0) {
    this.failedLoginAttempts = 0;
    this.accountLockUntil = undefined;
    await this.save();
  }

  return true;
};

// Method to generate password reset token
userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString("hex");

  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  this.passwordResetExpires = Date.now() + 10 * 60 * 1000; // 10 minutes

  return resetToken;
};

// Method to add refresh token
userSchema.methods.addRefreshToken = function (token, userAgent) {
  this.refreshTokens.push({
    token: token,
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    userAgent,
    lastUsed: new Date(),
  });

  // Limit to 5 active refresh tokens per user
  if (this.refreshTokens.length > 5) {
    this.refreshTokens.shift(); // Remove oldest token
  }

  return this.save();
};

// Method to validate refresh token
userSchema.methods.validateRefreshToken = async function (token) {
  const tokenDoc = this.refreshTokens.find((t) => t.token === token);

  if (!tokenDoc) return false;
  if (tokenDoc.expires < new Date()) {
    // Remove expired token
    this.refreshTokens = this.refreshTokens.filter((t) => t.token !== token);
    await this.save();
    return false;
  }

  // Update last used timestamp
  tokenDoc.lastUsed = new Date();
  await this.save();
  return true;
};

// Add index for email verification token
userSchema.index({ emailVerificationToken: 1 }, { sparse: true });
userSchema.index({ passwordResetToken: 1 }, { sparse: true });

const User = mongoose.model("User", userSchema, "users");
export default User;
