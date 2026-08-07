import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import User from '@/models/User';
import bcrypt from 'bcryptjs';

export async function POST(req: Request) {
  try {
    const { email, otp } = await req.json();

    if (!email || !otp) {
      return NextResponse.json(
        { message: 'Please provide email and OTP' },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const user = await User.findOne({ email }).select('+otp +otpExpiry');

    if (!user) {
      return NextResponse.json(
        { message: 'User not found' },
        { status: 404 }
      );
    }

    if (user.isVerified) {
      return NextResponse.json(
        { message: 'User is already verified' },
        { status: 400 }
      );
    }

    if (!user.otp || !user.otpExpiry) {
      return NextResponse.json(
        { message: 'No OTP found for this user' },
        { status: 400 }
      );
    }

    if (user.otpExpiry < new Date()) {
      return NextResponse.json(
        { message: 'OTP has expired. Please request a new one.' },
        { status: 400 }
      );
    }

    const isOtpValid = await bcrypt.compare(otp, user.otp);

    if (!isOtpValid) {
      return NextResponse.json(
        { message: 'Invalid OTP' },
        { status: 400 }
      );
    }

    // OTP is valid
    user.isVerified = true;
    user.otp = undefined;
    user.otpExpiry = undefined;
    await user.save();

    return NextResponse.json(
      { message: 'Email verified successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('OTP Verification error:', error);
    return NextResponse.json(
      { message: 'An error occurred during verification' },
      { status: 500 }
    );
  }
}
