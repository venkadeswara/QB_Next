"use client";
 
import Image from 'next/image'; 
import { useTheme } from "@/app/components/ThemeContext";



 
export default function About() {
      const { theadcolor,isDarkMode} = useTheme();
    
  return (
<>
<div className=" p-3 "  style={{backgroundColor:theadcolor}}>
<h2 className={`text-xl flex items-center justify-center font-bold text-gray-600 ${isDarkMode ? 'text-white' : ''}`}>Query Builder</h2>
</div>
<div className={`mt-16 ml-5 leading-loose ${isDarkMode ? 'text-white' : ''}`} >
<p>Version: </p>
<p>Build Date:</p>
<p>Build Number: ?</p>
<p>Copyright © 2000 - 2024, Fulcrum Technologies, Inc.</p>
</div>
 
      <div className='flex justify-center items-center opacity-35'>
<Image 
          src="/Query-Builder.png" 
          alt="Description of image"
          width={180}
          height={20}
        />  
               
       
</div>

</>
  );
}