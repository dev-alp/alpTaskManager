using AlpTaskManager.Application.DTOs;
using AlpTaskManager.Core.Entities;
using AutoMapper;

namespace AlpTaskManager.Application.Mappings;

public class MappingProfile : Profile
{
    public MappingProfile()
    {
        CreateMap<TaskItem, TaskDto>();
        
        CreateMap<CreateTaskDto, TaskItem>();
    }
}