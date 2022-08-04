import { Link } from "@remix-run/react";

import { useOptionalUser } from "~/utils";

export default function Index() {
  const user = useOptionalUser();
  
  const mainPageTransition = () => {
    return (<Link to='maps'>test</Link>)
  }

  return (
    <div className="bg-gray-50 flex h-screen justify-center items-center">
      <img src="/images/winter-train.jpg" alt="" className="w-full h-full object-cover blur-md bg-black/30"></img> 
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:py-16 lg:px-8 lg:flex lg:items-center lg:justify-between absolute rounded-3xl shadow-lg bg-blue-100">
        <div>
          <div className=" text-4xl font-bold tracking-tight text-gray-900 sm:text-4xl"> 
            <span className="block text-gray-700">Welcome to </span>
            <span className="text-green-500">green</span><span className="text-violet-500">Transit</span>
          </div>
          <div className="text-3xl  block font-light lg:py-2 text-gray-500">
            Start your <span className="text-green-500"> green journey</span> today.
          </div>
        </div>
        <div className="mt-8 flex lg:mt-0 ml-12 lg:flex-shrink-0">
          <div className="inline-flex rounded-md shadow">
            <a href="maps" className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-green-600 hover:bg-green-700 transform transition-all hover:scale-105"> Let's Go! </a>
          </div>
          <div className="ml-3 inline-flex rounded-md shadow">
            <a href="#" className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-indigo-600 bg-white hover:bg-indigo-50 transform transition-all hover:scale-105"> Learn more </a>
          </div>
        </div>
      </div>
    </div>
  );
}
