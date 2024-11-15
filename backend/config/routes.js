import userRoutes from "../routes/UserRoutes/userRoutes.js"
import artistRoutes from "../routes/ArtistRoutes/artistRoutes.js"
import requesterRoutes from "../routes/RequesterRoutes/requesterRoutes.js"
import jobRoutes from "../routes/JobRoutes/jobsRoutes.js"

export const configureRoutes = (app) => {
  app.use("/api/users", userRoutes)
  app.use("/api/artists", artistRoutes)
  app.use("/api/requesters", requesterRoutes)
  app.use("/api/jobs", jobRoutes)
}
