import React from 'react';
import AddNewInterview from './_components/AddNewInterview';

const dashboard = () => {
    return (
        <div className='nunito_sans'>
            <div className='p-10'>

                <h2 className='font-bold text-2xl'>
                    Dashboard
                </h2>
                <h2>
                    Create and start your AI Mockup Interview
                </h2>
                <div className='grid grid-cols-1 md:grid-cols-3 my-5'>
                    <AddNewInterview />
                </div>
            </div>
        </div>
    )
}

export default dashboard