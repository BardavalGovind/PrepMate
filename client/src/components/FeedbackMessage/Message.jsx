import { useEffect } from 'react';
import { LuCheck } from "react-icons/lu";
import { MdDeleteOutline } from "react-icons/md";

const Message = ({ isShown, message, type, onClose }) => {

    useEffect(() => {
        if (isShown) {
            const timeoutId = setTimeout(() => {
                onClose();
            }, 3000);

            return () => {
                clearTimeout(timeoutId);
            };
        }
    }, [isShown, onClose]);

    return (
        <div className={`fixed top-10 left-1/2 -translate-x-1/2 z-50 transition-all duration-400 ${
            isShown ? "opacity-100 scale-100" : "opacity-0 scale-90"
        }`}>
            <div
                className={`w-80 max-w-md bg-white border shadow-2xl rounded-md relative after:w-[5px] after:h-full ${
                    type === "delete" ? "after:bg-red-500" : "after:bg-green-500"
                } after:absolute after:left-0 after:top-0 after:rounded-l-lg`}
            >
                <div className='flex items-center gap-3 py-3 px-6'>
                    <div
                        className={`w-10 h-10 flex items-center justify-center rounded-full ${
                            type === "delete" ? "bg-red-50" : "bg-green-50"
                        }`}
                    >
                        {type === 'delete' ? (
                            <MdDeleteOutline className="text-xl text-red-500" />
                        ) : (
                            <LuCheck className='text-xl text-green-500' />
                        )}
                    </div>
                    <p className='text-sm text-slate-800 break-words'>{message}</p>
                </div>
            </div>
        </div>
    );
};

export default Message;