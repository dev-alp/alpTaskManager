using AlpTaskManager.Core.Common; 
using AlpTaskManager.Core.Entities;
using AlpTaskManager.Core.Interfaces;
using AlpTaskManager.Infrastructure.Context;
using Microsoft.EntityFrameworkCore;

namespace AlpTaskManager.Infrastructure.Repositories;

public class TaskRepository : GenericRepository<TaskItem>, ITaskRepository
{
    private readonly AppDbContext _context;

    public TaskRepository(AppDbContext context) : base(context)
    {
        _context = context;
    }
    
    public override async Task<PagedResponse<TaskItem>> GetPagedAsync(int page, int pageSize)
    {
        var query = _context.Set<TaskItem>()
            .Where(x => !x.IsDeleted) 
            .OrderByDescending(x => x.CreatedAt);

        var totalCount = await query.CountAsync();
        
        var items = await query
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();

        return new PagedResponse<TaskItem>
        {
            Items = items,
            TotalCount = totalCount
        };
    }
}