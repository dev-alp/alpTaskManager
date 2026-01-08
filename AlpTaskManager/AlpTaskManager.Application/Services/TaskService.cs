using AlpTaskManager.Application.DTOs;
using AlpTaskManager.Application.Interfaces;
using AlpTaskManager.Core.Entities;
using AlpTaskManager.Core.Interfaces;
using AutoMapper;

namespace AlpTaskManager.Application.Services;

public class TaskService : ITaskService
{
    private readonly ITaskRepository _taskRepository;
    private readonly IMapper _mapper;

    public TaskService(ITaskRepository taskRepository, IMapper mapper)
    {
        _taskRepository = taskRepository;
        _mapper = mapper;
    }

    public async Task<IEnumerable<TaskDto>> GetAllTasksAsync()
    {
        var tasks = await _taskRepository.GetAllAsync();
        return _mapper.Map<IEnumerable<TaskDto>>(tasks);
    }
    
    public async Task<(IEnumerable<TaskDto> Tasks, int TotalCount)> GetPagedTasksAsync(int page, int pageSize)
    {
        var result = await _taskRepository.GetPagedAsync(page, pageSize);
        var dtos = _mapper.Map<IEnumerable<TaskDto>>(result.Items);
        return (dtos, result.TotalCount);
    }

    public async Task<TaskDto> CreateTaskAsync(CreateTaskDto createDto)
    {
        var task = _mapper.Map<TaskItem>(createDto);
        
        await _taskRepository.AddAsync(task);
        await _taskRepository.SaveChangesAsync();

        return _mapper.Map<TaskDto>(task);
    }

    public async Task UpdateTaskAsync(UpdateTaskDto updateDto)
    {
        var task = await _taskRepository.GetByIdAsync(updateDto.Id);
        if (task == null)
        {
            throw new KeyNotFoundException("Task not found");
        }

        task.Title = updateDto.Title;
        task.Description = updateDto.Description;

        _taskRepository.Update(task);
        await _taskRepository.SaveChangesAsync();
    }

    public async Task UpdateTaskStatusAsync(UpdateTaskStatusDto updateDto)
    {
        var task = await _taskRepository.GetByIdAsync(updateDto.Id);
        if (task == null)
        {
            throw new KeyNotFoundException("Task not found");
        }

        task.Status = updateDto.Status;
        _taskRepository.Update(task);
        await _taskRepository.SaveChangesAsync();
    }

    public async Task DeleteTaskAsync(int id)
    {
        var task = await _taskRepository.GetByIdAsync(id);
        if (task == null)
        {
            throw new KeyNotFoundException("Task not found");
        }

        task.IsDeleted = true;
        
        _taskRepository.Update(task);
        await _taskRepository.SaveChangesAsync();
    }
}