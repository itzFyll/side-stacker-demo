import express from 'express';
import cors from 'cors';
import router from 'routes/gameRoutes';

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());
app.use('/api', router);

app.listen(PORT, () => {
  console.log(`Side-stacker backend running on http://localhost:${PORT}`);
});
