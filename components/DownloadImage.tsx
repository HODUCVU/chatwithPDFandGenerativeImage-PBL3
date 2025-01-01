import React from 'react';
import { HiMiniArrowDownTray, HiTrash } from "react-icons/hi2";

type Props ={
    image_url: string;
    onDownload: () => void;
    onDelete: () => void;
}

const DownloadImage = ({ image_url, onDownload, onDelete }: Props) => {
    return (
        <div className='relative mt-4'>
            <img src={image_url} alt='Generated' className='max-w-full h-auto rounded-md shadow-md' />
            <button
                onClick={onDownload}
                className='absolute top-2 right-2 p-2 bg-gray-800 text-white rounded-full'
                title='Download Image'
            >
                <HiMiniArrowDownTray className="w-6 h-6" />
            </button>
            {/* Nút Delete */}
            <button
                onClick={onDelete}
                className='absolute top-12 right-2 p-2 bg-red-600 text-white rounded-full'
                title='Delete Image'
            >
                <HiTrash className="w-6 h-6" />
            </button>
        </div>
    );
};
export default DownloadImage;