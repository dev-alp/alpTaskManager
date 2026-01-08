import { type TaskItem, TaskStatus } from '../types/task';
import { CheckCircle, Circle, Clock, Trash2, Pencil } from 'lucide-react';

interface Props {
    task: TaskItem;
    onStatusChange: (id: number, newStatus: string) => void;
    onEdit: (task: TaskItem) => void;
    onDelete: (id: number) => void;
}

export default function TaskCard({ task, onStatusChange, onEdit, onDelete }: Props) {

    const getStatusColor = (status: TaskStatus) => {
        switch (status) {
            case TaskStatus.Done: return 'bg-green-100 text-green-700 border-green-200';
            case TaskStatus.InProgress: return 'bg-blue-100 text-blue-700 border-blue-200';
            default: return 'bg-gray-100 text-gray-700 border-gray-200';
        }
    };

    return (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200 flex flex-col">

            <div className="flex justify-between items-start mb-4 gap-2">
                <div className="relative">
                    <select
                        value={task.status}
                        onChange={(e) => onStatusChange(task.id, e.target.value)}
                        className={`appearance-none cursor-pointer pl-2 pr-8 py-1 rounded-full text-xs font-semibold border focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors ${getStatusColor(task.status)}`}
                    >
                        <option value={TaskStatus.Todo}>Yapılacak</option>
                        <option value={TaskStatus.InProgress}>Sürüyor</option>
                        <option value={TaskStatus.Done}>Tamamlandı</option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
                        <svg className="fill-current h-3 w-3" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" /></svg>
                    </div>
                </div>
                <span className="text-xs text-gray-400 whitespace-nowrap">
                    {new Date(task.createdAt).toLocaleDateString('tr-TR')}
                </span>
            </div>

            <h3 className="text-lg font-semibold text-gray-800 mb-2 leading-tight">{task.title}</h3>
            <p className="text-gray-600 text-sm line-clamp-3 mb-4 min-h-[3rem]">{task.description}</p>

            <div className="flex items-center justify-between border-t pt-3 mt-auto">
                <div className="text-gray-300">
                    {task.status === TaskStatus.Done ? <CheckCircle size={18} className="text-green-500" /> :
                        task.status === TaskStatus.InProgress ? <Clock size={18} className="text-blue-500" /> :
                            <Circle size={18} />}
                </div>
                <div className="flex gap-1">
                    {/* DÜZENLEME BUTONU */}
                    <button
                        onClick={() => onEdit(task)}
                        className="text-gray-400 hover:text-indigo-500 hover:bg-indigo-50 p-1.5 rounded-full transition-colors"
                        title="Düzenle"
                    >
                        <Pencil size={16} />
                    </button>

                    <button
                        onClick={() => onDelete(task.id)}
                        className="text-gray-400 hover:text-red-500 hover:bg-red-50 p-1.5 rounded-full transition-colors"
                        title="Görevi Sil"
                    >
                        <Trash2 size={16} />
                    </button>
                </div>
            </div>
        </div>
    );
}