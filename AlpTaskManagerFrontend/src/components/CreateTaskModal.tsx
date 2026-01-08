import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import toast from 'react-hot-toast';
import TaskService from '../api/agent';
import { type CreateTaskRequest, type TaskItem } from '../types/task';

interface Props {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    taskToEdit?: TaskItem | null;
}

export default function CreateTaskModal({ isOpen, onClose, onSuccess, taskToEdit }: Props) {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (isOpen) {
            if (taskToEdit) {
                setTitle(taskToEdit.title);
                setDescription(taskToEdit.description || '');
            } else {
                setTitle('');
                setDescription('');
            }
        }
    }, [isOpen, taskToEdit]);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!title.trim()) {
            toast.error('Lütfen bir başlık girin');
            return;
        }

        try {
            setIsSubmitting(true);

            if (taskToEdit) {
                await TaskService.update(taskToEdit.id, {
                    id: taskToEdit.id,
                    title,
                    description
                });
                toast.success('Görev güncellendi! 📝');
            } else {
                const newTask: CreateTaskRequest = {
                    title,
                    description,
                    dueDate: new Date().toISOString()
                };
                await TaskService.create(newTask);
                toast.success('Görev başarıyla oluşturuldu! 🎉');
            }

            onSuccess();
            onClose();

        } catch (error: any) {
            console.error(error);
            if (error.response && error.response.status === 400) {
                const validationErrors = error.response.data.errors;
                if (validationErrors) {
                    Object.values(validationErrors).forEach((errArray: any) => {
                        toast.error(errArray[0]);
                    });
                } else {
                    toast.error(error.response.data.title || 'Geçersiz veri girişi.');
                }
            } else {
                toast.error('İşlem sırasında bir hata oluştu.');
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-md mx-4 overflow-hidden animate-in fade-in zoom-in duration-200">
                <div className="flex justify-between items-center p-4 border-b border-gray-100">
                    <h2 className="text-lg font-semibold text-gray-800">
                        {taskToEdit ? 'Görevi Düzenle' : 'Yeni Görev Ekle'}
                    </h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-4 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Başlık</label>
                        <input
                            type="text"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            placeholder="Örn: Raporu hazırla"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            disabled={isSubmitting}
                            autoFocus
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Açıklama</label>
                        <textarea
                            rows={3}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            placeholder="Detayları buraya yazın..."
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            disabled={isSubmitting}
                        />
                    </div>

                    <div className="flex justify-end gap-2 pt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                            disabled={isSubmitting}
                        >
                            İptal
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 disabled:bg-indigo-300 flex items-center gap-2"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? 'Kaydediliyor...' : (taskToEdit ? 'Güncelle' : 'Kaydet')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}