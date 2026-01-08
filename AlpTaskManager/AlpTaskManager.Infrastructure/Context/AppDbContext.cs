using AlpTaskManager.Core.Entities;
using Microsoft.EntityFrameworkCore;

namespace AlpTaskManager.Infrastructure.Context;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
    {
    }

    public DbSet<TaskItem> Tasks { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<TaskItem>().HasQueryFilter(x => !x.IsDeleted);

        
        modelBuilder.Entity<TaskItem>()
            .HasIndex(t => t.CreatedAt);
            
        modelBuilder.Entity<TaskItem>()
            .HasIndex(t => t.IsDeleted);

        base.OnModelCreating(modelBuilder);
    }
}