namespace AlpTaskManager.Core.Wrappers;

public class PagedResponse<T>
{
    public IEnumerable<T> Items { get; set; }
    public int TotalCount { get; set; }

    public PagedResponse(IEnumerable<T> items, int totalCount)
    {
        Items = items;
        TotalCount = totalCount;
    }
}