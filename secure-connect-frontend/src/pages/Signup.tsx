import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
//, useNavigate
import { toast } from 'react-toastify';
import { useForm } from 'react-hook-form';
import axios from 'axios';

interface SignupFormData {
  username: string;
  password: string;
  confirmPassword: string;
}

function Signup() {
  // const navigate = useNavigate();



  const { register, handleSubmit, watch, formState: { errors }, setError,reset } = useForm<SignupFormData>();
  const [passwordMatch, setPasswordMatch] = useState(true);

  const password = watch('password');
  const confirmPassword = watch('confirmPassword');

  useEffect(() => {
    if (password && confirmPassword) {
      setPasswordMatch(password === confirmPassword);
    }
  }, [password, confirmPassword]);

  const onSubmit = (data: SignupFormData) => {
    if (data.password !== data.confirmPassword) {
      setError('confirmPassword', { type: 'manual', message: 'Passwords do not match' });
      return;
    }

    // NEW: Send the signup data to the backend using Axios
    axios.post('http://localhost:3060/auth/signUp', { // CHANGE port/endpoint as needed
      username: data.username,
      password: data.password
    })
        .then(response => {
          // Save the bearer token (assuming it's in response.data.token)
          localStorage.setItem('token', response.data.access_token);
          toast.success('Account created successfully!');
          reset(); // NEW: Clear form fields
          // Optionally, navigate to another page after signup
          // navigate('/');
        })
        .catch(error => {
          toast.error('Signup failed.');
          console.error(error);
        });
  };

  return (
    <div className="auth-container">
      <div className="auth-left">
        <h1>HELLO,</h1>
        <h1>WELCOME</h1>
      </div>
      <div className="auth-right">
        <div className="auth-form-container">
          <h2>SIGN UP</h2>
          <form onSubmit={handleSubmit(onSubmit)} className="auth-form">
            <div className="form-group">
              <label htmlFor="username">Username</label>
              <input
                type="text"
                id="username"
                {...register('username', {
                  required: 'Username is required',
                  minLength: {
                    value: 3,
                    message: 'Username must be at least 3 characters'
                  }
                })}
                className={errors.username ? 'error' : ''}
              />
              {errors.username && (
                <span className="error-message">{errors.username.message}</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                {...register('password', {
                  required: 'Password is required',
                  minLength: {
                    value: 8,
                    message: 'Password must be at least 8 characters'
                  },
                  pattern: {
                    value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/,
                    message: 'Password must contain at least one uppercase letter, one lowercase letter, and one number'
                  }
                })}
                className={errors.password ? 'error' : ''}
              />
              {errors.password && (
                <span className="error-message">{errors.password.message}</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <input
                type="password"
                id="confirmPassword"
                {...register('confirmPassword', {
                  required: 'Please confirm your password',
                  validate: value => value === password || 'Passwords do not match'
                })}
                className={errors.confirmPassword || !passwordMatch ? 'error' : ''}
              />
              {errors.confirmPassword && (
                <span className="error-message">{errors.confirmPassword.message}</span>
              )}
              {!passwordMatch && !errors.confirmPassword && (
                <span className="error-message">Passwords do not match</span>
              )}
            </div>

            <button type="submit" className="auth-button">
              Register now
            </button>
          </form>
          <Link to="/" className="auth-link">Already have an account? Login</Link>
        </div>
      </div>
    </div>
  );
}

export default Signup;