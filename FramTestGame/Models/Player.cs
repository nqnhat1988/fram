namespace FramTestGame.Models
{
    using System.ComponentModel.DataAnnotations;
    using System.Xml;
    using System.Xml.Serialization;

    public class Player
    {
        [Required]
        public string Name;
        public string Score;
    }
}