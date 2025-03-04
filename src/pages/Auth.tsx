
import React, { useState } from "react";
import { motion } from "framer-motion";
import AnimatedLayout from "@/components/AnimatedLayout";
import { useNavigate, useLocation } from "react-router-dom";
import { Eye, EyeOff, ArrowRight, Check } from "lucide-react";
import { toast } from "sonner";

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  
  // Form states
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simple validation
    if (!email || !password || (!isLogin && !name)) {
      toast.error("Please fill in all fields");
      return;
    }
    
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      
      if (isLogin) {
        toast.success("Successfully logged in");
      } else {
        toast.success("Account created successfully");
      }
      
      // Navigate to the page they came from or to the gallery
      const from = location.state?.from?.pathname || "/gallery";
      navigate(from);
    }, 1500);
  };
  
  const toggleAuthMode = () => {
    setIsLogin(!isLogin);
    // Reset form fields when switching
    setEmail("");
    setPassword("");
    setName("");
  };

  return (
    <AnimatedLayout>
      <div className="min-h-[85vh] flex items-center justify-center py-12">
        <div className="container px-6 mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-md mx-auto glassmorphism rounded-2xl p-8 md:p-10"
          >
            <div className="text-center mb-8">
              <h1 className="text-2xl md:text-3xl font-semibold mb-3">
                {isLogin ? "Welcome back" : "Create an account"}
              </h1>
              <p className="text-gallery-700">
                {isLogin 
                  ? "Sign in to access your account" 
                  : "Join our community of student artists"
                }
              </p>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-5">
              {!isLogin && (
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gallery-900 mb-1">
                    Full Name
                  </label>
                  <input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="input-field w-full"
                    placeholder="Enter your full name"
                    required={!isLogin}
                  />
                </div>
              )}
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gallery-900 mb-1">
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input-field w-full"
                  placeholder="Enter your email"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gallery-900 mb-1">
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="input-field w-full pr-10"
                    placeholder={isLogin ? "Enter your password" : "Create a password"}
                    required
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gallery-500 hover:text-gallery-700 transition-colors duration-200"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
              
              {isLogin && (
                <div className="text-right">
                  <button
                    type="button"
                    className="text-sm text-gallery-700 hover:text-gallery-900 transition-colors duration-200"
                  >
                    Forgot password?
                  </button>
                </div>
              )}
              
              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full flex items-center justify-center"
              >
                {loading ? (
                  <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full" />
                ) : (
                  <>
                    {isLogin ? "Sign In" : "Create Account"}
                    <ArrowRight size={16} className="ml-2" />
                  </>
                )}
              </button>
            </form>
            
            <div className="mt-8 text-center">
              <p className="text-gallery-700">
                {isLogin ? "Don't have an account?" : "Already have an account?"}
                <button
                  type="button"
                  onClick={toggleAuthMode}
                  className="ml-1 text-black font-medium hover:text-gallery-700 transition-colors duration-200"
                >
                  {isLogin ? "Sign up" : "Sign in"}
                </button>
              </p>
            </div>
            
            {!isLogin && (
              <div className="mt-8 pt-6 border-t border-gallery-100">
                <p className="text-sm text-gallery-500 flex items-start">
                  <Check size={16} className="text-gallery-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span>
                    By creating an account, you agree to our Terms of Service and Privacy Policy
                  </span>
                </p>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </AnimatedLayout>
  );
};

export default Auth;
