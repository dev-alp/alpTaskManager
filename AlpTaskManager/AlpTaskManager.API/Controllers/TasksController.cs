using AlpTaskManager.Application.DTOs;
using AlpTaskManager.Application.Interfaces;
using AlpTaskManager.Core.Wrappers;
using Microsoft.AspNetCore.Mvc;

namespace AlpTaskManager.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class TasksController : ControllerBase
{
    private readonly ITaskService _taskService;
    private readonly ILogger<TasksController> _logger; 

    public TasksController(ITaskService taskService, ILogger<TasksController> logger)
    {
        _taskService = taskService;
        _logger = logger;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll([FromQuery] int page = 1, [FromQuery] int pageSize = 10)
    {
        _logger.LogInformation("Görev listesi isteniyor. Sayfa: {Page}, Boyut: {PageSize}", page, pageSize);
        
        var result = await _taskService.GetPagedTasksAsync(page, pageSize);
        
        return Ok(new PagedResponse<TaskDto>(result.Tasks, result.TotalCount));
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateTaskDto createDto)
    {
        _logger.LogInformation("Yeni görev oluşturuluyor: {Title}", createDto.Title);
        
        var result = await _taskService.CreateTaskAsync(createDto);
        return StatusCode(201, result);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, [FromBody] UpdateTaskDto updateDto)
    {
        if (id != updateDto.Id)
        {
            _logger.LogWarning("Güncellemede ID uyuşmazlığı. URL: {UrlId}, Body: {BodyId}", id, updateDto.Id);
            return BadRequest("ID uyuşmazlığı.");
        }

        await _taskService.UpdateTaskAsync(updateDto);
        
        _logger.LogInformation("Görev güncellendi. ID: {Id}", id);
        return NoContent();
    }

    [HttpPut("{id}/status")]
    public async Task<IActionResult> UpdateStatus(int id, [FromBody] UpdateTaskStatusDto updateDto)
    {
        if (id != updateDto.Id)
        {
            _logger.LogWarning("Statü güncellemede ID uyuşmazlığı. URL ID: {UrlId}, Body ID: {BodyId}", id, updateDto.Id);
            return BadRequest("ID uyuşmazlığı.");
        }

        await _taskService.UpdateTaskStatusAsync(updateDto);
        
        _logger.LogInformation("Görev durumu güncellendi. ID: {Id}, Yeni Durum: {Status}", id, updateDto.Status);
        return NoContent(); 
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        await _taskService.DeleteTaskAsync(id);
        
        _logger.LogInformation("Görev silindi (Soft Delete). ID: {Id}", id);
        return NoContent(); 
    }
}