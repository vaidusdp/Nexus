import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Shield, Loader2 } from 'lucide-react';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { useAuthStore } from '../store/authStore'; 
export function Login() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const loginGlobal = useAuthStore((state) => state.login);

  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await loginGlobal(formData.email, formData.password);
  
      if (result && result.success) {
        alert("Welcome back to the Nexus!");
        navigate('/'); 
      } else {
        alert(result?.message || "Sign-In Failed");
      }
    } catch (err) {
      console.error("Component handling crash:", err);
      alert("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
      }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center animate-in fade-in zoom-in-95 duration-500">
      <div className="w-full max-w-md bg-vexor-card border border-gray-800 rounded-2xl p-8 relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-2 bg-vexor-accent blur-[20px] opacity-30" />
        
        <div className="flex flex-col items-center mb-8">
          <div className="bg-vexor-accent/10 p-3 rounded-xl border border-vexor-accent/20 mb-4">
            <Shield className="w-8 h-8 text-vexor-accent" />
          </div>
          <h1 className="text-2xl font-bold text-white tracking-wide">Access Identity</h1>
          <p className="text-gray-400 text-sm mt-2">Log in to sync your match queues.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input 
            label="Email Address" 
            type="email" 
            name="email"
            placeholder="glhf@nexus.gg"
            value={formData.email}
            onChange={handleChange}
            required
          />
          
          <Input 
            label="Password" 
            type="password" 
            name="password"
            placeholder="••••••••"
            value={formData.password}
            onChange={handleChange}
            required
          />

          <Button 
            type="submit" 
            className="w-full mt-4 justify-center" 
            size="lg"
            disabled={loading}
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Authorizing Security...</span>
              </div>
            ) : (
              'Enter Nexus'
            )}
          </Button>
        </form>

        <p className="text-center text-sm text-gray-400 mt-6">
          New to the hub?{' '}
          <Link to="/register" className="text-vexor-accent hover:text-white transition-colors font-medium">
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
}