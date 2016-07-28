using FramTestGame.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace FramTestGame.Controllers
{
    public class GameController : Controller
    {
        // GET: Game
        public ActionResult Index()
        {
            return View();
        }

        public ActionResult Win(int score)
        {
            Player p = new Player();
            p.Score = score;
            return View(p);
        }

        [HttpPost]
        public ActionResult SavePlayer(String Name,String Score)
        {
            if (ModelState.IsValid)
            {
                Player p = new Player();
                p.Name = Name;
                p.Score = int.Parse(Score);
                TempData["player"] = p;
                return RedirectToAction("Index", "Result");
            }
            else
            {
                return View();
            }
        }
    }
}