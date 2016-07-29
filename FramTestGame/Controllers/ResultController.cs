﻿using FramTestGame.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace FramTestGame.Controllers
{
    public class ResultController : Controller
    {
        // GET: Results
        public ActionResult Index()
        {
            String filename = Server.MapPath("~/Content/results.xml");
            PlayerContainer pc = PlayerContainer.Load(filename);
            Player model = (Player)TempData["player"];
            if (model != null)
            {
                pc.Players.Add(model);
                pc.Save(filename);
                TempData["player"] = null;
            }
            pc.Players = pc.Players.OrderByDescending(m => m.Score).ToList();
            return View(pc);
        }

        public ActionResult ClearResult()
        {
            String filename = Server.MapPath("~/Content/results.xml");
            PlayerContainer pc = new PlayerContainer();
            pc.Save(filename);
            return RedirectToAction("Index");
        }
    }
}