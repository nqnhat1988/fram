using Microsoft.Owin;
using Owin;

[assembly: OwinStartupAttribute(typeof(FramTestGame.Startup))]
namespace FramTestGame
{
    public partial class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            
        }
    }
}
