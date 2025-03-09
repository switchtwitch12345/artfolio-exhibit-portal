import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";
import { Eye, EyeOff, ArrowRight, Check, Mail, Lock, User } from "lucide-react";
import { toast } from "sonner";
import { login, register } from "@/services/authService";
import { useAuth } from "@/context/AuthContext";
import "../styles/auth.css";

const FloatingBubbles = () => {
  return (
    <>
      {[...Array(6)].map((_, index) => {
        const size = Math.random() * 150 + 50;
        const left = Math.random() * 100;
        const top = Math.random() * 100;
        const delay = Math.random() * 5;
        const duration = Math.random() * 10 + 15;
        
        return (
          <div
            key={index}
            className="floating-bubble"
            style={{
              width: `${size}px`,
              height: `${size}px`,
              left: `${left}%`,
              top: `${top}%`,
              animationDelay: `${delay}s`,
              animationDuration: `${duration}s`,
              opacity: Math.random() * 0.2 + 0.1,
            }}
          />
        );
      })}
    </>
  );
};

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { setUser } = useAuth();
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
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
      
      setUser(userData);
      
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
    setEmail("");
    setPassword("");
    setName("");
  };

  return (
    <div className="auth-container">
      <FloatingBubbles />
      
      <div className="auth-wrapper">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
          className="auth-card"
        >
          <div className="auth-header">
            <motion.h1 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="auth-title"
            >
              {isLogin ? "Welcome back" : "Create an account"}
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="auth-subtitle"
            >
              {isLogin 
                ? "Sign in to access your ArtFolio" 
                : "Join our community of student artists"
              }
            </motion.p>
          </div>
          
          <form onSubmit={handleSubmit} className="auth-form">
            {!isLogin && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.6 }}
                className="form-group"
              >
                <label htmlFor="name" className="form-label">
                  Full Name
                </label>
                <div className="password-input-wrapper">
                  <User size={16} className="input-icon" />
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
              </motion.div>
            )}
            
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: isLogin ? 0.4 : 0.5, duration: 0.6 }}
              className="form-group"
            >
              <label htmlFor="email" className="form-label">
                Email Address
              </label>
              <div className="password-input-wrapper">
                <Mail size={16} className="input-icon" />
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
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: isLogin ? 0.5 : 0.6, duration: 0.6 }}
              className="form-group"
            >
              <label htmlFor="password" className="form-label">
                Password
              </label>
              <div className="password-input-wrapper">
                <Lock size={16} className="input-icon" />
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
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </motion.div>
            
            {isLogin && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6, duration: 0.6 }}
                className="forgot-password-wrapper"
              >
                <button
                  type="button"
                  className="forgot-password-btn"
                >
                  Forgot password?
                </button>
              </motion.div>
            )}
            
            <motion.button
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: isLogin ? 0.7 : 0.8, duration: 0.6 }}
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
            </motion.button>
          </form>
          
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9, duration: 0.6 }}
            className="auth-footer"
          >
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
          </motion.div>
          
          {!isLogin && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1, duration: 0.6 }}
              className="terms-container"
            >
              <p className="terms-text">
                <Check size={16} className="terms-icon" />
                <span>
                  By creating an account, you agree to our Terms of Service and Privacy Policy
                </span>
              </p>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default Auth;
