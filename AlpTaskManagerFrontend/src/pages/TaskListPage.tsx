import { useEffect, useState, useCallback, useMemo } from 'react';
import TaskService from '../api/agent';
import { type TaskItem, TaskStatus } from '../types/task';
import { Plus, AlertCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import toast from 'react-hot-toast';

import CreateTaskModal from '../components/CreateTaskModal';
import DeleteConfirmModal from '../components/DeleteConfirmModal';
import TaskCard from '../components/TaskCard';

const PAGE_SIZE = 9;

export default function TaskListPage() {
    const [tasks, setTasks] = useState<TaskItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedTaskId, setSelectedTaskId] = useState<number | null>(null);
    const [editingTask, setEditingTask] = useState<TaskItem | null>(null);

    const [currentPage, setCurrentPage] = useState(1);
    const [totalCount, setTotalCount] = useState(0);

    const loadTasks = useCallback(async () => {
        try {
            setLoading(true);
            const data = await TaskService.list(currentPage, PAGE_SIZE);
            setTasks(data.items);
            setTotalCount(data.totalCount);
            setError(null);
        } catch (err) {
            console.error(err);
            setError('Görevler yüklenirken bir sorun oluştu.');
            toast.error('Veriler yüklenemedi!');
        } finally {
            setLoading(false);
        }
    }, [currentPage]);

    const handleStatusChange = useCallback(async (id: number, newStatusStr: string) => {
        try {
            const newStatus = parseInt(newStatusStr) as TaskStatus;
            setTasks(prevTasks => prevTasks.map(task =>
                task.id === id ? { ...task, status: newStatus } : task
            ));
            await TaskService.updateStatus(id, newStatus);
            toast.success('Durum güncellendi');
        } catch (error) {
            console.error(error);
            toast.error("Durum güncellenemedi!");
            loadTasks();
        }
    }, [loadTasks]);

    const handleEditClick = useCallback((task: TaskItem) => {
        setEditingTask(task);
        setIsCreateModalOpen(true);
    }, []);

    const handleModalClose = useCallback(() => {
        setIsCreateModalOpen(false);
        setEditingTask(null);
    }, []);

    const handleDeleteClick = useCallback((id: number) => {
        setSelectedTaskId(id);
        setIsDeleteModalOpen(true);
    }, []);

    const confirmDelete = useCallback(async () => {
        if (selectedTaskId === null) return;
        try {
            setTasks(prev => prev.filter(t => t.id !== selectedTaskId));
            await TaskService.delete(selectedTaskId);
            toast.success('Görev silme işlemi başarılı.');
            if (tasks.length === 1 && currentPage > 1) {
                setCurrentPage(p => p - 1);
            } else {
                loadTasks();
            }
        } catch (error) {
            console.error(error);
            toast.error("Görev silme işlemi başarısız.");
            loadTasks();
        }
    }, [selectedTaskId, tasks.length, currentPage, loadTasks]);

    const totalPages = useMemo(() => {
        const pages = Math.ceil(totalCount / PAGE_SIZE);
        return pages > 0 ? pages : 1;
    }, [totalCount]);

    useEffect(() => {
        loadTasks();
    }, [loadTasks]);

    const goToNextPage = () => { if (currentPage < totalPages) setCurrentPage(p => p + 1); };
    const goToPrevPage = () => { if (currentPage > 1) setCurrentPage(p => p - 1); };

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-5xl mx-auto flex flex-col min-h-[85vh]">

                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Görev Yöneticisi</h1>
                        <p className="text-gray-500 mt-1">Toplam {totalCount} görev</p>
                    </div>
                    <button
                        className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium transition-colors shadow-sm"
                        onClick={() => setIsCreateModalOpen(true)}
                    >
                        <Plus size={20} />
                        Yeni Görev
                    </button>
                </div>

                {loading && <div className="text-center py-20 text-gray-500">Yükleniyor...</div>}

                {error && !loading && (
                    <div className="bg-red-50 text-red-600 p-4 rounded-lg flex items-center gap-2 mb-6 border border-red-100">
                        <AlertCircle size={20} /> {error}
                    </div>
                )}

                {!loading && !error && tasks.length === 0 && (
                    <div className="text-center py-20 bg-white rounded-xl shadow-sm border border-gray-100">
                        <p className="text-gray-500">Bu sayfada hiç görev yok.</p>
                        {currentPage > 1 && (
                            <button onClick={() => setCurrentPage(1)} className="text-indigo-600 font-medium mt-2 hover:underline">
                                İlk sayfaya dön
                            </button>
                        )}
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                    {tasks.map((task) => (
                        <TaskCard
                            key={task.id}
                            task={task}
                            onStatusChange={handleStatusChange}
                            onEdit={handleEditClick}
                            onDelete={handleDeleteClick}
                        />
                    ))}
                </div>

                {(totalCount > 0 || currentPage > 1) && (
                    <div className="mt-auto flex justify-center items-center gap-6 pt-4 border-t border-gray-200">
                        <button
                            onClick={goToPrevPage}
                            disabled={currentPage === 1}
                            className="flex items-center gap-1 px-4 py-2 rounded-lg text-sm font-medium text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            <ChevronLeft size={16} /> Önceki
                        </button>

                        <span className="text-sm font-medium text-gray-600">
                            Sayfa <span className="text-indigo-600 font-bold">{currentPage}</span> / {totalPages}
                        </span>

                        <button
                            onClick={goToNextPage}
                            disabled={currentPage === totalPages}
                            className="flex items-center gap-1 px-4 py-2 rounded-lg text-sm font-medium text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            Sonraki <ChevronRight size={16} />
                        </button>
                    </div>
                )}
            </div>

            <CreateTaskModal
                isOpen={isCreateModalOpen}
                onClose={handleModalClose}
                onSuccess={loadTasks}
                taskToEdit={editingTask}
            />

            <DeleteConfirmModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={confirmDelete}
            />
        </div>
    );
}