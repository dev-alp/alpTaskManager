using AlpTaskManager.Application.DTOs;
using AlpTaskManager.Application.Services;
using AlpTaskManager.Core.Entities;
using AlpTaskManager.Core.Interfaces;
using AutoMapper;
using FluentAssertions;
using Moq;
using Xunit;

namespace AlpTaskManager.Tests;

public class TaskServiceTests
{
    private readonly Mock<ITaskRepository> _mockRepo;
    private readonly Mock<IMapper> _mockMapper;
    private readonly TaskService _taskService;

    public TaskServiceTests()
    {
        _mockRepo = new Mock<ITaskRepository>();
        _mockMapper = new Mock<IMapper>();
        
        _taskService = new TaskService(_mockRepo.Object, _mockMapper.Object);
    }

    [Fact]
    public async Task CreateTaskAsync_Should_Call_Repository_And_Return_Dto()
    {
        var createDto = new CreateTaskDto { Title = "Test Task", Description = "Test Desc" };
        var taskEntity = new TaskItem { Id = 1, Title = "Test Task" };
        var taskDto = new TaskDto { Id = 1, Title = "Test Task" };

        _mockMapper.Setup(m => m.Map<TaskItem>(createDto)).Returns(taskEntity);
        _mockMapper.Setup(m => m.Map<TaskDto>(taskEntity)).Returns(taskDto);

        var result = await _taskService.CreateTaskAsync(createDto);

        result.Should().NotBeNull();
        result.Title.Should().Be("Test Task");
        
        _mockRepo.Verify(r => r.AddAsync(It.IsAny<TaskItem>()), Times.Once);
    }
}