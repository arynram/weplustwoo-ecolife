import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import User from '@/models/User';
import bcrypt from 'bcryptjs';
import { sendOTP } from '@/lib/mailer';
import crypto from 'crypto';

export async function POST(req: Request) {
  try {
    const { name, email, password, dob, gender } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json(
        { message: 'Please provide all required fields' },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return NextResponse.json(
        { message: 'User with this email already exists' },
        { status: 409 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Generate 6-digit OTP
    const otp = crypto.randomInt(100000, 999999).toString();
    const hashedOtp = await bcrypt.hash(otp, 10);
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      dob,
      gender,
      isVerified: false,
      otp: hashedOtp,
      otpExpiry,
    });

    try {
      await sendOTP(email, otp);
    } catch (emailError) {
      // We still registered the user, but email failed. They can request another OTP later.
      console.error("Failed to send OTP email:", emailError);
    }

    return NextResponse.json(
      { message: 'User registered successfully. Please verify your email.', userId: newUser._id, needsVerification: true },
      { status: 201 }
    );
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { message: 'An error occurred during registration' },
      { status: 500 }
    );
  }
}
