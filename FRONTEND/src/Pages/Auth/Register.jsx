import { useState } from "react";
import { FaFacebook, FaGoogle, FaInstagram, FaArrowLeft, FaEyeSlash, FaEye } from "react-icons/fa";
import Decor from '../../assets/asoy.png';
import { Link, useNavigate } from "react-router-dom";
import useAuth from "../../Hooks/useAuth";

export default function Register() {
    const { register } = useAuth();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({ name: "", email: "", password: "" });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [seePassword, setSeePassword] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError("");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        setSeePassword(false);
        try {
            await register(formData.name, formData.email, formData.password);
            navigate("/login");
        } catch (err) {
            const errors = err.response?.data?.errors;
            if (errors) {
                const firstError = Object.values(errors).flat()[0];
                setError(firstError);
            } else {
                setError(err.response?.data?.message || "Registrasi gagal, coba lagi");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-end">
            <button
                onClick={() => navigate(-1)}
                aria-label="Kembali"
                className="absolute top-4 left-8 z-999 flex items-center justify-center bg-primary w-9 h-9 rounded-full cursor-pointer transition duration-200 hover:-translate-x-1 hover:bg-primary/90"
            >
                <FaArrowLeft size={15} color="white" />
            </button>

            <img src={Decor} alt="" className="h-screen w-280 absolute z-20 left-0" />

            <div
                className="w-full mr-24 relative z-30 max-w-lg rounded-3xl px-9 py-5 flex flex-col"
                style={{ backgroundColor: "#6B0C0C" }}
            >
                <h1 className="text-white text-2xl font-extrabold text-center tracking-widest mb-7">
                    CREATE ACCOUNT
                </h1>

                <form onSubmit={handleSubmit}>
                    {error && (
                        <div className="mb-4 px-4 py-3 rounded-xl text-sm text-white text-center"
                            style={{ backgroundColor: "rgba(255,100,100,0.25)", border: "1px solid rgba(255,100,100,0.4)" }}>
                            {error}
                        </div>
                    )}

                    <div className="flex flex-col gap-1.5 mb-4">
                        <label className="text-white text-sm">Full Name</label>
                        <input
                            type="text"
                            name="name"
                            placeholder="Enter your name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            className="rounded-xl px-4 py-3.5 text-sm text-white/75 placeholder-white/40 outline-none w-full"
                            style={{ backgroundColor: "rgba(255,255,255,0.12)", border: "1.5px solid rgba(255,255,255,0.35)" }}
                        />
                    </div>

                    <div className="flex flex-col gap-1.5 mb-4">
                        <label className="text-white text-sm">Email</label>
                        <input
                            type="email"
                            name="email"
                            placeholder="Enter your email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            className="rounded-xl px-4 py-3.5 text-sm text-white/75 placeholder-white/40 outline-none w-full"
                            style={{ backgroundColor: "rgba(255,255,255,0.12)", border: "1.5px solid rgba(255,255,255,0.35)" }}
                        />
                    </div>

                    <div className="flex flex-col gap-1.5 mb-5">
                        <label className="text-white text-sm">Password</label>
                        <div className="relative">
                            <input
                                type={seePassword ? "text" : "password"}
                                name="password"
                                placeholder="Enter your password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                                className="rounded-xl px-4 py-3.5 text-sm text-white/75 placeholder-white/40 outline-none w-full"
                                style={{ backgroundColor: "rgba(255,255,255,0.12)", border: "1.5px solid rgba(255,255,255,0.35)" }}
                            />
                            <button
                                type="button"
                                onClick={() => setSeePassword(!seePassword)}
                                className="absolute right-5 top-4.5 text-white/75"
                            >
                                {seePassword ? <FaEye /> : <FaEyeSlash />}
                            </button>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full rounded-2xl py-4 text-base font-bold tracking-widest cursor-pointer mb-5 disabled:opacity-60"
                        style={{ backgroundColor: "#F5F0E8", color: "#6B0C0C" }}
                    >
                        {loading ? "LOADING..." : "SIGN UP"}
                    </button>
                </form>

                <div className="flex items-center gap-3 mb-5">
                    <div className="flex-1 h-px bg-white/30" />
                    <span className="text-white/60 text-xs tracking-widest">OR</span>
                    <div className="flex-1 h-px bg-white/30" />
                </div>

                <div className="flex justify-center gap-7 mb-7">
                    <button aria-label="Facebook" className="bg-transparent border-none cursor-pointer">
                        <FaFacebook size={26} color="white" />
                    </button>
                    <button aria-label="Google" className="bg-transparent border-none cursor-pointer">
                        <FaGoogle size={26} color="white" />
                    </button>
                    <button aria-label="Instagram" className="bg-transparent border-none cursor-pointer">
                        <FaInstagram size={26} color="white" />
                    </button>
                </div>

                <p className="text-center text-white text-xs font-semibold tracking-wide">
                    HAVE AN ACCOUNT?{" "}
                    <Link to="/login" className="cursor-pointer font-bold tracking-widest" style={{ color: "#F5F0E8" }}>
                        LOGIN
                    </Link>
                </p>
            </div>
        </div>
    );
}
