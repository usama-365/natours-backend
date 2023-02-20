const express = require("express");
const morgan = require("morgan");
const fs = require("node:fs");

// Constants
const PORT = 3000;
const TOURS_FILE_PATH = `${__dirname}/dev-data/data/tours-simple.json`;

// Conf
const app = express();
const tours = JSON.parse(fs.readFileSync(TOURS_FILE_PATH).toString());

// Middlewares
app.use(express.json());
app.use(morgan("dev"));

// Route handlers
const getAllTours = (req, res) => {
    res.status(200).json({
        status: "success",
        results: tours.length,
        data: {
            tours: tours
        }
    });
}

const getTour = (req, res) => {
    const id = +req.params.id;
    const tour = tours.find(tour => tour.id === id);
    if (tour) res.status(200).json({
        status: "successful",
        data: {
            tour: tour
        }
    }); else res.status(404).json({
        status: "fail",
        data: {
            message: "Tour with that ID not found"
        }
    });
}

const createTour = (req, res) => {
    const newID = tours[tours.length - 1].id + 1;
    const newTour = {
        id: newID,
        ...req.body
    };
    tours.push(newTour);
    fs.writeFile(TOURS_FILE_PATH, JSON.stringify(tours), () => {
        res.status(201).json({
            status: "success",
            data: {
                tour: newTour
            }
        });
    });
};

const updateTour = (req, res) => {
    res.status(200).json({
        status: "todo",
        message: "Feature hasn't been implemented yet"
    });
}

const deleteTour = (req, res) => {
    res.status(204).json({
        status: "successful",
        data: null
    });
}

const getAllUsers = (req, res) => {
    res.status(500).json({
        status: "error",
        message: "This route is not yet defined!"
    });
}

const getUser = (req, res) => {
    res.status(500).json({
        status: "error",
        message: "This route is not yet defined!"
    });
}

const createUser = (req, res) => {
    res.status(500).json({
        status: "error",
        message: "This route is not yet defined!"
    });
}

const updateUser = (req, res) => {
    res.status(500).json({
        status: "error",
        message: "This route is not yet defined!"
    });
}

const deleteUser = (req, res) => {
    res.status(500).json({
        status: "error",
        message: "This route is not yet defined!"
    });
}

// Routes
const tourRouter = express.Router();
const userRouter = express.Router();

tourRouter.route("/")
    .get(getAllTours)
    .post(createTour);

tourRouter.route("/:id")
    .get(getTour)
    .patch(updateTour)
    .delete(deleteTour);

userRouter.route("/")
    .get(getAllUsers)
    .post(createUser);

userRouter.route("/:id")
    .get(getUser)
    .patch(updateUser)
    .delete(deleteUser);

app.use("/api/v1/tours", tourRouter);
app.use("/api/v1/users", userRouter);

app.listen(PORT, () => {
    console.log(`Server is running locally on port ${PORT}`);
});
