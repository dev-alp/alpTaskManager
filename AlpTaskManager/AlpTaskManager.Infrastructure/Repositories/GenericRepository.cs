using System.Linq.Expressions;
using AlpTaskManager.Core.Common;
using AlpTaskManager.Core.Interfaces;
using AlpTaskManager.Infrastructure.Context;
using Microsoft.EntityFrameworkCore;

namespace AlpTaskManager.Infrastructure.Repositories;

public class GenericRepository<T> : IGenericRepository<T> where T : BaseEntity
{
    protected readonly AppDbContext _context;
    private readonly DbSet<T> _dbSet;

    public GenericRepository(AppDbContext context)
    {
        _context = context;
        _dbSet = _context.Set<T>();
    }

    public async Task<T?> GetByIdAsync(int id) => await _dbSet.FindAsync(id);

    public async Task<IEnumerable<T>> GetAllAsync() => await _dbSet.ToListAsync();
    
    public virtual async Task<PagedResponse<T>> GetPagedAsync(int pageNumber, int pageSize)
    {
        var query = _dbSet.AsQueryable(); 

        var totalCount = await query.CountAsync();

        var items = await query
            .OrderByDescending(x => x.CreatedAt)
            .Skip((pageNumber - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();

        return new PagedResponse<T>
        {
            Items = items,
            TotalCount = totalCount
        };
    }

    public async Task<IEnumerable<T>> FindAsync(Expression<Func<T, bool>> predicate) 
        => await _dbSet.Where(predicate).ToListAsync();

    public async Task AddAsync(T entity) => await _dbSet.AddAsync(entity);

    public void Update(T entity) => _dbSet.Update(entity);

    public void Delete(T entity)
    {
        entity.IsDeleted = true;
        Update(entity); 
    }

    public async Task SaveChangesAsync() => await _context.SaveChangesAsync();
}