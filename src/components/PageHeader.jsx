import React from 'react';
import logo from '../../public/commission.svg'; // Adjust the path based on your file structure

const PageHeader = () => {
    return (
        <header className="bg-white shadow-sm">
            <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex justify-between items-center">
                {/* Logo */}
                <div className="flex items-center">
                    <img src={logo} alt="Logo" className="h-8 w-auto mr-3" />
                    <span className="text-xl font-bold">Creative Commission Platform</span>
                </div>
                <button className="px-4 py-2 bg-gray-200 rounded-md">My Profile</button>
            </div>
        </header>
    );
}

export default PageHeader;
