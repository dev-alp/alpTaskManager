using AlpTaskManager.Core.Enums;

namespace AlpTaskManager.Application.DTOs;

public class TaskDto
{
    public int Id { get; set; }
    public string Title { get; set; }
    public string Description { get; set; }
    public TodoStatus Status { get; set; }
    public DateTime CreatedAt { get; set; }
}