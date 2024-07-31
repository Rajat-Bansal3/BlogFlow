import React, { useState } from "react";
import cn from "../utils";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { backendUrl } from "../config";

type Props = {
  className: string;
};

type FormData = {
  [key: string]: string;
};

const SignupWrapper: React.FC<Props> = ({ className }) => {
  const nav = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState<FormData>({});

  const onChangeHandle = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const submitHandle = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const resp = await axios.post(
        `${backendUrl}api/v1/user/signup`,
        formData
      );

      localStorage.setItem("token", `Bearer ${resp.data.token}`);

      console.log(resp);
      setLoading(false);
      setError(null);
      nav("/blogs");
    } catch (error: any) {
      console.log(error);
      setError(error.message);
      setLoading(false);
    }
  };

  return (
    <div className={cn(className, "flex flex-col items-center p-4")}>
      <div className='mb-6 text-center'>
        <h1 className='font-bold text-4xl mb-2'>Create an account</h1>
        <div className='text-gray-500'>
          Already have an account?{" "}
          <Link to='/signin' className='text-blue-500'>
            Login
          </Link>
        </div>
      </div>
      <form onSubmit={submitHandle} className='w-full max-w-lg'>
        <div className='flex flex-col gap-4 mb-4'>
          <label htmlFor='username' className='text-lg'>
            Username
          </label>
          <input
            disabled={loading}
            type='text'
            name='username'
            id='username'
            onChange={onChangeHandle}
            value={formData.username || ""}
            placeholder='e.g., John Doe'
            className='border p-3 rounded-lg w-full'
          />
        </div>
        <div className='flex flex-col gap-4 mb-4'>
          <label htmlFor='email' className='text-lg'>
            Email
          </label>
          <input
            disabled={loading}
            type='email'
            name='email'
            id='email'
            onChange={onChangeHandle}
            value={formData.email || ""}
            placeholder='e.g., JohnDoe234@xyz.com'
            className='border p-3 rounded-lg w-full'
          />
        </div>
        <div className='flex flex-col gap-4 mb-4'>
          <label htmlFor='password' className='text-lg'>
            Password
          </label>
          <input
            disabled={loading}
            type='password'
            name='password'
            id='password'
            onChange={onChangeHandle}
            value={formData.password || ""}
            placeholder='e.g., John Doe'
            className='border p-3 rounded-lg w-full'
          />
        </div>
        <button
          type='submit'
          className='bg-black/80 text-white p-3 rounded-lg w-full'
        >
          {loading ? "loading..." : "Sign Up"}
        </button>
        {error && (
          <div>an error occured while submitting the form : {error}</div>
        )}
      </form>
    </div>
  );
};

export default SignupWrapper;
