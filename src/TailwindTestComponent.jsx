import React from 'react';

const TailwindTestComponent = () => {
    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="bg-white p-6 rounded-lg shadow-lg">
                <h1 className="text-3xl font-bold text-gray-800 mb-4">
                    Tailwind CSS is working!
                </h1>
                <p className="text-gray-600">
                    This is a simple component styled with Tailwind CSS.
                </p>
            </div>
        </div>
    );
};

export default ExampleComponent;


// flex: Applies Flexbox layout.
// items-center: Vertically centers the content in the flex container.
// justify-center: Horizontally centers the content in the flex container.
// min-h-screen: Sets the minimum height to the full screen.
// bg-gray-100: Applies a light gray background to the page.
// bg-white: Applies a white background to the content box.
// p-6: Adds padding of 1.5rem (24px).
// rounded-lg: Rounds the corners of the content box.
// shadow-lg: Adds a large shadow to the box.
// text-3xl: Sets the font size of the title to 3xl.
// font-bold: Makes the title bold.
// text-gray-800: Sets the title's text color to dark gray.
// mb-4: Adds margin bottom to the title.
// text-gray-600: Sets the paragraph's text color to a lighter gray.