import express from 'express';
import cors from 'cors';
import { endpointsRouter } from './routes/router';
import { StatusCodes } from 'http-status-codes';

const app = express();
const port = 3000;

app.use(cors())
app.use(express.json());

app.use('/', endpointsRouter);

app.listen(port, () => {
    return console.log(`Express server is listening at  🚀`);
});


app.post("*", (req, res)=>{
    return res.status(StatusCodes.NOT_FOUND).json({success: false, message: "Not Found", data: {}});
})