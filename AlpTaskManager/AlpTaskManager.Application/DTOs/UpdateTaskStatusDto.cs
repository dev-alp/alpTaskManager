using AlpTaskManager.Core.Enums;

namespace AlpTaskManager.Application.DTOs;

public class UpdateTaskStatusDto
{
    public int Id { get; set; }
    public TodoStatus Status { get; set; }
}