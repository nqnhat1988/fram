using System;
using System.Collections.Generic;
using System.IO;
using System.Xml;
using System.Xml.Linq;
using System.Xml.Serialization;

namespace FramTestGame.Models
{
    [XmlRoot("PlayerCollection")]
    public class PlayerContainer
    {
        [XmlArray("Players"), XmlArrayItem("Player")]
        public List<Player> Players;

        public void Save(string path)
        {
            var serializer = new XmlSerializer(typeof(PlayerContainer));
            using (var stream = new FileStream(path, FileMode.Create))
            {
                serializer.Serialize(stream, this);
            }
        }

        public static PlayerContainer Load(string path)
        {
            var serializer = new XmlSerializer(typeof(PlayerContainer));
            using (var stream = new FileStream(path, FileMode.Open))
            {
                return serializer.Deserialize(stream) as PlayerContainer;
            }
        }

        //Loads the xml directly from the given string. Useful in combination with www.text.
        public static PlayerContainer LoadFromText(string text)
        {
            var serializer = new XmlSerializer(typeof(PlayerContainer));
            return serializer.Deserialize(new StringReader(text)) as PlayerContainer;
        }
    }
}