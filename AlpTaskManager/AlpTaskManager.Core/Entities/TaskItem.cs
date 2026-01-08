using AlpTaskManager.Core.Common;
using AlpTaskManager.Core.Enums;

namespace AlpTaskManager.Core.Entities;

public class TaskItem : BaseEntity 
{
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public TodoStatus Status { get; set; } = TodoStatus.Todo;
    public bool IsDeleted { get; set; } = false;
}