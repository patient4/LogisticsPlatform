import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { Redirect } from "wouter";

export default function AuthPage() {
  const { user, loginMutation } = useAuth();
  const [loginData, setLoginData] = useState({ username: "", password: "" });
  
  if (user) {
    return <Redirect to="/" />;
  }

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    loginMutation.mutate(loginData);
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: '#f8fafc', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      padding: '20px'
    }}>
      <div style={{ 
        width: '100%', 
        maxWidth: '400px',
        backgroundColor: 'white',
        padding: '40px',
        borderRadius: '8px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <h1 style={{ 
            fontSize: '28px', 
            fontWeight: 'bold', 
            color: '#1f2937',
            marginBottom: '8px'
          }}>
            EverFlown Logistics
          </h1>
          <p style={{ 
            fontSize: '16px', 
            color: '#6b7280'
          }}>
            Sign in to your account
          </p>
        </div>
        
        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div>
            <label style={{ 
              display: 'block', 
              fontSize: '14px', 
              fontWeight: '500', 
              color: '#374151',
              marginBottom: '8px'
            }}>
              Username
            </label>
            <input
              type="text"
              value={loginData.username}
              onChange={(e) => setLoginData({ ...loginData, username: e.target.value })}
              placeholder="Enter your username"
              style={{
                width: '100%',
                padding: '12px',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                fontSize: '16px',
                boxSizing: 'border-box'
              }}
              required
            />
          </div>
          
          <div>
            <label style={{ 
              display: 'block', 
              fontSize: '14px', 
              fontWeight: '500', 
              color: '#374151',
              marginBottom: '8px'
            }}>
              Password
            </label>
            <input
              type="password"
              value={loginData.password}
              onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
              placeholder="Enter your password"
              style={{
                width: '100%',
                padding: '12px',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                fontSize: '16px',
                boxSizing: 'border-box'
              }}
              required
            />
          </div>
          
          <button
            type="submit"
            disabled={loginMutation.isPending}
            style={{
              width: '100%',
              padding: '12px',
              backgroundColor: '#3b82f6',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              fontSize: '16px',
              fontWeight: '500',
              cursor: loginMutation.isPending ? 'not-allowed' : 'pointer',
              opacity: loginMutation.isPending ? 0.6 : 1
            }}
          >
            {loginMutation.isPending ? 'Signing in...' : 'Sign In'}
          </button>
          

        </form>
      </div>
    </div>
  );
}