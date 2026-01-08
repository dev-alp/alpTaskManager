using AlpTaskManager.Application.DTOs;

namespace AlpTaskManager.Application.Interfaces;

public interface ITaskService
{
    Task<IEnumerable<TaskDto>> GetAllTasksAsync();
    
    Task<(IEnumerable<TaskDto> Tasks, int TotalCount)> GetPagedTasksAsync(int page, int pageSize);
    
    Task<TaskDto> CreateTaskAsync(CreateTaskDto createDto);
    Task UpdateTaskStatusAsync(UpdateTaskStatusDto updateDto);
    Task DeleteTaskAsync(int id);
    Task UpdateTaskAsync(UpdateTaskDto updateDto);
}