FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS base
WORKDIR /app

# Puerto dinámico de Railway
ENV ASPNETCORE_URLS=http://0.0.0.0:${PORT:-8080}

FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src
COPY ["DistribuidoraAPI.csproj", "."]
RUN dotnet restore
COPY . .
RUN dotnet publish -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=build /app/publish .
ENTRYPOINT ["dotnet", "DistribuidoraAPI.dll"]
