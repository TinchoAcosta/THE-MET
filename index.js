import express from "express"
import path from "path"
import morgan from "morgan"
import rutas from "./routes/index.js"

const __dirname = path.dirname(new URL(import.meta.url).pathname)
const app = express()
const port = process.env.PORT || 3000

app.use(morgan("dev"))

app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'pug')
app.use(express.static(path.join(__dirname, 'public')))
app.use("/", rutas)
app.use('/api', (err, req, res, next) => {
  if (err.status === 404) {
    res.status(404).json({ error: 'Recurso no encontrado' });
  } else {
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});
app.listen(port, () => {console.log(`app funcionando en http://localhost:${port}`)})
