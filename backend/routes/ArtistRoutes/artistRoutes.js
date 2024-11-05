// routes/ArtistRoutes/artistRoutes.js
import express from "express";
import { protect, authorize } from "../../middleware/authMiddleware.js";
import {
  getAllArtists,
  getArtistProfile,
  updateArtistProfile,
  addPortfolioItem,
  updatePortfolioItem,
  deletePortfolioItem,
} from "../../controllers/Artists/artistController.js";

const router = express.Router();

// Public routes (if any)
router.get("/", getAllArtists); // This might be public to showcase artists

// Protected routes need both authentication and artist role
router.use(protect);
router.use(authorize("artist"));

router.get("/:userId", getArtistProfile);
router.put("/:userId", updateArtistProfile);
router.post("/:userId/portfolio", addPortfolioItem);
router.put("/:userId/portfolio/:itemId", updatePortfolioItem);
router.delete("/:userId/portfolio/:itemId", deletePortfolioItem);

export default router;
