using AutoMapper;
using API.Data;
using API.Helpers;
using API.Interfaces;
using API.services;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using API.SignalIr;

namespace API.Extensions
{
    public static class ApplicationServiceExtensions
    {
        public static IServiceCollection AddApplicationServices(this IServiceCollection services,IConfiguration config){
             services.AddScoped<ITokenService,TokenService>();
            var mapperConfig = new MapperConfiguration(mc =>
     {
         mc.AddProfile(new AutoMapperProfiles());
     });
    services.AddSingleton<presenceTracker>();
     services.AddScoped<LogUserActivity>();
    services.AddScoped<IUnitOfWork,UnitOfWork>();
     services.AddScoped<IPhotoService,photoService>();
      
    services.Configure<ClodinarySetting>(config.GetSection("CloudinarySettings"));
     IMapper mapper = mapperConfig.CreateMapper();
     services.AddSingleton(mapper);
           
            services.AddControllers();
            services.AddDbContext<DataContext>(options =>{
                options.UseSqlite(config.GetConnectionString("DefaultConnection"));
            });
            
            return services;
        }
    }
}