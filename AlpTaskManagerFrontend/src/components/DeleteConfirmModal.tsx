import { AlertTriangle, X } from 'lucide-react';

interface Props {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title?: string;
    message?: string;
}

export default function DeleteConfirmModal({
    isOpen,
    onClose,
    onConfirm,
    title = "Görevi Sil",
    message = "Bu görevi silmek istediğinize emin misiniz? Bu işlem geri alınamaz."
}: Props) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-in fade-in duration-200">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-sm mx-4 overflow-hidden transform transition-all scale-100">

                <div className="flex justify-between items-center p-4 border-b border-gray-100 bg-red-50">
                    <div className="flex items-center gap-2 text-red-600">
                        <AlertTriangle size={20} />
                        <h2 className="text-lg font-semibold">{title}</h2>
                    </div>
                    <button onClick={onClose} className="text-red-400 hover:text-red-600">
                        <X size={20} />
                    </button>
                </div>

                <div className="p-6">
                    <p className="text-gray-600">{message}</p>
                </div>

                <div className="flex justify-end gap-3 p-4 bg-gray-50 border-t border-gray-100">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 font-medium transition-colors"
                    >
                        Vazgeç
                    </button>
                    <button
                        onClick={() => {
                            onConfirm();
                            onClose();
                        }}
                        className="px-4 py-2 text-white bg-red-600 rounded-lg hover:bg-red-700 font-medium shadow-sm transition-colors"
                    >
                        Evet, Sil
                    </button>
                </div>
            </div>
        </div>
    );
}