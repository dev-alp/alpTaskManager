FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src

COPY ["AlpTaskManager.API/AlpTaskManager.API.csproj", "AlpTaskManager.API/"]
COPY ["AlpTaskManager.Core/AlpTaskManager.Core.csproj", "AlpTaskManager.Core/"]
COPY ["AlpTaskManager.Infrastructure/AlpTaskManager.Infrastructure.csproj", "AlpTaskManager.Infrastructure/"]
COPY ["AlpTaskManager.Application/AlpTaskManager.Application.csproj", "AlpTaskManager.Application/"]

RUN dotnet restore "AlpTaskManager.API/AlpTaskManager.API.csproj"

COPY . .

WORKDIR "/src/AlpTaskManager.API"
RUN dotnet publish -c Release -o /app/out

FROM mcr.microsoft.com/dotnet/aspnet:9.0
WORKDIR /app
COPY --from=build /app/out .

EXPOSE 8080
ENV ASPNETCORE_URLS=http://+:8080

ENTRYPOINT ["dotnet", "AlpTaskManager.API.dll"]