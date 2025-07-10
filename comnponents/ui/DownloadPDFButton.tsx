'use client'

import { useState, useCallback } from "react";

const DownloadPDFButton: React.FC = () => {
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const handleDownload = useCallback(async () => {
        if (isLoading) return;

        setIsLoading(true);
        try {
            const pdfUrl = '/pdf/Mayuresh Talewar Resume.pdf';
            const link = document.createElement('a');
            link.href = pdfUrl;
            link.download = 'Mayuresh Talewar Resume.pdf';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (error) {
            console.error('Error downloading PDF:', error);
            alert('Failed to download resume. Please try again.');
        } finally {
            setTimeout(() => setIsLoading(false), 500);
        }
    }, [isLoading]);

    return (
        <button
            onClick={handleDownload}
            disabled={isLoading}
            className="w-40 h-10 rounded-xl cursor-pointer bg-[#eef8ce] text-black border border-black text-sm hover:bg-gray-100 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
            {isLoading ? 'Downloading...' : 'Download CV'}
        </button>
    );
};

export default DownloadPDFButton;