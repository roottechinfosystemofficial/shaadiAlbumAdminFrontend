const ErrorModal = ({ isOpen, message = "Something went wrong!", onClose }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-40 backdrop-blur-sm flex items-center justify-center">
            <div
                style={{ width: 360 }}
                className="bg-white/90 border border-red-300 shadow-2xl rounded-2xl px-8 py-6 flex flex-col items-center gap-4 animate-fadeIn relative"
            >
                {/* Error Icon */}
                <div className="text-red-500">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3m0 4h.01M2.458 12C3.732 7.943 7.523 5 12 5s8.268 2.943 9.542 7a9.958 9.958 0 01-9.542 7c-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                </div>

                
                {/* Error Message */}
                <p className="text-center text-red-700 text-lg font-medium">{message}</p>

                {/* Close Button */}
                {onClose && (
                    <button
                        onClick={onClose}
                        className="mt-2  px-4 py-1 bg-red-500 hover:bg-red-600 text-white rounded shadow-sm text-sm"
                    >
                        Close
                    </button>
                )}
            </div>
        </div>
    );
};

export default ErrorModal;