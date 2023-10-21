import React from 'react'

const Notification = ({error}) => {
    return (
        <div className="absolute top-0 right-0 bg-red-500 text-white p-4 mr-4 mt-4 rounded-lg">
            {error}
        </div>
    )
}

export default Notification