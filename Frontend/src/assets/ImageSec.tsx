import image from '../assets/image.png'

function ImageSec() {
    return (
        <>
            <div className='flex flex-col lg:flex-row p-4 sm:p-6 md:p-8 gap-4 sm:gap-5 md:gap-6 w-full max-w-screen-2xl mx-auto h-screen'>
                <div className='flex flex-col justify-between rounded-lg border-2 border-black p-4 sm:p-6 text-black w-full lg:w-2/3 bg-white shadow-lg'>
                    <div className='flex flex-row justify-between items-center mb-4'>
                        <h1 className='text-2xl sm:text-3xl md:text-4xl font-bold'>Product Name</h1>
                        <p className='px-3 py-2 bg-orange-300 rounded-md text-sm sm:text-base font-medium whitespace-nowrap'>Variant Storage</p>
                    </div>
                    <div className='mb-4 flex items-center justify-center rounded-lg p-4 overflow-hidden'>
                        <img
                            src={image}
                            alt="Product Image"
                            className='w-full max-w-2xl h-[400px] sm:h-[450px] md:h-[500px] object-contain hover:scale-105 transition-transform duration-300'
                        />
                    </div>
                    <div className='text-base sm:text-lg font-medium text-center'>
                        <p>Color Variant</p>
                    </div>
                </div>
                <div className='flex flex-col p-4 sm:p-6 text-black w-full lg:w-1/3'>
                    <div className='flex flex-col'>
                        <div className='mb-2'>
                            <div className='mb-2'>
                                <p className='text-xl sm:text-2xl font-bold'>Price MRP</p>
                            </div>
                            <div>
                                <p className='text-sm sm:text-xs text-gray-700'>EMI Plans based by Mutual Funds</p>
                            </div>
                        </div>
                    </div>
                    <div className='flex flex-col gap-2' >
                            <div className='px-3 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors cursor-pointer bg-white'>
                                <div className='flex flex-row justify-between items-center'>
                                <p>✕ 3 Months</p>
                                <p>0% interest</p>
                                </div>

                                <p className='text-sm sm:text-xs text-green-600'>Additional Cashback of 7,500/-</p>
                            </div>
                            <div className='px-3 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors cursor-pointer bg-white'>
                            <div className='flex flex-row justify-between items-center'>
                                <p>✕ 6 Months</p>
                                <p>0% interest</p>
                                </div>
                                <p className='text-sm sm:text-xs text-green-600'>Additional Cashback of 7,500/-</p>
                            </div>
                            <div className='px-3 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors cursor-pointer bg-white'>
                            <div className='flex flex-row justify-between items-center'>
                                <p>✕ 12 Months</p>
                                <p>0% interest</p>
                                </div>
                                <p className='text-sm sm:text-xs text-green-600'>Additional Cashback of 7,500/-</p>
                            </div>
                            <div className='px-3 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors cursor-pointer bg-white'>
                            <div className='flex flex-row justify-between items-center'>
                                <p>✕ 24 Months</p>
                                <p>0% interest</p>
                                </div>
                                <p className='text-sm sm:text-xs text-green-600'>Additional Cashback of 7,500/-</p>
                            </div>
                            <div className='px-3 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors cursor-pointer bg-white'>
                            <div className='flex flex-row justify-between items-center'>
                                <p>✕ 36 Months</p>
                                <p>10.5% interest</p>
                                </div>
                                <p className='text-sm sm:text-xs text-green-600'>Additional Cashback of 7,500/-</p>
                            </div>
                            <div className='px-3 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors cursor-pointer bg-white'>
                            <div className='flex flex-row justify-between items-center'>
                                <p>✕ 48 Months</p>
                                <p>10.5% interest</p>
                                </div>
                                <p className='text-sm sm:text-xs text-green-600'>Additional Cashback of 7,500/-</p>
                            </div>
                            <div className='px-3 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors cursor-pointer bg-white'>
                            <div className='flex flex-row justify-between items-center'>
                                <p>✕ 60 Months</p>
                                <p>10.5% interest</p>
                                </div>
                                <p className='text-sm sm:text-xs text-green-600'>Additional Cashback of 7,500/-</p>
                            </div>
                    </div>
                    <div className='flex flex-row-reverse justify-between items-center mt-4'>
                        <button className='px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors cursor-pointer'>Add to Cart</button>
                    </div>
                </div>
            </div>
        </>
    )
}

export default ImageSec