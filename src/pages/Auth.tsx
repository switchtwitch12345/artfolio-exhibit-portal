
import React, { useState } from "react";
import { motion } from "framer-motion";
import AnimatedLayout from "@/components/AnimatedLayout";
import { useNavigate, useLocation } from "react-router-dom";
import { Eye, EyeOff, ArrowRight, Check } from "lucide-react";
import { toast } from "sonner";
import { login, register } from "@/services/authService";
import { useAuth } from "@/context/AuthContext";
import "../styles/auth.css";

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { setUser } = useAuth();
  
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
    
    try {
      let userData;
      
      if (isLogin) {
        userData = await login({ email, password });
        toast.success("Successfully logged in");
      } else {
        userData = await register({ name, email, password });
        toast.success("Account created successfully");
      }
      
      // Set the user in context
      setUser(userData);
      
      // Navigate to the page they came from or to the gallery
      const from = location.state?.from?.pathname || "/gallery";
      navigate(from);
    } catch (error) {
      let errorMessage = "An error occurred";
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
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
      <div className="auth-container">
        <div className="auth-wrapper">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="auth-card"
          >
            <div className="auth-header">
              <h1 className="auth-title">
                {isLogin ? "Welcome back" : "Create an account"}
              </h1>
              <p className="auth-subtitle">
                {isLogin 
                  ? "Sign in to access your account" 
                  : "Join our community of student artists"
                }
              </p>
            </div>
            
            <form onSubmit={handleSubmit} className="auth-form">
              {!isLogin && (
                <div className="form-group">
                  <label htmlFor="name" className="form-label">
                    Full Name
                  </label>
                  <input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="form-input"
                    placeholder="Enter your full name"
                    required={!isLogin}
                  />
                </div>
              )}
              
              <div className="form-group">
                <label htmlFor="email" className="form-label">
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="form-input"
                  placeholder="Enter your email"
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="password" className="form-label">
                  Password
                </label>
                <div className="password-input-wrapper">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="form-input"
                    placeholder={isLogin ? "Enter your password" : "Create a password"}
                    required
                  />
                  <button
                    type="button"
                    className="password-toggle-btn"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
              
              {isLogin && (
                <div className="forgot-password-wrapper">
                  <button
                    type="button"
                    className="forgot-password-btn"
                  >
                    Forgot password?
                  </button>
                </div>
              )}
              
              <button
                type="submit"
                disabled={loading}
                className="submit-btn"
              >
                {loading ? (
                  <div className="spinner" />
                ) : (
                  <>
                    {isLogin ? "Sign In" : "Create Account"}
                    <ArrowRight size={16} className="arrow-icon" />
                  </>
                )}
              </button>
            </form>
            
            <div className="auth-footer">
              <p className="toggle-mode-text">
                {isLogin ? "Don't have an account?" : "Already have an account?"}
                <button
                  type="button"
                  onClick={toggleAuthMode}
                  className="toggle-mode-btn"
                >
                  {isLogin ? "Sign up" : "Sign in"}
                </button>
              </p>
            </div>
            
            {!isLogin && (
              <div className="terms-container">
                <p className="terms-text">
                  <Check size={16} className="terms-icon" />
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
