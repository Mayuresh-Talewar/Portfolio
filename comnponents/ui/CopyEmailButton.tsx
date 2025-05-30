'use client'
import React, { useState } from 'react'

function CopyEmailButton() {
    const [isCopying, setIsCopying] = useState<boolean>(false);



    const handleCopyEmail = () => {
        const email = 'mtalewar2002@gmail.com'; // Replace with your email
        navigator.clipboard.writeText(email);
        setIsCopying(true);
        setTimeout(() => {
            setIsCopying(false);
        }, 1000);
    };
  return (
      <button
          onClick={handleCopyEmail}
          className="w-40 h-10 rounded-xl cursor-pointer text-[#eef8ce] border border-[#eef8ce] text-sm  transition-colors duration-200"
      >
          {isCopying ? 'Copying...' : 'Copy Email'}
      </button>  )
}

export default CopyEmailButton