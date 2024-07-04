import React from 'react';
import AddNewInterview from './_components/AddNewInterview';
import InterviewList from './_components/InterviewList';

const dashboard = () => {
    return (
        <div className='nunito_sans'>
            <div className='p-10'>
                <h2 className='font-bold text-2xl text-indigo-500' >
                    DashBoard
                </h2>
                <h2 className='text-gray-500' >Create Your own AI powered Interview with IntelliSense</h2>

                <div className='grid grid-cols-1 md:grid-cols-3'>
                    <AddNewInterview />
                </div>
                <InterviewList />
            </div>
        </div>
    )
}

export default dashboard