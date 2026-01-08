using AlpTaskManager.Application.DTOs;
using FluentValidation;

namespace AlpTaskManager.Application.Validators;

public class UpdateTaskValidator : AbstractValidator<UpdateTaskDto>
{
    public UpdateTaskValidator()
    {
        RuleFor(x => x.Id)
            .GreaterThan(0).WithMessage("Geçersiz ID.");

        RuleFor(x => x.Title)
            .NotEmpty().WithMessage("Başlık boş olamaz.")
            .MaximumLength(100).WithMessage("Başlık 100 karakterden uzun olamaz.");

        RuleFor(x => x.Description)
            .MaximumLength(500).WithMessage("Açıklama 500 karakterden uzun olamaz.");
    }
}