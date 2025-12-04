import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, NavLink } from 'react-router';
import { loginUser } from '../authSlice';
import { useEffect, useState } from 'react';


const signupschema = z.object({
    emailId:z.string().email("Invalid email"),
    password:z.string().min(8,"Weak password")
})

function Login(){
    const [showPassword, setShowPassword] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate(); //hook 
    const { isAuthenticated,loading} = useSelector((state) => state.auth); // Removed error as it wasn't used


    const {register,handleSubmit,formState: { errors },} = useForm({resolver:zodResolver(signupschema)});

    useEffect(()=>{
        if(isAuthenticated){
            navigate('/')
        }
    },[isAuthenticated,navigate])

    const onsubmit = (data)=>{
        dispatch(loginUser(data))
    }
    
    return(
        <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 space-y-6">
        <h2 className="text-2xl font-bold text-center">Log In </h2>
        <p className="text-center text-gray-500"></p>

        <div className="flex justify-center">
          <button className="flex items-center gap-2 border px-4 py-2 rounded-md hover:bg-gray-50 w-full justify-center">
            <img src="https://img.icons8.com/color/16/000000/google-logo.png" alt="Google" />
            <span>Google</span>
          </button>
        </div>

        <div className="flex items-center gap-2 text-gray-400 text-sm">
          <hr className="flex-grow border-gray-300" />
          <span>OR CONTINUE WITH</span>
          <hr className="flex-grow border-gray-300" />
        </div>

        <form className="space-y-4" onSubmit={handleSubmit(onsubmit)}>
          <div>
            <label className="text-sm font-medium">Email</label>
            <input
              {...register('emailId')}
              className="w-full border px-3 py-2 rounded-md mt-1"
              placeholder="m@example.com"
            />
            {errors.emailId && (
              <p className="text-red-500 text-xs mt-1">{errors.emailId.message}</p>
            )}
          </div>

          <div>
            <label className="text-sm font-medium">Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                {...register('password')}
                className="w-full border px-3 py-2 rounded-md mt-1 pr-10"
                placeholder="********"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-2 flex items-center text-sm text-gray-500"
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>
            {errors.password && (
              <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md"
          >
            Log In
          </button>
        </form>

        <p className="text-center text-sm text-gray-500">
          Dont have an account?{' '}
          <NavLink to="/signup" className="text-blue-600 hover:underline">
            Sign Up
          </NavLink>
        </p>
      </div>
    </div>
    );
}

export default Login



//errors format 
/*{
    firstname{
        message :error
    }
    email{
        message:error
    }
    password:  // no error
}
    */