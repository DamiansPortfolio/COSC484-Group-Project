import express from "express";
import { getArtists, getArtistById } from "../controllers/artistController.js";

const router = express.Router();

// Routes for fetching artists
router.get("/", getArtists); // Get all artists or filter/sort
router.get("/:id", getArtistById); // Get artist by ID

export default router;
