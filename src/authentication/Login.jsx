import { IoEyeOffOutline, IoEyeOutline } from "react-icons/io5";
import { MdOutlineMail } from "react-icons/md";
import { RiLockPasswordLine } from "react-icons/ri";

import { signInWithEmailAndPassword } from "firebase/auth";
import { toast } from "sonner";
import IsError from "./IsError";
import auth from "@/firebase/firebase.init";
import AuthHeader from "./AuthHeader";
import NavigateTo from "./NavigateTo";
import { useAuthUser } from "@/redux/auth/authAction";
import SocialLogin from "./SocialLogin";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAxiosPublic } from "@/hooks/useAxiosPublic";
import { Button } from "@/components/ui/button";

const Login = () => {
  const user = useAuthUser();
  const navigate = useNavigate();

  // states for email & password
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  // states for loading & error & eyeOpen
  const [loading, setLoading] = useState(false);
  const [isEyeOpen, setIsEyeOpen] = useState(false);
  const [isError, setIsError] = useState("");
  const axiosPublic = useAxiosPublic();

  // Login User functionality --->
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    setIsError("");
    try {
      toast.promise(signInWithEmailAndPassword(auth, email, password), {
        loading: "Signing in...",
        success: async () => {
          try {
            // Optionally update last login time
            await axiosPublic.patch(`/users/last-login-at/${email}`, {
              lastLoginAt: new Date().toISOString(),
            });
          } catch (err) {
            toast.error(err.message);
          }
          setLoading(false);
          navigate("/");
          return <b>Signin Successful!</b>;
        },
        error: (error) => {
          setLoading(false);
          return error.message;
        },
      });
    } catch (error) {
      let errorMessage = "Login Failed!";
      setLoading(false);
      setIsError(errorMessage);
    }
  };

  return (
    <div className="bg-blue-100/20">
      <div className="w-11/12 mx-auto xl:w-10/12 min-h-screen px-4 py-12 flex flex-col md:flex-row gap-6 items-center justify-center max-w-screen-xl">
        <div className="max-w-lg lg:max-w-md xl:max-w-xl mx-auto p-6 bg-white border border-border shadow rounded-lg">
          {/* Header & Logo */}
          <AuthHeader />

          {/* Register Form */}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-3">
            {/* Email input */}
            <div>
              {/* Label */}
              <label
                htmlFor="email"
                className="text-[16px] text-text font-[600]"
              >
                Email
              </label>
              {/* Input with icon */}
              <div className="w-full mt-2 relative">
                <MdOutlineMail className=" absolute top-3.5 left-3 text-[1.5rem] text-[#777777]" />
                <input
                  type="email"
                  name="email"
                  id="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email address"
                  className="peer border-blue-200 border rounded-md outline-none pl-11 pr-5 py-3 w-full focus:ring ring-blue-200 transition-colors duration-300"
                />
              </div>
            </div>
            {/* Password input */}
            <div>
              {/* Label */}
              <label
                htmlFor="password"
                className="text-[16px] text-text font-[600]"
              >
                Password
              </label>
              {/* Input with icon */}
              <div className="w-full mt-2 relative">
                <RiLockPasswordLine className="absolute top-3.5 left-3 text-[1.5rem] text-[#777777]" />
                <input
                  type={isEyeOpen ? "text" : "password"}
                  id="password"
                  name="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="peer border-blue-200 border rounded-md outline-none pl-11 pr-12 py-3 w-full focus:ring ring-blue-200 transition-colors duration-300"
                />

                {isEyeOpen ? (
                  <IoEyeOutline
                    className="absolute top-3.5 right-3 text-[1.5rem] text-[#777777] cursor-pointer"
                    onClick={() => setIsEyeOpen(false)}
                  />
                ) : (
                  <IoEyeOffOutline
                    className="absolute top-3.5 right-3 text-[1.5rem] text-[#777777] cursor-pointer"
                    onClick={() => setIsEyeOpen(true)}
                  />
                )}
              </div>
            </div>
            {/* Error Message */}
            <IsError isError={isError} />
            {/* Register Button */}
            <Button
              type="submit"
              disabled={loading}
              className="btn py-2 border-none rounded-lg text-white text-lg mt-1 bg-[#0E82FD] hover:bg-[#0e72fd] duration-700 cursor-pointer"
            >
              {loading ? "Login in..." : "Login"}
            </Button>
          </form>

          {/* SocialLogin */}
          <SocialLogin setIsError={setIsError} />
          {/* Navigate to login */}
          <NavigateTo />
        </div>
      </div>
    </div>
  );
};

export default Login;
