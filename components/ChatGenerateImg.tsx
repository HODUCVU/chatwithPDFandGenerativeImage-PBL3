"use client";
import React, { ChangeEvent, useState } from 'react';

import { saveAs } from 'file-saver';
import DownloadImage from './DownloadImage';

type Props = {
    chatId: number;
};

const ChatGenerateImg: React.FC<Props> = ({ chatId }) => {
    const [prompt, setPrompt] = useState("");
    // const [imageUrl, setImageUrl] = useState<string | null>(null);
    const [imageUrls, setImageUrl] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Function to handle the word wrapping
    const handleTextChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
        const value = e.target.value;
        const words = value.split(/\s+/);
        const lines = [];
        for (let i = 0; i < words.length; i += 10) {
            lines.push(words.slice(i, i + 10).join(' '));
        }
        setPrompt(lines.join('\n'));
    };
    
    const generateImage = async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await fetch(`/api/generate-image?prompt=${encodeURIComponent(prompt)}`);
            if (!res.ok) {
                throw new Error("Failed to generate image");
            }
            const data = await res.json();
            setImageUrl(prevUrls  => [...prevUrls, data.url]); // Add new image URL to the array
            // setImageUrl(prevUrls  => [...prevUrls, data.image]); 
        } catch (e) {
            setError((e as Error).message);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault(); // Prevent form from refreshing the page
        generateImage(); // Call the image generation function
    };

    // Function to trigger download
    // const handleDownload = (url: string, index: number) => {
    //     saveAs(url, `image-${index + 1}.png`); 
    // };
    const handleDownload = (url: string, index: number) => {
        try {
            // Tạo thẻ <a> tạm thời
            const anchor = document.createElement('a');
            anchor.href = url;
            anchor.download = `image-${index + 1}.png`; // Đặt tên file
            anchor.target = '_blank'; // Đảm bảo không bị chặn bởi trình duyệt
            document.body.appendChild(anchor);
            anchor.click(); // Kích hoạt sự kiện click để tải xuống
            document.body.removeChild(anchor); // Xóa thẻ <a> khỏi DOM
        } catch (error) {
            console.error('Download failed:', error);
        }
    };
    // const handleDownload = async (url: string, index: number) => {
    //     try {
    //       const response = await fetch(url, { mode: 'no-cors' });
    //       if (!response.ok) {
    //         throw new Error(`Failed to fetch the file: ${response.statusText}`);
    //       }
    
    //       const blob = await response.blob();
    //       const blobUrl = window.URL.createObjectURL(blob);
    
    //       const anchor = document.createElement("a");
    //       anchor.href = blobUrl;
    //       anchor.download = `image-${index + 1}.png`;
    //       document.body.appendChild(anchor);
    //       anchor.click();
    //       document.body.removeChild(anchor);
    
    //       // Clean up
    //       window.URL.revokeObjectURL(blobUrl);
    //     } catch (error) {
    //       console.error("Download failed:", error);
    //     }
    //   };
    const handleDelete = (index: number) => {
        setImageUrl((prevUrls) => prevUrls.filter((_, i) => i !== index));
    };
    return (
        <div className='flex h-full w-full bg-white rounded-lg shadow-md'>
            {/* Left Side - Input Form */}
            <div className='flex-[2] flex flex-col p-6 bg-gray-100 rounded-l-lg shadow'>
                <div className='p-4 bg-green-600 text-white rounded-lg shadow mb-4'>
                    <h3 className='text-xl font-bold'>Create some Images</h3>
                </div>

                <form onSubmit={handleSubmit} className='flex flex-col'>
                    <textarea
                        value={prompt}
                        onChange={handleTextChange}
                        className='pt-5 p-3 border-t-2 border-gray-300 border-b border-l border-r rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black mb-4'
                        placeholder='Enter prompt...'
                        rows={5}
                        style={{ resize: 'vertical' }}
                    />
                    <button
                        type='submit'
                        className={`p-3 rounded-md transition duration-300 shadow-md ${
                            (loading || !prompt.trim())
                                ? 'bg-gray-400 text-white cursor-not-allowed'
                                : 'bg-green-500 text-white hover:bg-blue-600'
                        }`}
                        disabled={loading || !prompt.trim()}
                    >
                        {loading ? "Generating..." : "Generate Image"}
                        
                    </button>
                </form>
                {error && <p className='text-red-500 mt-4'>{error}</p>}
            </div>

            {/* Right Side - Image Viewer */}
            <div className='flex-[3] bg-gray-200 border-l border-gray-300 p-4 rounded-r-lg overflow-y-auto'>
                {imageUrls.length > 0 ? (
                    imageUrls.map((url, index) => (
                        <div key={index} className='relative mb-4'>
                            <DownloadImage 
                                image_url={url} 
                                onDownload={() => handleDownload(url, index)} 
                                onDelete={() => handleDelete(index)}/>
                        </div>
                    ))
                ) : (
                    <div className="h-full flex items-center justify-center text-gray-500">
                        <p>No images generated yet.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ChatGenerateImg;
