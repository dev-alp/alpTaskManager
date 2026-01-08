using System.Linq.Expressions;
using AlpTaskManager.Core.Common; 

namespace AlpTaskManager.Core.Interfaces;

public interface IGenericRepository<T> where T : BaseEntity
{
    Task<T?> GetByIdAsync(int id);
    Task<IEnumerable<T>> GetAllAsync();
    
    Task<PagedResponse<T>> GetPagedAsync(int page, int pageSize);

    Task<IEnumerable<T>> FindAsync(Expression<Func<T, bool>> predicate); 
    Task AddAsync(T entity);
    void Update(T entity);
    
    void Delete(T entity); 
    
    Task SaveChangesAsync();
}