import { useState } from "react";
import { FaFacebook, FaGoogle, FaInstagram, FaArrowLeft } from "react-icons/fa";
import Decor from '../../assets/asoy.png'
import { Link } from "react-router-dom";

export default function Register() {
    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        password: "",
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = () => {
        console.log("Form submitted:", formData);
    };

    return (
        <div className="min-h-screen flex items-center justify-end ">
            <button
                onClick={() => console.log("Back")}
                aria-label="Kembali"
                className="absolute top-4 left-4 z-999 flex items-center justify-center w-9 h-9 rounded-full cursor-pointer transition-colors duration-200 hover:bg-white/20"
                style={{ backgroundColor: "rgba(255,255,255,0.12)", border: "1.5px solid rgba(255,255,255,0.25)" }}
            >
                <FaArrowLeft size={15} color="white" />
            </button>
            <img src={Decor} alt="" className="h-screen w-280 absolute z-20 left-0" />
            <div
                className="w-full mr-36 relative z-30 max-w-lg rounded-3xl px-9 pt-10 pb-8 flex flex-col"
                style={{ backgroundColor: "#6B0C0C" }}
            >
                {/* Title */}
                <h1 className="text-white text-2xl font-extrabold text-center tracking-widest mb-7">
                    CREATE ACCOUNT
                </h1>

                {/* Full Name */}
                <div className="flex flex-col gap-1.5 mb-4">
                    <label className="text-white text-sm">Full Name</label>
                    <input
                        type="text"
                        name="fullName"
                        placeholder="Enter your name"
                        value={formData.fullName}
                        onChange={handleChange}
                        className="rounded-xl px-4 py-3.5 text-sm text-white/75 placeholder-white/40 outline-none w-full"
                        style={{
                            backgroundColor: "rgba(255,255,255,0.12)",
                            border: "1.5px solid rgba(255,255,255,0.35)",
                        }}
                    />
                </div>

                {/* Email */}
                <div className="flex flex-col gap-1.5 mb-4">
                    <label className="text-white text-sm">Email</label>
                    <input
                        type="email"
                        name="email"
                        placeholder="Enter your email"
                        value={formData.email}
                        onChange={handleChange}
                        className="rounded-xl px-4 py-3.5 text-sm text-white/75 placeholder-white/40 outline-none w-full"
                        style={{
                            backgroundColor: "rgba(255,255,255,0.12)",
                            border: "1.5px solid rgba(255,255,255,0.35)",
                        }}
                    />
                </div>

                {/* Password */}
                <div className="flex flex-col gap-1.5 mb-5">
                    <label className="text-white text-sm">Password</label>
                    <input
                        type="password"
                        name="password"
                        placeholder="Enter your password"
                        value={formData.password}
                        onChange={handleChange}
                        className="rounded-xl px-4 py-3.5 text-sm text-white/75 placeholder-white/40 outline-none w-full"
                        style={{
                            backgroundColor: "rgba(255,255,255,0.12)",
                            border: "1.5px solid rgba(255,255,255,0.35)",
                        }}
                    />
                </div>

                {/* Sign Up Button */}
                <button
                    onClick={handleSubmit}
                    className="w-full rounded-2xl py-4 text-base font-bold tracking-widest cursor-pointer mb-5"
                    style={{ backgroundColor: "#F5F0E8", color: "#6B0C0C" }}
                >
                    SIGN UP
                </button>

                {/* Divider */}
                <div className="flex items-center gap-3 mb-5">
                    <div className="flex-1 h-px bg-white/30" />
                    <span className="text-white/60 text-xs tracking-widest">OR</span>
                    <div className="flex-1 h-px bg-white/30" />
                </div>

                {/* Social Icons */}
                <div className="flex justify-center gap-7 mb-7">
                    <button
                        aria-label="Sign up with Facebook"
                        className="bg-transparent border-none cursor-pointer flex items-center justify-center"
                    >
                        <FaFacebook size={26} color="white" />
                    </button>
                    <button
                        aria-label="Sign up with Google"
                        className="bg-transparent border-none cursor-pointer flex items-center justify-center"
                    >
                        <FaGoogle size={26} color="white" />
                    </button>
                    <button
                        aria-label="Sign up with Instagram"
                        className="bg-transparent border-none cursor-pointer flex items-center justify-center"
                    >
                        <FaInstagram size={26} color="white" />
                    </button>
                </div>

                {/* Login Link */}
                <p className="text-center text-white text-xs font-semibold tracking-wide">
                    HAVE AN ACCOUNT?{" "}
                    <Link to='/login'
                        className="cursor-pointer font-bold tracking-widest"
                        style={{ color: "#F5F0E8" }}
                    >
                        LOGIN
                    </Link>
                </p>
            </div>
        </div>
    );
}