let express = require("express");
path = require("path");
mongoose = require("mongoose");
dotenv = require("dotenv");
cors = require("cors");
bodyParser = require("body-parser");
mongoDb = require("./database/db");
morgan = require("morgan");

dotenv.config();

const URI = process.env.MONGODB_URL;

mongoose.connect(
  `${URI}`,
  {
    useCreateIndex: true,
    useFindAndModify: false,
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  (err) => {
    if (err) throw err;
    console.log("Mongodb connection");
  }
);

// mongoose.Promise = global.Promise;
// mongoose
//   .connect(mongoDb.db, {
//     useNewUrlParser: true,
//     useFindAndModify: false,
//     userUnifiedTopology: true,
//   })
//   .then(
//     () => {
//       console.log("Connected to database");
//     },
//     (error) => {
//       console.log("Database Error: " + error);
//     }
//   );

// mongoose.Promise = global.Promise;
// mongoose
//   .connect(process.env.MONGODB_URL, {
//     useNewUrlParser: true,
//     useFindAndModify: false,
//     useCreateIndex: true,
//     userUnifiedTopology: true,
//   })
//   .then(
//     () => {
//       console.log("Connected to database");
//     },
//     (error) => {
//       console.log("Database Error: " + error);
//     }
//   )
//   .catch((error) => console.log(`${error} did not connect`));

// const connectDB = async () => {
//   try {
//     await mongoose
//       .connect(mongoDb.db, {
//         useNewUrlParser: true,
//         useFindAndModify: true,
//         useCreateIndex: true,
//         userUnifiedTopology: true,
//       })
//       .then(
//         () => {
//           console.log("Connected to database");
//         },
//         (error) => {
//           console.log("Database Error: " + error);
//         }
//       );
//   } catch (err) {
//     console.error(err.message);
//     process.exit(1);
//   }
// };

const bookRoute = require("./routes/book.routes");
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(
  cors({
    origin: `${process.env.BASE_URL}`,
    credentials: true,
  })
);

//Static directory path
app.use(express.static(path.join(__dirname, "dist/")));
//Base route
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "dist/index.html"));
});

//API Root
app.use("/api", bookRoute);

//PORT
const port = process.env.PORT || 8000;
app.listen(port, () => {
  console.log("Listening on port: " + port);
});

//404 Handler
app.use((req, res, next) => {
  next(createError(404));
});

//error handler
app.use((err, req, res, next) => {
  console.error(err.message);
  if (!err.statusCode) err.statusCode = 500;
  res.status(err.statusCode).send(err.message);
});
