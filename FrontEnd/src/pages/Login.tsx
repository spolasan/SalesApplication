import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import axios from "axios";

const Login = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  // States for login form
  const [loginUsername, setLoginUsername] = useState("demo");
  const [loginPassword, setLoginPassword] = useState("demo123");
  const [loginLoading, setLoginLoading] = useState(false);

  // States for registration form
  const [registerUsername, setRegisterUsername] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerFullName, setRegisterFullName] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [registerLoading, setRegisterLoading] = useState(false);

  // State to track active tab
  const [activeTab, setActiveTab] = useState("login");

  // Handle login form submission
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginLoading(true);

    try {
      const formData = new URLSearchParams();
      formData.append('username', loginUsername);
      formData.append('password', loginPassword);

      const response = await axios.post(
        "http://localhost:5050/token",
        formData.toString(),
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded"
          }
        }
      );

      // Store both token and username
      localStorage.setItem('token', response.data.access_token);
      localStorage.setItem('username', loginUsername);

      toast({
        title: "Welcome back!",
        description: "Successfully logged in to your account.",
      });

      navigate("/dashboard");
    } catch (error) {
      console.error("Login Error:", error);
      toast({
        title: "Failed to log in",
        description: "Incorrect username or password",
        variant: "destructive"
      });
    } finally {
      setLoginLoading(false);
    }
  };

  // Handle registration form submission
  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegisterLoading(true);

    try {
      // Make the API request to register the user
      const response = await axios.post(
        "http://localhost:5050/register",
        { 
          username: registerUsername,
          email: registerEmail,
          full_name: registerFullName,
          password: registerPassword 
        },
        {
          headers: {
            "Content-Type": "application/json"
          }
        }
      );

      // For demo purposes, just log the response
      console.log("Registered User:", response.data);

      // Show success toast
      toast({
        title: "Registration Successful!",
        description: "You have successfully registered a new account.",
      });

      // Navigate to dashboard (or any other page)
      navigate("/dashboard");
    } catch (error) {
      // Handle error (e.g., show an error message)
      console.error("Register Error:", error);
      toast({
        title: "Failed to register",
        description: "Username already registered or invalid data.",
        variant: "destructive"
      });
    } finally {
      setRegisterLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md px-4"
      >
        <div className="bg-white p-8 rounded-2xl shadow-xl">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h2>
            <p className="text-gray-600">Please enter your details to continue</p>
          </div>

          <nav className="flex mb-8 bg-gray-100 p-1 rounded-lg">
            <button
              onClick={() => setActiveTab("login")}
              className={`flex-1 py-2 px-4 rounded-md transition-all duration-200 ${
                activeTab === "login"
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Login
            </button>
            <button
              onClick={() => setActiveTab("register")}
              className={`flex-1 py-2 px-4 rounded-md transition-all duration-200 ${
                activeTab === "register"
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Register
            </button>
          </nav>

          {activeTab === "login" && (
            <motion.form
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              onSubmit={handleLoginSubmit}
              className="space-y-6"
            >
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Username</label>
                <Input
                  type="text"
                  placeholder="Enter your username"
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  value={loginUsername}
                  onChange={(e) => setLoginUsername(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Password</label>
                <Input
                  type="password"
                  placeholder="Enter your password"
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                />
              </div>
              <Button
                type="submit"
                className="w-full py-2 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 transform hover:scale-[1.02]"
                disabled={loginLoading}
              >
                {loginLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="w-5 h-5 border-t-2 border-b-2 border-white rounded-full animate-spin mr-2"></div>
                    Signing in...
                  </div>
                ) : (
                  "Sign in"
                )}
              </Button>
            </motion.form>
          )}

          {activeTab === "register" && (
            <motion.form
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              onSubmit={handleRegisterSubmit}
              className="space-y-6"
            >
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Username</label>
                <Input
                  type="text"
                  placeholder="Choose a username"
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  value={registerUsername}
                  onChange={(e) => setRegisterUsername(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Email</label>
                <Input
                  type="email"
                  placeholder="Enter your email"
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  value={registerEmail}
                  onChange={(e) => setRegisterEmail(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Full Name</label>
                <Input
                  type="text"
                  placeholder="Enter your full name"
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  value={registerFullName}
                  onChange={(e) => setRegisterFullName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Password</label>
                <Input
                  type="password"
                  placeholder="Choose a strong password"
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  value={registerPassword}
                  onChange={(e) => setRegisterPassword(e.target.value)}
                />
              </div>
              <Button
                type="submit"
                className="w-full py-2 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 transform hover:scale-[1.02]"
                disabled={registerLoading}
              >
                {registerLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="w-5 h-5 border-t-2 border-b-2 border-white rounded-full animate-spin mr-2"></div>
                    Creating account...
                  </div>
                ) : (
                  "Create Account"
                )}
              </Button>
            </motion.form>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
