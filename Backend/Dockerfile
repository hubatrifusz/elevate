FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /app

COPY . ./

WORKDIR /app/Elevate

RUN dotnet restore "Elevate.sln"
RUN dotnet publish "Elevate.csproj" -c Release -o /app/publish

FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS runtime
WORKDIR /app

COPY --from=build /app/publish .

EXPOSE 8080

ENTRYPOINT ["dotnet", "Elevate.dll", "--urls=http://0.0.0.0:8080"]